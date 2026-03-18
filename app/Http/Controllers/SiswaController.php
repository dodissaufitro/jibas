<?php

namespace App\Http\Controllers;

use App\Models\Institution;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Imports\SiswaImport;
use App\Exports\SiswaTemplateExport;
use App\Exports\SiswaExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Validation\ValidationException;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = Siswa::with(['kelas.jenjang', 'kelas.jurusan', 'institution'])
            ->orderBy('nama_lengkap');

        $user = Auth::user();
        $userInstitutionId = $user ? $user->institution_id : null;

        // Filter by institution ONLY if explicitly requested
        if ($request->filled('institution_id')) {
            $query->where('institution_id', $request->institution_id);
        }

        // Filter by kelas ONLY if explicitly requested
        if ($request->filled('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }

        // Search by name or NIS
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        $siswa = $query->paginate(15)->withQueryString();
        $kelasList = Kelas::with('jenjang', 'jurusan')
            ->orderBy('tingkat')
            ->orderBy('nama_kelas')
            ->get();
        $institutions = Institution::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Akademik/Siswa/Index', [
            'siswa' => $siswa,
            'kelasList' => $kelasList,
            'institutions' => $institutions,
            'filters' => $request->only(['kelas_id', 'institution_id', 'search']),
            'userInstitutionId' => $userInstitutionId,
        ]);
    }

    public function create()
    {
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();

        return Inertia::render('Akademik/Siswa/Create', [
            'kelas' => $kelas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:20|unique:siswa,nis',
            'nisn' => 'required|string|max:20|unique:siswa,nisn',
            'nik' => 'nullable|string|max:20',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'email' => 'nullable|email|max:255',
            'no_hp' => 'nullable|string|max:15',
            'nama_ayah' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'no_hp_ortu' => 'required|string|max:15',
            'kelas_id' => 'required|exists:kelas,id',
            'status' => 'required|in:aktif,lulus,pindah,keluar',
            'tanggal_masuk' => 'required|date',
        ]);

        Siswa::create($validated);

        return redirect()->route('akademik.siswa.index')
            ->with('success', 'Data siswa berhasil ditambahkan');
    }

    public function edit(Siswa $siswa)
    {
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();

        return Inertia::render('Akademik/Siswa/Edit', [
            'siswa' => $siswa->load('kelas'),
            'kelas' => $kelas
        ]);
    }

    public function update(Request $request, Siswa $siswa)
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:20|unique:siswa,nis,' . $siswa->id,
            'nisn' => 'required|string|max:20|unique:siswa,nisn,' . $siswa->id,
            'nik' => 'nullable|string|max:20',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'email' => 'nullable|email|max:255',
            'no_hp' => 'nullable|string|max:15',
            'nama_ayah' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'no_hp_ortu' => 'required|string|max:15',
            'kelas_id' => 'required|exists:kelas,id',
            'status' => 'required|in:aktif,lulus,pindah,keluar',
            'tanggal_masuk' => 'required|date',
            'tanggal_keluar' => 'nullable|date',
        ]);

        $siswa->update($validated);

        return redirect()->route('akademik.siswa.index')
            ->with('success', 'Data siswa berhasil diperbarui');
    }

    public function destroy(Siswa $siswa)
    {
        $siswa->delete();

        return redirect()->route('akademik.siswa.index')
            ->with('success', 'Data siswa berhasil dihapus');
    }

    /**
     * Show import form
     */
    public function importForm()
    {
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();

        return Inertia::render('Akademik/Siswa/Import', [
            'kelas' => $kelas
        ]);
    }

    /**
     * Import siswa from Excel
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ], [
            'file.required' => 'File Excel wajib dipilih',
            'file.mimes' => 'File harus berformat Excel (.xlsx, .xls, atau .csv)',
            'file.max' => 'Ukuran file maksimal 2MB',
        ]);

        try {
            $import = new SiswaImport();
            Excel::import($import, $request->file('file'));

            $successCount = $import->getSuccessCount();
            $errorCount = $import->getErrorCount();
            $errors = $import->getErrors();

            if ($errorCount > 0) {
                $errorMessage = "Berhasil import {$successCount} data, {$errorCount} data gagal. Errors: " . implode('; ', $errors);
                return redirect()->route('akademik.siswa.index')
                    ->with('warning', $errorMessage);
            }

            return redirect()->route('akademik.siswa.index')
                ->with('success', "Berhasil import {$successCount} data siswa");
        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->with('error', 'Validasi gagal: ' . implode('; ', array_map(fn($err) => implode(', ', $err), $e->errors())));
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Download template Excel for import
     */
    public function downloadTemplate()
    {
        return Excel::download(new SiswaTemplateExport(), 'template_import_siswa.xlsx');
    }

    /**
     * Export siswa to Excel
     */
    public function export(Request $request)
    {
        $kelasId = $request->input('kelas_id');
        $institutionId = $request->input('institution_id');

        return Excel::download(
            new SiswaExport($kelasId, $institutionId),
            'data_siswa_' . date('Y-m-d_His') . '.xlsx'
        );
    }
}
