<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define all modules and their permissions
        $modules = [
            'dashboard' => [
                'view_dashboard' => 'Lihat Dashboard',
            ],
            'master' => [
                'view_master_data' => 'Lihat Master Data',
                'manage_tahun_ajaran' => 'Kelola Tahun Ajaran',
                'manage_semester' => 'Kelola Semester',
                'manage_jenjang' => 'Kelola Jenjang',
                'manage_jurusan' => 'Kelola Jurusan',
                'manage_kelas' => 'Kelola Kelas',
                'manage_mata_pelajaran' => 'Kelola Mata Pelajaran',
                'manage_kurikulum' => 'Kelola Kurikulum',
            ],
            'akademik' => [
                'view_akademik' => 'Lihat Data Akademik',
                'view_siswa' => 'Lihat Data Siswa',
                'create_siswa' => 'Tambah Data Siswa',
                'edit_siswa' => 'Edit Data Siswa',
                'delete_siswa' => 'Hapus Data Siswa',
                'view_guru' => 'Lihat Data Guru',
                'create_guru' => 'Tambah Data Guru',
                'edit_guru' => 'Edit Data Guru',
                'delete_guru' => 'Hapus Data Guru',
                'view_jadwal_pelajaran' => 'Lihat Jadwal Pelajaran',
                'create_jadwal_pelajaran' => 'Tambah Jadwal Pelajaran',
                'edit_jadwal_pelajaran' => 'Edit Jadwal Pelajaran',
                'delete_jadwal_pelajaran' => 'Hapus Jadwal Pelajaran',
                'view_nilai' => 'Lihat Nilai',
                'input_nilai' => 'Input Nilai',
                'edit_nilai' => 'Edit Nilai',
                'view_raport' => 'Lihat Raport',
                'cetak_raport' => 'Cetak Raport',
            ],
            'ppdb' => [
                'view_ppdb' => 'Lihat PPDB',
                'manage_ppdb_pendaftaran' => 'Kelola Pendaftaran PPDB',
                'manage_ppdb_seleksi' => 'Kelola Seleksi PPDB',
                'manage_ppdb_pembayaran' => 'Kelola Pembayaran PPDB',
                'manage_ppdb_pengumuman' => 'Kelola Pengumuman PPDB',
                'approve_ppdb' => 'Approve Pendaftaran PPDB',
            ],
            'presensi' => [
                'view_presensi' => 'Lihat Presensi',
                'input_presensi_siswa' => 'Input Presensi Siswa',
                'input_presensi_guru' => 'Input Presensi Guru',
                'edit_presensi' => 'Edit Presensi',
                'view_rekap_presensi' => 'Lihat Rekap Presensi',
            ],
            'ujian' => [
                'view_ujian' => 'Lihat Ujian',
                'create_ujian' => 'Tambah Ujian',
                'edit_ujian' => 'Edit Ujian',
                'delete_ujian' => 'Hapus Ujian',
                'manage_soal_ujian' => 'Kelola Soal Ujian',
                'view_hasil_ujian' => 'Lihat Hasil Ujian',
                'view_jadwal_ujian' => 'Lihat Jadwal Ujian',
            ],
            'keuangan' => [
                'view_keuangan' => 'Lihat Data Keuangan',
                'manage_jenis_pembayaran' => 'Kelola Jenis Pembayaran',
                'manage_pembayaran' => 'Kelola Pembayaran',
                'view_tagihan' => 'Lihat Tagihan',
                'create_tagihan' => 'Buat Tagihan',
                'manage_kas' => 'Kelola Kas',
                'view_laporan_keuangan' => 'Lihat Laporan Keuangan',
            ],
            'komunikasi' => [
                'view_komunikasi' => 'Lihat Komunikasi',
                'send_komunikasi' => 'Kirim Komunikasi',
                'manage_surat' => 'Kelola Surat',
            ],
            'asrama' => [
                'view_asrama' => 'Lihat Data Asrama',
                'manage_kamar' => 'Kelola Kamar Asrama',
                'manage_santri_asrama' => 'Kelola Data Santri Asrama',
            ],
            'arsip' => [
                'view_arsip' => 'Lihat Arsip',
                'manage_arsip' => 'Kelola Arsip',
            ],
            'user_management' => [
                'view_users' => 'Lihat User',
                'create_user' => 'Tambah User',
                'edit_user' => 'Edit User',
                'delete_user' => 'Hapus User',
                'manage_roles' => 'Kelola Role',
                'manage_permissions' => 'Kelola Permission',
                'assign_role' => 'Assign Role ke User',
                'assign_permission' => 'Assign Permission ke Role',
            ],
            'settings' => [
                'view_settings' => 'Lihat Pengaturan',
                'manage_institution' => 'Kelola Data Institusi',
                'manage_system_settings' => 'Kelola Pengaturan Sistem',
            ],
        ];

        // Create permissions
        foreach ($modules as $module => $permissions) {
            foreach ($permissions as $name => $displayName) {
                Permission::firstOrCreate(
                    ['name' => $name],
                    [
                        'display_name' => $displayName,
                        'module' => $module,
                        'description' => "Permission untuk $displayName pada modul " . ucfirst($module),
                    ]
                );
            }
        }

        $this->command->info('Permissions seeded successfully!');

        // Create default roles
        $superAdmin = Role::firstOrCreate(
            ['name' => 'super_admin'],
            [
                'display_name' => 'Super Admin',
                'description' => 'Akses penuh ke seluruh sistem'
            ]
        );

        $admin = Role::firstOrCreate(
            ['name' => 'admin'],
            [
                'display_name' => 'Admin',
                'description' => 'Administrator sekolah'
            ]
        );

        $guru = Role::firstOrCreate(
            ['name' => 'guru'],
            [
                'display_name' => 'Guru',
                'description' => 'Guru pengajar'
            ]
        );

        $siswa = Role::firstOrCreate(
            ['name' => 'siswa'],
            [
                'display_name' => 'Siswa',
                'description' => 'Siswa sekolah'
            ]
        );

        $orangTua = Role::firstOrCreate(
            ['name' => 'orang_tua'],
            [
                'display_name' => 'Orang Tua',
                'description' => 'Orang tua siswa'
            ]
        );

        // Assign all permissions to Super Admin
        $superAdmin->permissions()->sync(Permission::all());

        // Assign specific permissions to Admin
        $adminPermissions = Permission::whereIn('module', [
            'dashboard',
            'master',
            'akademik',
            'ppdb',
            'presensi',
            'ujian',
            'keuangan',
            'komunikasi',
            'asrama',
            'arsip'
        ])->pluck('id');
        $admin->permissions()->sync($adminPermissions);

        // Assign specific permissions to Guru
        $guruPermissions = Permission::whereIn('name', [
            'view_dashboard',
            'view_akademik',
            'view_siswa',
            'view_jadwal_pelajaran',
            'view_nilai',
            'input_nilai',
            'edit_nilai',
            'view_raport',
            'view_presensi',
            'input_presensi_siswa',
            'view_rekap_presensi',
            'view_ujian',
            'create_ujian',
            'edit_ujian',
            'manage_soal_ujian',
            'view_hasil_ujian',
            'view_jadwal_ujian',
        ])->pluck('id');
        $guru->permissions()->sync($guruPermissions);

        // Assign specific permissions to Siswa
        $siswaPermissions = Permission::whereIn('name', [
            'view_dashboard',
            'view_jadwal_pelajaran',
            'view_nilai',
            'view_raport',
            'view_jadwal_ujian',
        ])->pluck('id');
        $siswa->permissions()->sync($siswaPermissions);

        // Assign specific permissions to Orang Tua
        $orangTuaPermissions = Permission::whereIn('name', [
            'view_dashboard',
            'view_jadwal_pelajaran',
            'view_nilai',
            'view_raport',
            'view_presensi',
            'view_tagihan',
            'manage_pembayaran',
        ])->pluck('id');
        $orangTua->permissions()->sync($orangTuaPermissions);

        $this->command->info('Roles and permissions configured successfully!');
    }
}
