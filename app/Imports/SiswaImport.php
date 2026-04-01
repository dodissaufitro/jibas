<?php

namespace App\Imports;

use App\Models\Siswa;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class SiswaImport implements ToCollection, WithHeadingRow, SkipsOnError, WithBatchInserts
{
    use SkipsErrors;

    protected $successCount = 0;
    protected $errorCount = 0;
    protected $errors = [];
    protected $duplicateCount = 0;

    public function collection(Collection $rows)
    {
        $user = Auth::user();
        $institutionId = $user ? $user->institution_id : null;

        Log::info('Import started', ['total_rows' => $rows->count(), 'institution_id' => $institutionId]);

        foreach ($rows as $index => $row) {
            try {
                // Skip empty rows
                if (empty($row['nis']) || empty($row['nama_lengkap'])) {
                    Log::warning('Skipping empty row', ['index' => $index]);
                    continue;
                }

                // Validasi duplikat NIS
                if (Siswa::where('nis', $row['nis'])->exists()) {
                    $this->duplicateCount++;
                    $this->errorCount++;
                    $this->errors[] = "Baris " . ($index + 2) . ": NIS {$row['nis']} sudah terdaftar";
                    Log::warning('Duplicate NIS', ['nis' => $row['nis']]);
                    continue;
                }

                // Validasi duplikat NISN
                if (!empty($row['nisn']) && Siswa::where('nisn', $row['nisn'])->exists()) {
                    $this->duplicateCount++;
                    $this->errorCount++;
                    $this->errors[] = "Baris " . ($index + 2) . ": NISN {$row['nisn']} sudah terdaftar";
                    continue;
                }

                // Create user account first
                $userId = null;
                if (!empty($row['email'])) {
                    $existingUser = User::where('email', $row['email'])->first();
                    if (!$existingUser) {
                        $newUser = User::create([
                            'name' => $row['nama_lengkap'],
                            'email' => $row['email'],
                            'password' => Hash::make($row['nis']), // Password = NIS (encrypted)
                            'institution_id' => $institutionId,
                        ]);

                        // Assign role siswa
                        if (method_exists($newUser, 'assignRole')) {
                            $newUser->assignRole('siswa');
                        }

                        $userId = $newUser->id;
                        Log::info('User created', ['user_id' => $userId, 'email' => $row['email']]);
                    } else {
                        $userId = $existingUser->id;
                        Log::info('User already exists', ['user_id' => $userId, 'email' => $row['email']]);
                    }
                }

                // Create siswa record
                $siswa = Siswa::create([
                    'user_id' => $userId,
                    'institution_id' => $institutionId,
                    'nis' => $row['nis'],
                    'nisn' => $row['nisn'] ?? null,
                    'nik' => $row['nik'] ?? null,
                    'nama_lengkap' => $row['nama_lengkap'],
                    'jenis_kelamin' => strtoupper(substr($row['jenis_kelamin'], 0, 1)),
                    'tempat_lahir' => $row['tempat_lahir'] ?? '-',
                    'tanggal_lahir' => $this->parseDate($row['tanggal_lahir'] ?? null),
                    'alamat' => $row['alamat'] ?? '-',
                    'email' => $row['email'] ?? null,
                    'no_hp' => $row['no_hp'] ?? null,
                    'nama_ayah' => $row['nama_ayah'] ?? '-',
                    'nama_ibu' => $row['nama_ibu'] ?? '-',
                    'no_hp_ortu' => $row['no_hp_ortu'] ?? '-',
                    'kelas_id' => $row['kelas_id'] ?? null,
                    'status' => $row['status'] ?? 'aktif',
                    'tanggal_masuk' => $this->parseDate($row['tanggal_masuk'] ?? now()),
                ]);

                $this->successCount++;
                Log::info('Siswa created', ['siswa_id' => $siswa->id, 'nis' => $row['nis']]);
            } catch (\Exception $e) {
                $this->errorCount++;
                $errorMsg = "Baris " . ($index + 2) . " (NIS: {$row['nis']}): " . $e->getMessage();
                $this->errors[] = $errorMsg;
                Log::error('Import error', [
                    'row' => $index + 2,
                    'nis' => $row['nis'] ?? 'N/A',
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }

        Log::info('Import completed', [
            'success' => $this->successCount,
            'errors' => $this->errorCount
        ]);
    }

    protected function parseDate($date)
    {
        if (empty($date)) {
            return null;
        }

        try {
            // Try to parse Excel date (numeric format)
            if (is_numeric($date)) {
                return Carbon::instance(Date::excelToDateTimeObject($date));
            }

            // Try common date formats
            return Carbon::parse($date);
        } catch (\Exception $e) {
            return null;
        }
    }

    public function batchSize(): int
    {
        return 100;
    }

    public function getSuccessCount()
    {
        return $this->successCount;
    }

    public function getErrorCount()
    {
        return $this->errorCount;
    }

    public function getErrors()
    {
        return $this->errors;
    }

    public function getDuplicates(): int
    {
        return $this->duplicateCount;
    }
}
