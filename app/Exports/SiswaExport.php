<?php

namespace App\Exports;

use App\Models\Siswa;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class SiswaExport implements FromQuery, WithHeadings, WithMapping, WithStyles, WithColumnWidths
{
    protected $kelasId;
    protected $institutionId;
    protected $search;
    protected $status;

    public function __construct($kelasId = null, $institutionId = null, $search = null, $status = null)
    {
        $this->kelasId       = $kelasId;
        $this->institutionId = $institutionId;
        $this->search        = $search;
        $this->status        = $status;
    }

    public function query()
    {
        $query = Siswa::query()->with('kelas');

        if ($this->institutionId) {
            $query->where('institution_id', $this->institutionId);
        }

        if ($this->kelasId) {
            $query->where('kelas_id', $this->kelasId);
        }

        if ($this->status) {
            $query->where('status', $this->status);
        }

        if ($this->search) {
            $search = $this->search;
            $query->where(
                fn($q) =>
                $q->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
            );
        }

        return $query->orderBy('nama_lengkap');
    }

    public function map($siswa): array
    {
        return [
            $siswa->nis,
            $siswa->nisn,
            $siswa->nik,
            $siswa->nama_lengkap,
            $siswa->jenis_kelamin,
            $siswa->tempat_lahir,
            $siswa->tanggal_lahir ? $siswa->tanggal_lahir->format('Y-m-d') : '',
            $siswa->alamat,
            $siswa->email,
            $siswa->no_hp,
            $siswa->nama_ayah,
            $siswa->nama_ibu,
            $siswa->no_hp_ortu,
            $siswa->kelas_id,
            $siswa->status,
            $siswa->tanggal_masuk ? $siswa->tanggal_masuk->format('Y-m-d') : '',
        ];
    }

    public function headings(): array
    {
        return [
            'nis',
            'nisn',
            'nik',
            'nama_lengkap',
            'jenis_kelamin',
            'tempat_lahir',
            'tanggal_lahir',
            'alamat',
            'email',
            'no_hp',
            'nama_ayah',
            'nama_ibu',
            'no_hp_ortu',
            'kelas_id',
            'status',
            'tanggal_masuk',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                    ],
                ],
            ],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 15, // nis
            'B' => 18, // nisn
            'C' => 20, // nik
            'D' => 30, // nama_lengkap
            'E' => 16, // jenis_kelamin
            'F' => 20, // tempat_lahir
            'G' => 18, // tanggal_lahir
            'H' => 35, // alamat
            'I' => 25, // email
            'J' => 15, // no_hp
            'K' => 25, // nama_ayah
            'L' => 25, // nama_ibu
            'M' => 15, // no_hp_ortu
            'N' => 12, // kelas_id
            'O' => 12, // status
            'P' => 18, // tanggal_masuk
        ];
    }
}
