<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Guru;
use App\Models\MataPelajaran;

class GuruSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $guruData = [
            [
                'nip' => '198012052006041001',
                'nik' => '3273010512800001',
                'nama_lengkap' => 'Dr. Agus Susanto',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '1980-12-05',
                'alamat' => 'Jl. Cihampelas No. 45, Bandung',
                'email' => 'agus.susanto@jibas.sch.id',
                'no_hp' => '081234560001',
                'jenis_ptk' => 'kepala_sekolah',
                'status_kepegawaian' => 'pns',
                'pendidikan_terakhir' => 'S3 Manajemen Pendidikan',
                'gelar_depan' => 'Dr.',
                'gelar_belakang' => 'M.Pd.',
                'status' => 'aktif',
                'tanggal_masuk' => '2006-04-01',
            ],
            [
                'nip' => '198506152010122001',
                'nik' => '3273011506850001',
                'nama_lengkap' => 'Dra. Siti Fatimah',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Jakarta',
                'tanggal_lahir' => '1985-06-15',
                'alamat' => 'Jl. Kebon Jeruk No. 78, Jakarta',
                'email' => 'siti.fatimah@jibas.sch.id',
                'no_hp' => '081234560002',
                'jenis_ptk' => 'wakil_kepala',
                'status_kepegawaian' => 'pns',
                'pendidikan_terakhir' => 'S2 Pendidikan Matematika',
                'gelar_depan' => 'Dra.',
                'gelar_belakang' => 'M.Pd.',
                'status' => 'aktif',
                'tanggal_masuk' => '2010-12-01',
            ],
            [
                'nip' => '198709202012041002',
                'nik' => '3273012009870001',
                'nama_lengkap' => 'Bambang Suryanto',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Surabaya',
                'tanggal_lahir' => '1987-09-20',
                'alamat' => 'Jl. Diponegoro No. 123, Surabaya',
                'email' => 'bambang.suryanto@jibas.sch.id',
                'no_hp' => '081234560003',
                'jenis_ptk' => 'guru',
                'status_kepegawaian' => 'pns',
                'pendidikan_terakhir' => 'S1 Pendidikan Bahasa Indonesia',
                'gelar_depan' => null,
                'gelar_belakang' => 'S.Pd.',
                'status' => 'aktif',
                'tanggal_masuk' => '2012-04-01',
            ],
            [
                'nip' => null,
                'nik' => '3273010108900001',
                'nama_lengkap' => 'Rina Marlina',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Yogyakarta',
                'tanggal_lahir' => '1990-01-08',
                'alamat' => 'Jl. Malioboro No. 234, Yogyakarta',
                'email' => 'rina.marlina@jibas.sch.id',
                'no_hp' => '081234560004',
                'jenis_ptk' => 'guru',
                'status_kepegawaian' => 'honorer',
                'pendidikan_terakhir' => 'S1 Pendidikan Bahasa Inggris',
                'gelar_depan' => null,
                'gelar_belakang' => 'S.Pd.',
                'status' => 'aktif',
                'tanggal_masuk' => '2015-07-15',
            ],
            [
                'nip' => '198803122014041001',
                'nik' => '3273011203880001',
                'nama_lengkap' => 'Ahmad Fauzi',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Semarang',
                'tanggal_lahir' => '1988-03-12',
                'alamat' => 'Jl. Pemuda No. 56, Semarang',
                'email' => 'ahmad.fauzi@jibas.sch.id',
                'no_hp' => '081234560005',
                'jenis_ptk' => 'guru',
                'status_kepegawaian' => 'pns',
                'pendidikan_terakhir' => 'S2 Pendidikan Fisika',
                'gelar_depan' => null,
                'gelar_belakang' => 'S.Pd., M.Pd.',
                'status' => 'aktif',
                'tanggal_masuk' => '2014-04-01',
            ],
            [
                'nip' => null,
                'nik' => '3273012505920001',
                'nama_lengkap' => 'Desi Ratnasari',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Medan',
                'tanggal_lahir' => '1992-05-25',
                'alamat' => 'Jl. Sisingamangaraja No. 89, Medan',
                'email' => 'desi.ratnasari@jibas.sch.id',
                'no_hp' => '081234560006',
                'jenis_ptk' => 'guru',
                'status_kepegawaian' => 'kontrak',
                'pendidikan_terakhir' => 'S1 Pendidikan Kimia',
                'gelar_depan' => null,
                'gelar_belakang' => 'S.Pd.',
                'status' => 'aktif',
                'tanggal_masuk' => '2018-08-01',
            ],
            [
                'nip' => '198511182010122002',
                'nik' => '3273011811850001',
                'nama_lengkap' => 'Eka Yulianti',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Palembang',
                'tanggal_lahir' => '1985-11-18',
                'alamat' => 'Jl. Sudirman No. 67, Palembang',
                'email' => 'eka.yulianti@jibas.sch.id',
                'no_hp' => '081234560007',
                'jenis_ptk' => 'guru',
                'status_kepegawaian' => 'pns',
                'pendidikan_terakhir' => 'S1 Pendidikan Biologi',
                'gelar_depan' => null,
                'gelar_belakang' => 'S.Si.',
                'status' => 'aktif',
                'tanggal_masuk' => '2010-12-01',
            ],
            [
                'nip' => null,
                'nik' => '3273010307910001',
                'nama_lengkap' => 'Faisal Rahman',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Makassar',
                'tanggal_lahir' => '1991-07-03',
                'alamat' => 'Jl. A.P. Pettarani No. 34, Makassar',
                'email' => 'faisal.rahman@jibas.sch.id',
                'no_hp' => '081234560008',
                'jenis_ptk' => 'guru',
                'status_kepegawaian' => 'honorer',
                'pendidikan_terakhir' => 'S1 Pendidikan Jasmani',
                'gelar_depan' => null,
                'gelar_belakang' => 'S.Pd.',
                'status' => 'aktif',
                'tanggal_masuk' => '2016-07-15',
            ],
            [
                'nip' => '198608142011012001',
                'nik' => '3273011408860001',
                'nama_lengkap' => 'Hendra Gunawan',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Denpasar',
                'tanggal_lahir' => '1986-08-14',
                'alamat' => 'Jl. Sunset Road No. 12, Denpasar',
                'email' => 'hendra.gunawan@jibas.sch.id',
                'no_hp' => '081234560009',
                'jenis_ptk' => 'guru',
                'status_kepegawaian' => 'pns',
                'pendidikan_terakhir' => 'S2 Pendidikan Sejarah',
                'gelar_depan' => null,
                'gelar_belakang' => 'S.Pd., M.Pd.',
                'status' => 'aktif',
                'tanggal_masuk' => '2011-01-03',
            ],
            [
                'nip' => null,
                'nik' => '3273012210930001',
                'nama_lengkap' => 'Indah Permatasari',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Balikpapan',
                'tanggal_lahir' => '1993-10-22',
                'alamat' => 'Jl. MT. Haryono No. 45, Balikpapan',
                'email' => 'indah.permatasari@jibas.sch.id',
                'no_hp' => '081234560010',
                'jenis_ptk' => 'guru',
                'status_kepegawaian' => 'kontrak',
                'pendidikan_terakhir' => 'S1 Pendidikan Seni Budaya',
                'gelar_depan' => null,
                'gelar_belakang' => 'S.Pd.',
                'status' => 'aktif',
                'tanggal_masuk' => '2019-07-15',
            ],
        ];

        foreach ($guruData as $data) {
            Guru::create($data);
        }

        // Attach mata pelajaran to guru (optional - jika ingin menghubungkan guru dengan mata pelajaran)
        try {
            $mataPelajaranIds = MataPelajaran::pluck('id')->toArray();

            if (!empty($mataPelajaranIds)) {
                $gurus = Guru::where('jenis_ptk', 'guru')->get();

                foreach ($gurus as $guru) {
                    // Setiap guru mengajar 1-3 mata pelajaran secara random
                    $randomMapels = array_rand(array_flip($mataPelajaranIds), rand(1, min(3, count($mataPelajaranIds))));
                    if (!is_array($randomMapels)) {
                        $randomMapels = [$randomMapels];
                    }
                    $guru->mataPelajaran()->attach($randomMapels);
                }

                $this->command->info('Berhasil menghubungkan guru dengan mata pelajaran.');
            }
        } catch (\Exception $e) {
            $this->command->warn('Tabel mata pelajaran belum ada. Guru belum dihubungkan dengan mata pelajaran.');
        }

        $this->command->info('Berhasil menambahkan ' . count($guruData) . ' data guru.');
    }
}
