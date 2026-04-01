<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class SiswaUpdateTemplateExport implements FromArray, WithHeadings, WithStyles
{
    public function array(): array
    {
        return [
            [
                '1001',
                '0123456789',
                '3273010101100001',
                'Nama Baru Siswa',
                'L',
                'Bandung',
                '2007-01-01',
                'Jl. Contoh No. 1',
                'siswa@email.com',
                '08123456789',
                'Bapak Siswa',
                'Ibu Siswa',
                '08123456788',
                '1',
                'aktif'
            ],
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
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:O1')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F59E0B']],
        ]);
        foreach (range('A', 'O') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
    }
}
