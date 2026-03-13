<?php

namespace App\Modules\InstitutionSpecific\Pesantren\Asrama\Controllers;

use App\Base\Controllers\BaseController;
use App\Models\User;
use App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\Asrama;
use App\Modules\InstitutionSpecific\Pesantren\Asrama\Services\AsramaService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AsramaController extends BaseController
{
    protected AsramaService $service;

    public function __construct(AsramaService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $asrama = $this->service->getPaginatedAsrama(12, $search);

        $institutionId = $this->getInstitutionId();
        $statsQuery = Asrama::query();

        if ($institutionId) {
            $statsQuery->where('institution_id', $institutionId);
        }

        $totalAsrama = (clone $statsQuery)->count();
        $asramaAktif = (clone $statsQuery)->where('status', 'aktif')->count();
        $totalKapasitas = (clone $statsQuery)->sum('kapasitas');
        $totalTerisi = (clone $statsQuery)->sum('terisi');

        return Inertia::render('Pesantren/Asrama/Index', [
            'asrama' => $asrama,
            'filters' => [
                'search' => $search,
            ],
            'stats' => [
                'total_asrama' => $totalAsrama,
                'asrama_aktif' => $asramaAktif,
                'total_kapasitas' => (int) $totalKapasitas,
                'total_terisi' => (int) $totalTerisi,
            ],
        ]);
    }

    public function create()
    {
        $institutionId = $this->getInstitutionId();
        $pengurus = User::query()
            ->where('institution_id', $institutionId)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Pesantren/Asrama/Create', [
            'pengurus' => $pengurus,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_asrama' => 'required|string|max:255',
            'jenis' => 'required|in:putra,putri',
            'kapasitas' => 'required|integer|min:1',
            'pengurus_id' => 'nullable|exists:users,id',
            'alamat' => 'nullable|string',
            'fasilitas' => 'nullable|array',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $this->service->create($validated);

        return redirect()->route('pesantren.asrama.index')
            ->with('success', 'Data asrama berhasil ditambahkan.');
    }

    public function edit(int $id)
    {
        $institutionId = $this->getInstitutionId();
        $asrama = Asrama::query()
            ->where('institution_id', $institutionId)
            ->findOrFail($id);

        $pengurus = User::query()
            ->where('institution_id', $institutionId)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Pesantren/Asrama/Edit', [
            'asrama' => $asrama,
            'pengurus' => $pengurus,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'nama_asrama' => 'required|string|max:255',
            'jenis' => 'required|in:putra,putri',
            'kapasitas' => 'required|integer|min:1',
            'pengurus_id' => 'nullable|exists:users,id',
            'alamat' => 'nullable|string',
            'fasilitas' => 'nullable|array',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $this->service->update($id, $validated);

        return redirect()->route('pesantren.asrama.index')
            ->with('success', 'Data asrama berhasil diperbarui.');
    }
}
