<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Institution;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Imports\GuruImport;
use App\Exports\GuruTemplateExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class GuruController extends Controller
{
    public function index(Request $request)
    {
        $query = Guru::with('institution')->orderBy('nama_lengkap');

        // Auto-filter by logged-in user's institution
        $user = Auth::user();
        $userInstitutionId = $user ? $user->institution_id : null;

        // If user has institution, auto-filter by it (unless manually filtering by another institution)
        if ($userInstitutionId && !$request->has('institution_id')) {
            $query->where('institution_id', $userInstitutionId);
        } elseif ($request->has('institution_id') && $request->institution_id != '') {
            // Manual filter by institution (for super admin)
            $query->where('institution_id', $request->institution_id);
        }

        $guru = $query->paginate(15)->withQueryString();
        $institutions = Institution::select('id', 'name')->where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Akademik/Guru/Index', [
            'guru' => $guru,
            'institutions' => $institutions,
            'filters' => $request->only(['institution_id']),
            'userInstitutionId' => $userInstitutionId,
        ]);
    }

    public function create()
    {
        $user = Auth::user();

        // Get institutions
        $institutions = Institution::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        // Get kelas with relations
        $kelas = Kelas::with(['jenjang', 'jurusan'])
            ->orderBy('tingkat')
            ->orderBy('nama_kelas')
            ->get()
            ->map(function ($k) {
                return [
                    'id' => $k->id,
                    'nama' => $k->nama_kelas,
                    'tingkat' => $k->tingkat,
                    'jenjang' => $k->jenjang->nama ?? '',
                    'jurusan' => $k->jurusan ? $k->jurusan->nama : null,
                    'label' => $k->jenjang->nama . ' - Kelas ' . $k->nama_kelas . ($k->jurusan ? ' (' . $k->jurusan->nama . ')' : ''),
                ];
            });

        // Get mata pelajaran
        $mataPelajaran = MataPelajaran::with('jenjang')
            ->orderBy('nama')
            ->get()
            ->map(function ($mp) {
                return [
                    'id' => $mp->id,
                    'nama' => $mp->nama,
                    'kode' => $mp->kode,
                    'jenjang' => $mp->jenjang->nama ?? '',
                    'label' => $mp->nama . ' (' . ($mp->jenjang->nama ?? 'Umum') . ')',
                ];
            });

        return Inertia::render('Akademik/Guru/Create', [
            'institutions' => $institutions,
            'kelasList' => $kelas,
            'mataPelajaranList' => $mataPelajaran,
            'userInstitutionId' => $user->institution_id,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'institution_id' => 'nullable|exists:institutions,id',
            'nip' => 'required|string|max:20|unique:guru,nip',
            'nuptk' => 'nullable|string|max:20',
            'nik' => 'nullable|string|max:20',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'email' => 'nullable|email|max:255',
            'no_hp' => 'required|string|max:15',
            'pendidikan_terakhir' => 'required|string|max:255',
            'jurusan' => 'nullable|string|max:255',
            'status_kepegawaian' => 'required|in:PNS,PPPK,GTY,PTY',
            'status' => 'required|in:aktif,cuti,pensiun',
            'tanggal_masuk' => 'required|date',
            'kelas_ids' => 'nullable|array',
            'kelas_ids.*' => 'exists:kelas,id',
            'mata_pelajaran_ids' => 'nullable|array',
            'mata_pelajaran_ids.*' => 'exists:mata_pelajaran,id',
        ]);

        DB::beginTransaction();
        try {
            // Set institution_id from user if not provided
            if (!isset($validated['institution_id'])) {
                $validated['institution_id'] = Auth::user()->institution_id;
            }

            // Extract pivot data
            $kelasIds = $validated['kelas_ids'] ?? [];
            $mataPelajaranIds = $validated['mata_pelajaran_ids'] ?? [];
            unset($validated['kelas_ids'], $validated['mata_pelajaran_ids']);

            // Create guru
            $guru = Guru::create($validated);

            // Sync relationships
            if (!empty($kelasIds)) {
                $guru->kelas()->sync($kelasIds);
            }

            if (!empty($mataPelajaranIds)) {
                $guru->mataPelajaran()->sync($mataPelajaranIds);
            }

            DB::commit();

            return redirect()->route('akademik.guru.index')
                ->with('success', 'Data guru berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()
                ->withInput()
                ->with('error', 'Gagal menambahkan data guru: ' . $e->getMessage());
        }
    }

    public function edit(Guru $guru)
    {
        $user = Auth::user();

        // Load existing relationships
        $guru->load(['kelas', 'mataPelajaran']);

        // Get institutions
        $institutions = Institution::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        // Get kelas with relations
        $kelas = Kelas::with(['jenjang', 'jurusan'])
            ->orderBy('tingkat')
            ->orderBy('nama_kelas')
            ->get()
            ->map(function ($k) {
                return [
                    'id' => $k->id,
                    'nama' => $k->nama_kelas,
                    'tingkat' => $k->tingkat,
                    'jenjang' => $k->jenjang->nama ?? '',
                    'jurusan' => $k->jurusan ? $k->jurusan->nama : null,
                    'label' => ($k->jenjang->nama ?? '') . ' - Kelas ' . $k->nama_kelas . ($k->jurusan ? ' (' . $k->jurusan->nama . ')' : ''),
                ];
            });

        // Get mata pelajaran
        $mataPelajaran = MataPelajaran::with('jenjang')
            ->orderBy('nama')
            ->get()
            ->map(function ($mp) {
                return [
                    'id' => $mp->id,
                    'nama' => $mp->nama,
                    'kode' => $mp->kode,
                    'jenjang' => $mp->jenjang->nama ?? '',
                    'label' => $mp->nama . ' (' . ($mp->jenjang->nama ?? 'Umum') . ')',
                ];
            });

        // Prepare guru data with selected IDs
        $guruData = $guru->toArray();
        $guruData['kelas_ids'] = $guru->kelas->pluck('id')->toArray();
        $guruData['mata_pelajaran_ids'] = $guru->mataPelajaran->pluck('id')->toArray();

        return Inertia::render('Akademik/Guru/Edit', [
            'guru' => $guruData,
            'institutions' => $institutions,
            'kelasList' => $kelas,
            'mataPelajaranList' => $mataPelajaran,
            'userInstitutionId' => $user->institution_id,
        ]);
    }

    public function update(Request $request, Guru $guru)
    {
        $validated = $request->validate([
            'institution_id' => 'nullable|exists:institutions,id',
            'nip' => 'required|string|max:20|unique:guru,nip,' . $guru->id,
            'nuptk' => 'nullable|string|max:20',
            'nik' => 'nullable|string|max:20',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'email' => 'nullable|email|max:255',
            'no_hp' => 'required|string|max:15',
            'pendidikan_terakhir' => 'required|string|max:255',
            'jurusan' => 'nullable|string|max:255',
            'status_kepegawaian' => 'required|in:PNS,PPPK,GTY,PTY',
            'status' => 'required|in:aktif,cuti,pensiun',
            'tanggal_masuk' => 'required|date',
            'tanggal_keluar' => 'nullable|date',
            'kelas_ids' => 'nullable|array',
            'kelas_ids.*' => 'exists:kelas,id',
            'mata_pelajaran_ids' => 'nullable|array',
            'mata_pelajaran_ids.*' => 'exists:mata_pelajaran,id',
        ]);

        DB::beginTransaction();
        try {
            // Extract pivot data
            $kelasIds = $validated['kelas_ids'] ?? [];
            $mataPelajaranIds = $validated['mata_pelajaran_ids'] ?? [];
            unset($validated['kelas_ids'], $validated['mata_pelajaran_ids']);

            // Update guru
            $guru->update($validated);

            // Sync relationships
            $guru->kelas()->sync($kelasIds);
            $guru->mataPelajaran()->sync($mataPelajaranIds);

            DB::commit();

            return redirect()->route('akademik.guru.index')
                ->with('success', 'Data guru berhasil diperbarui');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()
                ->withInput()
                ->with('error', 'Gagal memperbarui data guru: ' . $e->getMessage());
        }
    }

    public function destroy(Guru $guru)
    {
        $guru->delete();

        return redirect()->route('akademik.guru.index')
            ->with('success', 'Data guru berhasil dihapus');
    }

    /**
     * Get kelas and mata pelajaran for AJAX requests
     * Since kelas and mata_pelajaran are master data (not scoped by institution),
     * we return all available options
     */
    public function getDataByInstitution(Request $request)
    {
        // Get all kelas
        $kelas = Kelas::with(['jenjang', 'jurusan'])
            ->orderBy('tingkat')
            ->orderBy('nama_kelas')
            ->get()
            ->map(function ($k) {
                return [
                    'id' => $k->id,
                    'nama' => $k->nama_kelas,
                    'tingkat' => $k->tingkat,
                    'jenjang' => $k->jenjang->nama ?? '',
                    'jurusan' => $k->jurusan ? $k->jurusan->nama : null,
                    'label' => ($k->jenjang->nama ?? '') . ' - Kelas ' . $k->nama_kelas . ($k->jurusan ? ' (' . $k->jurusan->nama . ')' : ''),
                ];
            });

        // Get all mata pelajaran
        $mataPelajaran = MataPelajaran::with('jenjang')
            ->orderBy('nama')
            ->get()
            ->map(function ($mp) {
                return [
                    'id' => $mp->id,
                    'nama' => $mp->nama,
                    'kode' => $mp->kode,
                    'jenjang' => $mp->jenjang->nama ?? '',
                    'label' => $mp->nama . ' (' . ($mp->jenjang->nama ?? 'Umum') . ')',
                ];
            });

        return response()->json([
            'kelasList' => $kelas,
            'mataPelajaranList' => $mataPelajaran,
        ]);
    }

    public function syncData()
    {
        try {
            // Get all guru records
            $guruList = Guru::whereNotNull('user_id')->with('user')->get();

            $synced = 0;
            $skipped = 0;

            foreach ($guruList as $guru) {
                if ($guru->user) {
                    // Update guru data from user data
                    $updated = $guru->update([
                        'nama_lengkap' => $guru->user->name,
                        'email' => $guru->user->email,
                        'no_hp' => $guru->user->phone ?? $guru->no_hp,
                        'alamat' => $guru->user->address ?? $guru->alamat,
                    ]);

                    if ($updated) {
                        $synced++;
                    } else {
                        $skipped++;
                    }
                } else {
                    $skipped++;
                }
            }

            return redirect()->back()->with(
                'success',
                "Sinkronisasi selesai! {$synced} data guru berhasil disinkronkan dengan user, {$skipped} dilewati."
            );
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal sinkronisasi: ' . $e->getMessage());
        }
    }

    public function importForm()
    {
        return Inertia::render('Akademik/Guru/Import');
    }

    public function import(Request $request)
    {
        $request->validate(['file' => 'required|mimes:xlsx,xls,csv|max:5120']);
        try {
            $import = new GuruImport();
            Excel::import($import, $request->file('file'));
            $successCount = $import->getSuccessCount();
            $errorCount   = $import->getErrorCount();
            $errors       = $import->getErrors();
            if ($errorCount > 0) {
                return redirect()->route('akademik.guru.index')
                    ->with('warning', "Berhasil import {$successCount} data, {$errorCount} gagal: " . implode('; ', $errors));
            }
            return redirect()->route('akademik.guru.index')
                ->with('success', "Berhasil import {$successCount} data guru");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function downloadTemplate()
    {
        return Excel::download(new GuruTemplateExport(), 'template_import_guru.xlsx');
    }
}
