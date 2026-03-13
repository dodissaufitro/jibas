<?php

namespace App\Modules\InstitutionSpecific\Madrasah\EvaluasiIbadah\Controllers;

use App\Base\Controllers\BaseController;
use App\Modules\InstitutionSpecific\Madrasah\EvaluasiIbadah\Services\EvaluasiIbadahService;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EvaluasiIbadahController extends BaseController
{
    protected EvaluasiIbadahService $service;

    public function __construct(EvaluasiIbadahService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'bulan' => $request->input('bulan'),
            'tahun' => $request->input('tahun', now()->year),
        ];

        $evaluasi = $this->service->getPaginatedEvaluasi($filters, 15);
        $statistics = $this->service->getStatistics($filters['bulan'], $filters['tahun']);

        return Inertia::render('Madrasah/EvaluasiIbadah/Index', [
            'evaluasi' => $evaluasi,
            'statistics' => $statistics,
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

        return Inertia::render('Madrasah/EvaluasiIbadah/Create', [
            'siswa' => $siswa,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2020',
            'shalat_fardhu' => 'required|numeric|min:0|max:100',
            'shalat_dhuha' => 'required|numeric|min:0|max:100',
            'shalat_tahajud' => 'required|numeric|min:0|max:100',
            'membaca_quran' => 'required|numeric|min:0|max:100',
            'hafalan_quran' => 'required|numeric|min:0|max:100',
            'puasa_sunnah' => 'required|integer|min:0',
            'infaq_sedekah' => 'required|integer|min:0',
            'kegiatan_keagamaan' => 'required|integer|min:0',
            'catatan' => 'nullable|string',
        ]);

        $this->service->createEvaluasi($validated);

        return redirect()->route('madrasah.evaluasi-ibadah.index')
            ->with('success', 'Evaluasi ibadah berhasil ditambahkan');
    }

    public function edit($id)
    {
        $institutionId = $this->getInstitutionId();

        $evaluasi = \App\Modules\InstitutionSpecific\Madrasah\EvaluasiIbadah\Models\EvaluasiIbadah::where('institution_id', $institutionId)
            ->with('siswa.kelas')
            ->findOrFail($id);

        $siswa = Siswa::where('institution_id', $institutionId)
            ->with('kelas')
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('Madrasah/EvaluasiIbadah/Edit', [
            'evaluasi' => $evaluasi,
            'siswa' => $siswa,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2020',
            'shalat_fardhu' => 'required|numeric|min:0|max:100',
            'shalat_dhuha' => 'required|numeric|min:0|max:100',
            'shalat_tahajud' => 'required|numeric|min:0|max:100',
            'membaca_quran' => 'required|numeric|min:0|max:100',
            'hafalan_quran' => 'required|numeric|min:0|max:100',
            'puasa_sunnah' => 'required|integer|min:0',
            'infaq_sedekah' => 'required|integer|min:0',
            'kegiatan_keagamaan' => 'required|integer|min:0',
            'catatan' => 'nullable|string',
        ]);

        $this->service->updateEvaluasi($id, $validated);

        return redirect()->route('madrasah.evaluasi-ibadah.index')
            ->with('success', 'Evaluasi ibadah berhasil diperbarui');
    }
}
