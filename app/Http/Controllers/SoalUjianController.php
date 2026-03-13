<?php

namespace App\Http\Controllers;

use App\Models\SoalUjian;
use App\Models\Ujian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SoalUjianController extends Controller
{
    public function index(Ujian $ujian)
    {
        $soal = SoalUjian::where('ujian_id', $ujian->id)
            ->orderBy('nomor_soal')
            ->get();

        return Inertia::render('Ujian/Soal/Index', [
            'ujian' => $ujian->load(['mataPelajaran', 'guru', 'kelas', 'tahunAjaran', 'semester']),
            'soal' => $soal,
            'stats' => [
                'total_soal' => $soal->count(),
                'pilihan_ganda' => $soal->where('tipe_soal', 'pilihan_ganda')->count(),
                'essay' => $soal->where('tipe_soal', 'essay')->count(),
                'total_bobot' => $soal->sum('bobot'),
            ],
        ]);
    }

    public function create(Ujian $ujian)
    {
        // Get next nomor soal
        $nextNomor = SoalUjian::where('ujian_id', $ujian->id)->max('nomor_soal') + 1;

        return Inertia::render('Ujian/Soal/Create', [
            'ujian' => $ujian->load(['mataPelajaran', 'kelas']),
            'nextNomor' => $nextNomor,
        ]);
    }

    public function store(Request $request, Ujian $ujian)
    {
        $validated = $request->validate([
            'nomor_soal' => 'required|integer|min:1',
            'tipe_soal' => 'required|in:pilihan_ganda,essay,benar_salah,menjodohkan',
            'pertanyaan' => 'required|string',
            'opsi_a' => 'nullable|string',
            'opsi_b' => 'nullable|string',
            'opsi_c' => 'nullable|string',
            'opsi_d' => 'nullable|string',
            'opsi_e' => 'nullable|string',
            'jawaban_benar' => 'nullable|string',
            'pembahasan' => 'nullable|string',
            'file_soal' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'bobot' => 'required|numeric|min:0',
        ]);

        // Handle file upload
        if ($request->hasFile('file_soal')) {
            $validated['file_soal'] = $request->file('file_soal')->store('soal-ujian', 'public');
        }

        $validated['ujian_id'] = $ujian->id;

        SoalUjian::create($validated);

        return redirect()->route('ujian.soal.index', $ujian)
            ->with('success', 'Soal berhasil ditambahkan');
    }

    public function edit(Ujian $ujian, SoalUjian $soal)
    {
        return Inertia::render('Ujian/Soal/Edit', [
            'ujian' => $ujian->load(['mataPelajaran', 'kelas']),
            'soal' => $soal,
        ]);
    }

    public function update(Request $request, Ujian $ujian, SoalUjian $soal)
    {
        $validated = $request->validate([
            'nomor_soal' => 'required|integer|min:1',
            'tipe_soal' => 'required|in:pilihan_ganda,essay,benar_salah,menjodohkan',
            'pertanyaan' => 'required|string',
            'opsi_a' => 'nullable|string',
            'opsi_b' => 'nullable|string',
            'opsi_c' => 'nullable|string',
            'opsi_d' => 'nullable|string',
            'opsi_e' => 'nullable|string',
            'jawaban_benar' => 'nullable|string',
            'pembahasan' => 'nullable|string',
            'file_soal' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'bobot' => 'required|numeric|min:0',
        ]);

        // Handle file upload
        if ($request->hasFile('file_soal')) {
            // Delete old file if exists
            if ($soal->file_soal) {
                Storage::disk('public')->delete($soal->file_soal);
            }
            $validated['file_soal'] = $request->file('file_soal')->store('soal-ujian', 'public');
        }

        $soal->update($validated);

        return redirect()->route('ujian.soal.index', $ujian)
            ->with('success', 'Soal berhasil diperbarui');
    }

    public function destroy(Ujian $ujian, SoalUjian $soal)
    {
        // Delete file if exists
        if ($soal->file_soal) {
            Storage::disk('public')->delete($soal->file_soal);
        }

        $soal->delete();

        return redirect()->route('ujian.soal.index', $ujian)
            ->with('success', 'Soal berhasil dihapus');
    }
}
