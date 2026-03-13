<?php

namespace App\Modules\InstitutionSpecific\Pesantren\IzinPulang\Controllers;

use App\Base\Controllers\BaseController;
use App\Modules\InstitutionSpecific\Pesantren\IzinPulang\Services\IzinPulangService;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IzinPulangController extends BaseController
{
    protected IzinPulangService $service;

    public function __construct(IzinPulangService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'jenis_izin' => $request->input('jenis_izin'),
        ];

        $izinPulang = $this->service->getPaginatedIzin($filters, 15);
        $statistics = $this->service->getStatistics();

        return Inertia::render('Pesantren/IzinPulang/Index', [
            'izinPulang' => $izinPulang,
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

        return Inertia::render('Pesantren/IzinPulang/Create', [
            'siswa' => $siswa,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'jenis_izin' => 'required|in:pulang,sakit,keperluan_keluarga,acara',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'tujuan' => 'required|string|max:255',
            'penjemput_nama' => 'required|string|max:255',
            'penjemput_hubungan' => 'required|string|max:50',
            'penjemput_telepon' => 'required|string|max:20',
            'alasan' => 'required|string',
        ]);

        $this->service->createIzin($validated);

        return redirect()->route('pesantren.izin-pulang.index')
            ->with('success', 'Pengajuan izin pulang berhasil dibuat');
    }

    public function edit($id)
    {
        $institutionId = $this->getInstitutionId();

        $izin = $this->service->getPaginatedIzin(['id' => $id], 1)->first();

        $siswa = Siswa::where('institution_id', $institutionId)
            ->with('kelas')
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('Pesantren/IzinPulang/Edit', [
            'izin' => $izin,
            'siswa' => $siswa,
        ]);
    }

    public function approve(Request $request, $id)
    {
        $validated = $request->validate([
            'catatan' => 'nullable|string',
        ]);

        $this->service->approveIzin($id, $validated['catatan'] ?? null);

        return back()->with('success', 'Izin pulang berhasil disetujui');
    }

    public function reject(Request $request, $id)
    {
        $validated = $request->validate([
            'alasan' => 'required|string',
        ]);

        $this->service->rejectIzin($id, $validated['alasan']);

        return back()->with('success', 'Izin pulang ditolak');
    }

    public function markReturn($id)
    {
        $this->service->markKembali($id);

        return back()->with('success', 'Siswa berhasil ditandai kembali');
    }
}
