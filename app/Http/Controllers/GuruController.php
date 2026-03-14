<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Institution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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
        return Inertia::render('Akademik/Guru/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
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
        ]);

        Guru::create($validated);

        return redirect()->route('akademik.guru.index')
            ->with('success', 'Data guru berhasil ditambahkan');
    }

    public function edit(Guru $guru)
    {
        return Inertia::render('Akademik/Guru/Edit', [
            'guru' => $guru
        ]);
    }

    public function update(Request $request, Guru $guru)
    {
        $validated = $request->validate([
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
        ]);

        $guru->update($validated);

        return redirect()->route('akademik.guru.index')
            ->with('success', 'Data guru berhasil diperbarui');
    }

    public function destroy(Guru $guru)
    {
        $guru->delete();

        return redirect()->route('akademik.guru.index')
            ->with('success', 'Data guru berhasil dihapus');
    }
}
