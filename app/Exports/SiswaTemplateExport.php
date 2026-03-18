<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class SiswaTemplateExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths, WithEvents
{
    public function collection()
    {
        // Return collection with 3 example data
        return collect([
            [
                '2024001',
                '0087654321',
                '3201012010010001',
                'Ahmad Rizki Maulana',
                'L',
                'Bandung',
                '2010-05-15',
                'Jl. Merdeka No. 45, Bandung',
                'ahmad.rizki@example.com',
                '081234567890',
                'Budi Maulana',
                'Siti Fatimah',
                '081298765432',
                '1',
                'aktif',
                '2024-07-01',
            ],
            [
                '2024002',
                '0087654322',
                '3201012011020002',
                'Siti Nurhaliza',
                'P',
                'Jakarta',
                '2011-03-20',
                'Jl. Sudirman No. 12, Jakarta Pusat',
                'siti.nurhaliza@example.com',
                '082134567891',
                'Abdullah Rahman',
                'Aisyah Putri',
                '082198765433',
                '1',
                'aktif',
                '2024-07-01',
            ],
            [
                '2024003',
                '0087654323',
                '3201012010030003',
                'Budi Santoso',
                'L',
                'Surabaya',
                '2010-11-08',
                'Jl. Pemuda No. 89, Surabaya',
                'budi.santoso@example.com',
                '083234567892',
                'Santoso Wijaya',
                'Dewi Lestari',
                '083298765434',
                '1',
                'aktif',
                '2024-07-01',
            ],
        ]);
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
            // Header row styling
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 11,
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
                        'color' => ['rgb' => 'FFFFFF'],
                    ],
                ],
            ],
            // Example data rows styling
            '2:4' => [
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E7F3FF'],
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'CCCCCC'],
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

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                
                // Add instructions below the data
                $instructionRow = 6;
                $sheet->setCellValue('A' . $instructionRow, '📋 PETUNJUK PENGISIAN:');
                $sheet->getStyle('A' . $instructionRow)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 12,
                        'color' => ['rgb' => '2C5F2D'],
                    ],
                ]);
                
                $instructions = [
                    ['A', '✅ Data di atas adalah CONTOH. Anda bisa menghapus dan menggantinya dengan data siswa Anda.'],
                    ['A', '✅ Field WAJIB: nis, nama_lengkap, jenis_kelamin'],
                    ['A', '✅ NIS harus UNIK (tidak boleh sama dengan siswa lain)'],
                    ['A', '✅ Jenis Kelamin: gunakan L untuk Laki-laki, P untuk Perempuan'],
                    ['A', '✅ Format Tanggal: YYYY-MM-DD (contoh: 2010-05-15)'],
                    ['A', '✅ kelas_id: Lihat ID kelas di http://jibas.test/list-kelas.php'],
                    ['A', '✅ Email: Jika diisi, akan digunakan untuk login (password = NIS)'],
                    ['A', '✅ Field Opsional: nisn, nik, email, no_hp, tempat_lahir, alamat, dll bisa dikosongkan'],
                    ['A', '✅ Status: aktif, lulus, pindah, atau keluar (default: aktif)'],
                ];
                
                $currentRow = $instructionRow + 1;
                foreach ($instructions as $instruction) {
                    $sheet->setCellValue($instruction[0] . $currentRow, $instruction[1]);
                    $sheet->getStyle($instruction[0] . $currentRow)->applyFromArray([
                        'font' => ['size' => 10],
                        'alignment' => ['wrapText' => true],
                    ]);
                    $currentRow++;
                }
                
                // Merge cells for instructions
                for ($i = $instructionRow + 1; $i < $currentRow; $i++) {
                    $sheet->mergeCells('A' . $i . ':P' . $i);
                }
                
                // Auto-height for rows
                for ($i = 1; $i <= $currentRow; $i++) {
                    $sheet->getRowDimension($i)->setRowHeight(-1);
                }
                
                // Freeze first row
                $sheet->freezePane('A2');
            },
        ];
    }
}
