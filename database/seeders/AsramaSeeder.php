<?php

namespace Database\Seeders;

use App\Models\Institution;
use App\Models\Siswa;
use App\Models\User;
use App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\Asrama;
use App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\KamarAsrama;
use App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\PenghuniAsrama;
use Illuminate\Database\Seeder;

class AsramaSeeder extends Seeder
{
    public function run(): void
    {
        $institution = Institution::query()->firstOrCreate(
            ['name' => 'Institusi Default'],
            [
                'type' => 'pesantren',
                'education_level' => 'SMA/MA',
                'is_active' => true,
            ]
        );

        User::query()->whereNull('institution_id')->update(['institution_id' => $institution->id]);

        $pengurusId = User::query()
            ->where('institution_id', $institution->id)
            ->orderBy('id')
            ->value('id');

        $asramaPutra = Asrama::query()->updateOrCreate(
            ['institution_id' => $institution->id, 'nama_asrama' => 'Asrama Abu Bakar'],
            [
                'jenis' => 'putra',
                'kapasitas' => 40,
                'terisi' => 0,
                'pengurus_id' => $pengurusId,
                'alamat' => 'Blok A Pesantren, dekat masjid utama',
                'fasilitas' => ['Kasur', 'Lemari', 'Kipas angin', 'Kamar mandi dalam'],
                'status' => 'aktif',
            ]
        );

        $asramaPutri = Asrama::query()->updateOrCreate(
            ['institution_id' => $institution->id, 'nama_asrama' => 'Asrama Khadijah'],
            [
                'jenis' => 'putri',
                'kapasitas' => 36,
                'terisi' => 0,
                'pengurus_id' => $pengurusId,
                'alamat' => 'Blok B Pesantren, area putri',
                'fasilitas' => ['Kasur', 'Lemari', 'Meja belajar', 'Ruang baca'],
                'status' => 'aktif',
            ]
        );

        $this->seedKamar($institution->id, $asramaPutra->id, [
            ['nomor' => 'A-101', 'lantai' => 1, 'kapasitas' => 8],
            ['nomor' => 'A-102', 'lantai' => 1, 'kapasitas' => 8],
            ['nomor' => 'A-201', 'lantai' => 2, 'kapasitas' => 12],
            ['nomor' => 'A-202', 'lantai' => 2, 'kapasitas' => 12],
        ]);

        $this->seedKamar($institution->id, $asramaPutri->id, [
            ['nomor' => 'B-101', 'lantai' => 1, 'kapasitas' => 9],
            ['nomor' => 'B-102', 'lantai' => 1, 'kapasitas' => 9],
            ['nomor' => 'B-201', 'lantai' => 2, 'kapasitas' => 9],
            ['nomor' => 'B-202', 'lantai' => 2, 'kapasitas' => 9],
        ]);

        $this->seedPenghuni($institution->id, $asramaPutra, $asramaPutri);

        $this->command->info('AsramaSeeder selesai: data asrama, kamar, dan penghuni contoh berhasil dibuat.');
    }

    private function seedKamar(int $institutionId, int $asramaId, array $rooms): void
    {
        foreach ($rooms as $room) {
            KamarAsrama::query()->updateOrCreate(
                [
                    'institution_id' => $institutionId,
                    'asrama_id' => $asramaId,
                    'nomor_kamar' => $room['nomor'],
                ],
                [
                    'lantai' => $room['lantai'],
                    'kapasitas' => $room['kapasitas'],
                    'terisi' => 0,
                    'fasilitas' => ['Kasur', 'Lemari', 'Rak sepatu'],
                    'status' => 'tersedia',
                ]
            );
        }
    }

    private function seedPenghuni(int $institutionId, Asrama $putra, Asrama $putri): void
    {
        if (Siswa::query()->count() === 0) {
            return;
        }

        $maleStudents = Siswa::query()->where('jenis_kelamin', 'L')->take(10)->get();
        $femaleStudents = Siswa::query()->where('jenis_kelamin', 'P')->take(10)->get();

        $this->assignStudentsToAsrama($institutionId, $putra, $maleStudents->all());
        $this->assignStudentsToAsrama($institutionId, $putri, $femaleStudents->all());
    }

    private function assignStudentsToAsrama(int $institutionId, Asrama $asrama, array $students): void
    {
        $kamars = KamarAsrama::query()->where('asrama_id', $asrama->id)->orderBy('id')->get();

        if ($kamars->isEmpty() || count($students) === 0) {
            return;
        }

        $studentIndex = 0;

        foreach ($kamars as $kamar) {
            $maxFill = min(3, count($students) - $studentIndex);

            for ($i = 0; $i < $maxFill; $i++) {
                if (!isset($students[$studentIndex])) {
                    break;
                }

                $siswa = $students[$studentIndex];

                PenghuniAsrama::query()->updateOrCreate(
                    [
                        'institution_id' => $institutionId,
                        'siswa_id' => $siswa->id,
                        'asrama_id' => $asrama->id,
                    ],
                    [
                        'kamar_id' => $kamar->id,
                        'tanggal_masuk' => now()->subDays(rand(5, 120))->toDateString(),
                        'status' => 'aktif',
                        'keterangan' => 'Data contoh seeder',
                    ]
                );

                $studentIndex++;
            }

            $terisiKamar = PenghuniAsrama::query()
                ->where('kamar_id', $kamar->id)
                ->where('status', 'aktif')
                ->count();

            $kamar->update([
                'terisi' => $terisiKamar,
                'status' => $terisiKamar >= $kamar->kapasitas ? 'penuh' : 'tersedia',
            ]);
        }

        $totalTerisiAsrama = PenghuniAsrama::query()
            ->where('asrama_id', $asrama->id)
            ->where('status', 'aktif')
            ->count();

        $asrama->update(['terisi' => $totalTerisiAsrama]);
    }
}
