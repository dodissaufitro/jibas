<?php

namespace App\Modules\InstitutionSpecific\School\Analisis\Controllers;

use App\Base\Controllers\BaseController;
use App\Modules\InstitutionSpecific\School\Analisis\Services\PrestasiService;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrestasiController extends BaseController
{
    protected PrestasiService $service;

    public function __construct(PrestasiService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'jenis' => $request->input('jenis'),
            'tingkat' => $request->input('tingkat'),
            'tahun' => $request->input('tahun'),
        ];

        $prestasi = $this->service->getPaginatedPrestasi($filters, 15);
        $statistics = $this->service->getStatistics();
        $ranking = $this->service->getRankingSiswa(10);

        return Inertia::render('School/Prestasi/Index', [
            'prestasi' => $prestasi,
            'statistics' => $statistics,
            'ranking' => $ranking,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $institutionId = $this->getInstitutionId();

        $siswa = Siswa::where('institution_id', $institutionId)
            ->with('kelas')
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('School/Prestasi/Create', [
            'siswa' => $siswa,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'jenis' => 'required|in:akademik,non_akademik',
            'kategori' => 'required|string|max:255',
            'nama_prestasi' => 'required|string|max:255',
            'tingkat' => 'required|in:sekolah,kecamatan,kabupaten,provinsi,nasional,internasional',
            'peringkat' => 'required|string|max:50',
            'penyelenggara' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'sertifikat_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'keterangan' => 'nullable|string',
        ]);

        $this->service->createPrestasi($validated);

        return redirect()->route('school.prestasi.index')
            ->with('success', 'Prestasi berhasil ditambahkan');
    }

    public function edit($id)
    {
        $institutionId = $this->getInstitutionId();

        $prestasi = \App\Modules\InstitutionSpecific\School\Analisis\Models\PrestasiSiswa::where('institution_id', $institutionId)
            ->with('siswa.kelas')
            ->findOrFail($id);

        $siswa = Siswa::where('institution_id', $institutionId)
            ->with('kelas')
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('School/Prestasi/Edit', [
            'prestasi' => $prestasi,
            'siswa' => $siswa,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'jenis' => 'required|in:akademik,non_akademik',
            'kategori' => 'required|string|max:255',
            'nama_prestasi' => 'required|string|max:255',
            'tingkat' => 'required|in:sekolah,kecamatan,kabupaten,provinsi,nasional,internasional',
            'peringkat' => 'required|string|max:50',
            'penyelenggara' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'sertifikat_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'keterangan' => 'nullable|string',
        ]);

        $this->service->updatePrestasi($id, $validated);

        return redirect()->route('school.prestasi.index')
            ->with('success', 'Prestasi berhasil diperbarui');
    }
}
