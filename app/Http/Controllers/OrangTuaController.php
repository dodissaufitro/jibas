<?php

namespace App\Http\Controllers;

use App\Models\Institution;
use App\Models\Kelas;
use App\Models\OrangTua;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrangTuaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = OrangTua::with(['siswa.kelas.jenjang', 'siswa.institution', 'user']);

        // Auto-filter by logged-in user's institution
        $user = Auth::user();
        $userInstitutionId = $user ? $user->institution_id : null;

        // If user has institution, auto-filter by it (unless manually filtering by another institution)
        if ($userInstitutionId && !$request->has('institution_id')) {
            $query->whereHas('siswa', function ($q) use ($userInstitutionId) {
                $q->where('institution_id', $userInstitutionId);
            });
        } elseif ($request->has('institution_id') && $request->institution_id != '') {
            // Manual filter by institution (for super admin)
            $query->whereHas('siswa', function ($q) use ($request) {
                $q->where('institution_id', $request->institution_id);
            });
        }

        // Auto-filter by guru's assigned kelas if user is a guru with specific kelas access
        if ($user && $user->guru && $user->guru->kelas()->exists()) {
            $kelasIds = $user->guru->kelas()->pluck('kelas.id')->toArray();
            if (!empty($kelasIds)) {
                $query->whereHas('siswa', function ($q) use ($kelasIds) {
                    $q->whereIn('kelas_id', $kelasIds);
                });
            }
        }

        // Search functionality
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_ayah', 'like', "%{$search}%")
                    ->orWhere('nama_ibu', 'like', "%{$search}%")
                    ->orWhere('no_hp', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('siswa', function ($q) use ($search) {
                        $q->where('nama_lengkap', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by kelas (from siswa)
        if ($request->has('kelas_id') && $request->kelas_id != '') {
            $query->whereHas('siswa', function ($q) use ($request) {
                $q->where('kelas_id', $request->kelas_id);
            });
        }

        $orangTua = $query->latest()->paginate(10)->withQueryString();
        $kelasList = Kelas::with('jenjang', 'jurusan')->orderBy('tingkat')->orderBy('nama_kelas')->get();
        $institutions = Institution::select('id', 'name')->where('is_active', true)->orderBy('name')->get();

        return Inertia::render('OrangTua/Index', [
            'orangTua' => $orangTua,
            'kelasList' => $kelasList,
            'institutions' => $institutions,
            'filters' => $request->only(['search', 'kelas_id', 'institution_id']),
            'userInstitutionId' => $userInstitutionId,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get all siswa that don't have orang tua yet
        $siswaList = Siswa::select('id', 'nama_lengkap', 'nisn')
            ->whereDoesntHave('orangTua')
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('OrangTua/Create', [
            'siswaList' => $siswaList,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'nama_ayah' => 'required|string|max:255',
            'nik_ayah' => 'nullable|string|max:16',
            'pekerjaan_ayah' => 'nullable|string|max:255',
            'penghasilan_ayah' => 'nullable|numeric',
            'nama_ibu' => 'required|string|max:255',
            'nik_ibu' => 'nullable|string|max:16',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'penghasilan_ibu' => 'nullable|numeric',
            'alamat' => 'required|string',
            'no_hp' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        try {
            OrangTua::create($validated);

            return redirect()->route('orangtua.data')
                ->with('success', 'Data orang tua berhasil ditambahkan');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menambahkan data orang tua: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $orangTua = OrangTua::with(['siswa', 'user'])->findOrFail($id);

        return Inertia::render('OrangTua/Show', [
            'orangTua' => $orangTua,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $orangTua = OrangTua::with('siswa')->findOrFail($id);

        // Get all siswa for selection
        $siswaList = Siswa::select('id', 'nama_lengkap', 'nisn')
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('OrangTua/Edit', [
            'orangTua' => $orangTua,
            'siswaList' => $siswaList,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $orangTua = OrangTua::findOrFail($id);

        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'nama_ayah' => 'required|string|max:255',
            'nik_ayah' => 'nullable|string|max:16',
            'pekerjaan_ayah' => 'nullable|string|max:255',
            'penghasilan_ayah' => 'nullable|numeric',
            'nama_ibu' => 'required|string|max:255',
            'nik_ibu' => 'nullable|string|max:16',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'penghasilan_ibu' => 'nullable|numeric',
            'alamat' => 'required|string',
            'no_hp' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        try {
            $orangTua->update($validated);

            return redirect()->route('orangtua.data')
                ->with('success', 'Data orang tua berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui data orang tua: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $orangTua = OrangTua::findOrFail($id);
            $orangTua->delete();

            return redirect()->route('orangtua.data')
                ->with('success', 'Data orang tua berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus data orang tua: ' . $e->getMessage());
        }
    }
}
