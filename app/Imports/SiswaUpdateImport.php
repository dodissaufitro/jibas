<?php

namespace App\Imports;

use App\Models\Siswa;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class SiswaUpdateImport implements ToCollection, WithHeadingRow, SkipsOnError
{
    use SkipsErrors;

    protected $successCount = 0;
    protected $errorCount = 0;
    protected $errors = [];

    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            try {
                if (empty($row['nis'])) continue;

                $siswa = Siswa::where('nis', $row['nis'])->first();
                if (!$siswa) {
                    $this->errorCount++;
                    $this->errors[] = "Baris " . ($index + 2) . ": NIS {$row['nis']} tidak ditemukan";
                    continue;
                }

                $data = [];
                if (!empty($row['nisn']))          $data['nisn']          = $row['nisn'];
                if (!empty($row['nik']))            $data['nik']           = $row['nik'];
                if (!empty($row['nama_lengkap']))   $data['nama_lengkap']  = $row['nama_lengkap'];
                if (!empty($row['jenis_kelamin']))  $data['jenis_kelamin'] = strtoupper(substr($row['jenis_kelamin'], 0, 1));
                if (!empty($row['tempat_lahir']))   $data['tempat_lahir']  = $row['tempat_lahir'];
                if (!empty($row['tanggal_lahir']))  $data['tanggal_lahir'] = $this->parseDate($row['tanggal_lahir']);
                if (!empty($row['alamat']))         $data['alamat']        = $row['alamat'];
                if (!empty($row['email']))          $data['email']         = $row['email'];
                if (!empty($row['no_hp']))          $data['no_hp']         = $row['no_hp'];
                if (!empty($row['nama_ayah']))      $data['nama_ayah']     = $row['nama_ayah'];
                if (!empty($row['nama_ibu']))       $data['nama_ibu']      = $row['nama_ibu'];
                if (!empty($row['no_hp_ortu']))     $data['no_hp_ortu']    = $row['no_hp_ortu'];
                if (!empty($row['kelas_id']))       $data['kelas_id']      = $row['kelas_id'];
                if (!empty($row['status']))         $data['status']        = $row['status'];

                if (!empty($data)) {
                    $siswa->update($data);
                }

                $this->successCount++;
            } catch (\Exception $e) {
                $this->errorCount++;
                $this->errors[] = "Baris " . ($index + 2) . " (NIS: " . ($row['nis'] ?? '-') . "): " . $e->getMessage();
            }
        }
    }

    protected function parseDate($date)
    {
        if (empty($date)) return null;
        try {
            if (is_numeric($date)) {
                return Date::excelToDateTimeObject($date)->format('Y-m-d');
            }
            return Carbon::parse($date)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getSuccessCount(): int
    {
        return $this->successCount;
    }
    public function getErrorCount(): int
    {
        return $this->errorCount;
    }
    public function getErrors(): array
    {
        return $this->errors;
    }
}
