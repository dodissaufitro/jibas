<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class BackupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:database
                            {--keep-days=30 : Number of days to keep backups}
                            {--compress : Compress the backup file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backup the database to storage';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting database backup...');

        try {
            $config = config('database.connections.' . config('database.default'));
            $database = $config['database'];
            $username = $config['username'];
            $password = $config['password'];
            $host = $config['host'];

            // Create backup directory if it doesn't exist
            $backupDir = storage_path('app/backups/database');
            if (!file_exists($backupDir)) {
                mkdir($backupDir, 0755, true);
            }

            // Generate filename with timestamp
            $filename = 'backup_' . $database . '_' . date('Y-m-d_H-i-s') . '.sql';
            $filepath = $backupDir . '/' . $filename;

            // Create mysqldump command
            $command = sprintf(
                'mysqldump --user=%s --password=%s --host=%s %s > %s',
                escapeshellarg($username),
                escapeshellarg($password),
                escapeshellarg($host),
                escapeshellarg($database),
                escapeshellarg($filepath)
            );

            // Execute backup
            exec($command, $output, $returnCode);

            if ($returnCode !== 0) {
                $this->error('Backup failed!');
                return Command::FAILURE;
            }

            // Compress if requested
            if ($this->option('compress')) {
                $this->info('Compressing backup...');
                $zipFilepath = $filepath . '.zip';

                $zip = new ZipArchive();
                if ($zip->open($zipFilepath, ZipArchive::CREATE) === true) {
                    $zip->addFile($filepath, $filename);
                    $zip->close();

                    // Remove uncompressed file
                    unlink($filepath);
                    $filepath = $zipFilepath;
                    $filename = $filename . '.zip';
                }
            }

            $fileSize = filesize($filepath);
            $fileSizeMB = round($fileSize / 1024 / 1024, 2);

            $this->info("Backup successful: {$filename} ({$fileSizeMB} MB)");

            // Cleanup old backups
            $this->cleanupOldBackups($backupDir, $this->option('keep-days'));

            // Log the backup
            \App\Models\ActivityLog::log(
                'backup_database',
                'System',
                "Database backup created: {$filename}",
                [],
                [],
                'info',
                [
                    'filename' => $filename,
                    'size_mb' => $fileSizeMB,
                    'compressed' => $this->option('compress')
                ]
            );

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Backup error: ' . $e->getMessage());

            \App\Models\ActivityLog::log(
                'backup_database_failed',
                'System',
                "Database backup failed: " . $e->getMessage(),
                [],
                [],
                'critical'
            );

            return Command::FAILURE;
        }
    }

    /**
     * Cleanup old backup files
     */
    protected function cleanupOldBackups(string $backupDir, int $keepDays): void
    {
        $this->info("Cleaning up backups older than {$keepDays} days...");

        $files = glob($backupDir . '/backup_*.sql*');
        $cutoffTime = now()->subDays($keepDays)->timestamp;
        $deletedCount = 0;

        foreach ($files as $file) {
            if (filemtime($file) < $cutoffTime) {
                unlink($file);
                $deletedCount++;
            }
        }

        if ($deletedCount > 0) {
            $this->info("Deleted {$deletedCount} old backup(s)");
        }
    }
}
