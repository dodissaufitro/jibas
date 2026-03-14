<?php

namespace App\Http\Controllers;

use App\Models\Institution;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = Siswa::with('kelas.jenjang', 'institution')->orderBy('nama_lengkap');

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

        // Auto-filter by guru's assigned kelas if user is a guru with specific kelas access
        if ($user && $user->guru && $user->guru->kelas()->exists()) {
            $kelasIds = $user->guru->kelas()->pluck('kelas.id')->toArray();
            if (!empty($kelasIds)) {
                $query->whereIn('kelas_id', $kelasIds);
            }
        }

        // Filter by kelas
        if ($request->has('kelas_id') && $request->kelas_id != '') {
            $query->where('kelas_id', $request->kelas_id);
        }

        $siswa = $query->paginate(15)->withQueryString();
        $kelasList = Kelas::with('jenjang', 'jurusan')->orderBy('tingkat')->orderBy('nama_kelas')->get();
        $institutions = Institution::select('id', 'name')->where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Akademik/Siswa/Index', [
            'siswa' => $siswa,
            'kelasList' => $kelasList,
            'institutions' => $institutions,
            'filters' => $request->only(['kelas_id', 'institution_id']),
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
}
