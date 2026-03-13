<?php

namespace App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Controllers;

use App\Base\Controllers\BaseController;
use App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Services\EkstrakurikulerService;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EkstrakurikulerController extends BaseController
{
    protected EkstrakurikulerService $service;

    public function __construct(EkstrakurikulerService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'kategori' => $request->input('kategori'),
            'status' => $request->input('status'),
        ];

        $ekstrakurikuler = $this->service->getPaginatedEkskul($filters, 15);
        $statistics = $this->service->getStatistics();

        return Inertia::render('School/Ekstrakurikuler/Index', [
            'ekstrakurikuler' => $ekstrakurikuler,
            'statistics' => $statistics,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $institutionId = $this->getInstitutionId();

        $pembina = User::where('institution_id', $institutionId)
            ->whereHas('roles', function ($q) {
                $q->whereIn('name', ['guru', 'admin']);
            })
            ->orderBy('name')
            ->get();

        return Inertia::render('School/Ekstrakurikuler/Create', [
            'pembina' => $pembina,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_ekskul' => 'required|string|max:255',
            'kategori' => 'required|in:olahraga,seni,sains,bahasa,keagamaan',
            'pembina_id' => 'required|exists:users,id',
            'jadwal' => 'nullable|array',
            'tempat' => 'nullable|string|max:255',
            'kuota' => 'required|integer|min:1',
            'biaya' => 'nullable|integer|min:0',
            'deskripsi' => 'nullable|string',
        ]);

        $institutionId = $this->getInstitutionId();
        $validated['institution_id'] = $institutionId;
        $validated['terisi'] = 0;

        $ekskul = \App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Models\Ekstrakurikuler::create($validated);

        return redirect()->route('school.ekstrakurikuler.index')
            ->with('success', 'Ekstrakurikuler berhasil dibuat');
    }

    public function edit($id)
    {
        $institutionId = $this->getInstitutionId();

        $ekskul = \App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Models\Ekstrakurikuler::where('institution_id', $institutionId)
            ->with(['pembina', 'anggota.siswa'])
            ->findOrFail($id);

        $pembina = User::where('institution_id', $institutionId)
            ->whereHas('roles', function ($q) {
                $q->whereIn('name', ['guru', 'admin']);
            })
            ->orderBy('name')
            ->get();

        return Inertia::render('School/Ekstrakurikuler/Edit', [
            'ekstrakurikuler' => $ekskul,
            'pembina' => $pembina,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_ekskul' => 'required|string|max:255',
            'kategori' => 'required|in:olahraga,seni,sains,bahasa,keagamaan',
            'pembina_id' => 'required|exists:users,id',
            'jadwal' => 'nullable|array',
            'tempat' => 'nullable|string|max:255',
            'kuota' => 'required|integer|min:1',
            'biaya' => 'nullable|integer|min:0',
            'deskripsi' => 'nullable|string',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $institutionId = $this->getInstitutionId();

        $ekskul = \App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Models\Ekstrakurikuler::where('institution_id', $institutionId)
            ->findOrFail($id);

        $ekskul->update($validated);

        return redirect()->route('school.ekstrakurikuler.index')
            ->with('success', 'Ekstrakurikuler berhasil diperbarui');
    }
}
