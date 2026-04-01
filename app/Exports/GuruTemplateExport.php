<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;

class GuruTemplateExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths
{
    public function array(): array
    {
        return [
            ['G001', '1234567890123456', '1234567890123456', 'Ahmad Fauzi, S.Pd', 'L', 'Jakarta', '1985-03-15', 'Jl. Merdeka No. 10', 'ahmad.fauzi@sekolah.id', '081234567890', 'S1', 'Matematika', 'GTY', 'aktif', '2015-07-01'],
            ['G002', '1234567890123457', '1234567890123457', 'Siti Rahayu, S.Pd', 'P', 'Bandung', '1990-07-20', 'Jl. Sudirman No. 5', 'siti.rahayu@sekolah.id', '081234567891', 'S1', 'Bahasa Indonesia', 'PNS', 'aktif', '2018-01-02'],
        ];
    }

    public function headings(): array
    {
        return [
            'nip',
            'nuptk',
            'nik',
            'nama_lengkap',
            'jenis_kelamin',
            'tempat_lahir',
            'tanggal_lahir',
            'alamat',
            'email',
            'no_hp',
            'pendidikan_terakhir',
            'jurusan',
            'status_kepegawaian',
            'status',
            'tanggal_masuk',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '059669']],
            ],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 12,
            'B' => 18,
            'C' => 18,
            'D' => 30,
            'E' => 16,
            'F' => 18,
            'G' => 16,
            'H' => 35,
            'I' => 30,
            'J' => 16,
            'K' => 20,
            'L' => 20,
            'M' => 20,
            'N' => 12,
            'O' => 16,
        ];
    }
}
