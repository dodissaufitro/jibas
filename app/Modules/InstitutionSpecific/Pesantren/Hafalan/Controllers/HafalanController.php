<?php

namespace App\Modules\InstitutionSpecific\Pesantren\Hafalan\Controllers;

use App\Base\Controllers\BaseController;
use App\Modules\InstitutionSpecific\Pesantren\Hafalan\Models\HafalanQuran;
use App\Modules\InstitutionSpecific\Pesantren\Hafalan\Services\HafalanService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HafalanController extends BaseController
{
    protected HafalanService $hafalanService;

    public function __construct(HafalanService $hafalanService)
    {
        $this->hafalanService = $hafalanService;
    }

    /**
     * Display a listing of hafalan records.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');

        $hafalan = $this->hafalanService->getPaginatedHafalan($perPage, $search);

        return Inertia::render('Pesantren/Hafalan/Index', [
            'hafalan' => $hafalan,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new hafalan record.
     */
    public function create()
    {
        $institutionId = $this->getInstitutionId();
        if (!$institutionId) {
            abort(403, 'Institution not found');
        }

        // Get list of santri for dropdown
        $santri = \App\Models\Siswa::forInstitution($institutionId)
            ->where('status', 'aktif')
            ->select('id', 'nis', 'nama_lengkap')
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('Pesantren/Hafalan/Create', [
            'santri' => $santri,
        ]);
    }

    /**
     * Store a newly created hafalan record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'juz' => 'required|integer|min:1|max:30',
            'surat' => 'required|string|max:100',
            'ayat_dari' => 'required|integer|min:1',
            'ayat_sampai' => 'required|integer|min:1',
            'tanggal_setoran' => 'required|date',
            'nilai' => 'required|in:A,B,C,D',
            'keterangan' => 'nullable|string|max:500',
        ]);

        try {
            $hafalan = $this->hafalanService->create($validated);

            return redirect()
                ->route('pesantren.hafalan.index')
                ->with('success', 'Data hafalan berhasil ditambahkan');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Gagal menambahkan data hafalan: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified hafalan record.
     */
    public function show(int $id)
    {
        $institutionId = $this->getInstitutionId();
        if (!$institutionId) {
            abort(403, 'Institution not found');
        }

        $hafalan = HafalanQuran::with(['siswa', 'penguji'])
            ->forInstitution($institutionId)
            ->findOrFail($id);

        return Inertia::render('Pesantren/Hafalan/Show', [
            'hafalan' => $hafalan,
        ]);
    }

    /**
     * Show the form for editing the specified hafalan record.
     */
    public function edit(int $id)
    {
        $institutionId = $this->getInstitutionId();
        if (!$institutionId) {
            abort(403, 'Institution not found');
        }

        $hafalan = HafalanQuran::with('siswa')
            ->forInstitution($institutionId)
            ->findOrFail($id);

        $santri = \App\Models\Siswa::forInstitution($institutionId)
            ->where('status', 'aktif')
            ->select('id', 'nis', 'nama_lengkap')
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('Pesantren/Hafalan/Edit', [
            'hafalan' => $hafalan,
            'santri' => $santri,
        ]);
    }

    /**
     * Update the specified hafalan record.
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'juz' => 'required|integer|min:1|max:30',
            'surat' => 'required|string|max:100',
            'ayat_dari' => 'required|integer|min:1',
            'ayat_sampai' => 'required|integer|min:1',
            'tanggal_setoran' => 'required|date',
            'nilai' => 'required|in:A,B,C,D',
            'keterangan' => 'nullable|string|max:500',
        ]);

        try {
            $hafalan = $this->hafalanService->update($id, $validated);

            return redirect()
                ->route('pesantren.hafalan.index')
                ->with('success', 'Data hafalan berhasil diperbarui');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Gagal memperbarui data hafalan: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified hafalan record.
     */
    public function destroy(int $id)
    {
        try {
            $institutionId = $this->getInstitutionId();
            if (!$institutionId) {
                abort(403, 'Institution not found');
            }

            $hafalan = HafalanQuran::forInstitution($institutionId)
                ->findOrFail($id);

            $hafalan->delete();

            return redirect()
                ->route('pesantren.hafalan.index')
                ->with('success', 'Data hafalan berhasil dihapus');
        } catch (\Exception $e) {
            return back()
                ->with('error', 'Gagal menghapus data hafalan: ' . $e->getMessage());
        }
    }

    /**
     * Get hafalan progress for a specific student.
     */
    public function progress(int $siswaId)
    {
        $progress = $this->hafalanService->getHafalanProgress($siswaId);
        $hafalan = $this->hafalanService->getHafalanBySiswa($siswaId);

        return Inertia::render('Pesantren/Hafalan/Progress', [
            'progress' => $progress,
            'hafalan' => $hafalan,
            'siswaId' => $siswaId,
        ]);
    }
}
