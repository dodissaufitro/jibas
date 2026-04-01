<?php

namespace App\Imports;

use App\Models\Guru;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class GuruImport implements ToCollection, WithHeadingRow, SkipsOnError
{
    use SkipsErrors;

    protected $successCount = 0;
    protected $errorCount = 0;
    protected $errors = [];

    public function collection(Collection $rows)
    {
        $user = Auth::user();
        $institutionId = $user ? $user->institution_id : null;

        foreach ($rows as $index => $row) {
            try {
                if (empty($row['nip']) || empty($row['nama_lengkap'])) continue;

                if (Guru::where('nip', $row['nip'])->exists()) {
                    $this->errorCount++;
                    $this->errors[] = "Baris " . ($index + 2) . ": NIP {$row['nip']} sudah terdaftar";
                    continue;
                }

                $userId = null;
                if (!empty($row['email'])) {
                    $userAccount = User::firstOrCreate(
                        ['email' => $row['email']],
                        [
                            'name'           => $row['nama_lengkap'],
                            'password'       => Hash::make($row['nip']),
                            'institution_id' => $institutionId,
                        ]
                    );
                    if (method_exists($userAccount, 'assignRole')) {
                        $userAccount->assignRole('guru');
                    }
                    $userId = $userAccount->id;
                }

                Guru::create([
                    'user_id'             => $userId,
                    'institution_id'      => $institutionId,
                    'nip'                 => $row['nip'],
                    'nuptk'               => $row['nuptk'] ?? null,
                    'nik'                 => $row['nik'] ?? null,
                    'nama_lengkap'        => $row['nama_lengkap'],
                    'jenis_kelamin'       => strtoupper(substr($row['jenis_kelamin'] ?? 'L', 0, 1)),
                    'tempat_lahir'        => $row['tempat_lahir'] ?? '-',
                    'tanggal_lahir'       => $this->parseDate($row['tanggal_lahir'] ?? null),
                    'alamat'              => $row['alamat'] ?? '-',
                    'email'               => $row['email'] ?? null,
                    'no_hp'               => $row['no_hp'] ?? '-',
                    'pendidikan_terakhir' => $row['pendidikan_terakhir'] ?? 'S1',
                    'jurusan'             => $row['jurusan'] ?? null,
                    'status_kepegawaian'  => in_array($row['status_kepegawaian'] ?? '', ['PNS', 'PPPK', 'GTY', 'PTY'])
                        ? $row['status_kepegawaian'] : 'GTY',
                    'status'              => in_array($row['status'] ?? '', ['aktif', 'cuti', 'pensiun'])
                        ? $row['status'] : 'aktif',
                    'tanggal_masuk'       => $this->parseDate($row['tanggal_masuk'] ?? now()->format('Y-m-d')),
                ]);

                $this->successCount++;
            } catch (\Exception $e) {
                $this->errorCount++;
                $this->errors[] = "Baris " . ($index + 2) . " (NIP: " . ($row['nip'] ?? 'N/A') . "): " . $e->getMessage();
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
            return now()->format('Y-m-d');
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
