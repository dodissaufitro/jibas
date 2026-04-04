<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class BackupFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:files
                            {--keep-days=30 : Number of days to keep backups}
                            {--include-vendor : Include vendor directory}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backup important files (uploads, configs) to storage';

    /**
     * Files/directories to backup
     */
    protected array $backupPaths = [
        'storage/app/public',
        'storage/uploads',
        '.env',
        'composer.json',
        'composer.lock',
        'package.json',
        'package-lock.json',
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting files backup...');

        try {
            // Create backup directory if it doesn't exist
            $backupDir = storage_path('app/backups/files');
            if (!file_exists($backupDir)) {
                mkdir($backupDir, 0755, true);
            }

            // Generate filename with timestamp
            $filename = 'backup_files_' . date('Y-m-d_H-i-s') . '.zip';
            $filepath = $backupDir . '/' . $filename;

            $zip = new ZipArchive();
            if ($zip->open($filepath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                $this->error('Cannot create zip file');
                return Command::FAILURE;
            }

            $basePath = base_path();
            $totalFiles = 0;

            foreach ($this->backupPaths as $path) {
                $fullPath = $basePath . '/' . $path;

                if (file_exists($fullPath)) {
                    if (is_dir($fullPath)) {
                        $this->info("Adding directory: {$path}");
                        $files = $this->addDirectoryToZip($zip, $fullPath, $path);
                        $totalFiles += $files;
                    } else {
                        $this->info("Adding file: {$path}");
                        $zip->addFile($fullPath, $path);
                        $totalFiles++;
                    }
                }
            }

            // Optionally include vendor directory (can be large)
            if ($this->option('include-vendor') && file_exists($basePath . '/vendor')) {
                $this->info('Adding vendor directory...');
                $files = $this->addDirectoryToZip($zip, $basePath . '/vendor', 'vendor');
                $totalFiles += $files;
            }

            $zip->close();

            $fileSize = filesize($filepath);
            $fileSizeMB = round($fileSize / 1024 / 1024, 2);

            $this->info("Backup successful: {$filename} ({$fileSizeMB} MB, {$totalFiles} files)");

            // Cleanup old backups
            $this->cleanupOldBackups($backupDir, $this->option('keep-days'));

            // Log the backup
            \App\Models\ActivityLog::log(
                'backup_files',
                'System',
                "Files backup created: {$filename}",
                [],
                [],
                'info',
                [
                    'filename' => $filename,
                    'size_mb' => $fileSizeMB,
                    'total_files' => $totalFiles,
                    'include_vendor' => $this->option('include-vendor')
                ]
            );

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Backup error: ' . $e->getMessage());

            \App\Models\ActivityLog::log(
                'backup_files_failed',
                'System',
                "Files backup failed: " . $e->getMessage(),
                [],
                [],
                'critical'
            );

            return Command::FAILURE;
        }
    }

    /**
     * Recursively add directory to zip
     */
    protected function addDirectoryToZip(ZipArchive $zip, string $directory, string $localPath): int
    {
        $fileCount = 0;
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directory, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $file) {
            $filePath = $file->getRealPath();
            $relativePath = $localPath . '/' . substr($filePath, strlen($directory) + 1);

            if (is_dir($filePath)) {
                $zip->addEmptyDir($relativePath);
            } else {
                $zip->addFile($filePath, $relativePath);
                $fileCount++;
            }
        }

        return $fileCount;
    }

    /**
     * Cleanup old backup files
     */
    protected function cleanupOldBackups(string $backupDir, int $keepDays): void
    {
        $this->info("Cleaning up backups older than {$keepDays} days...");

        $files = glob($backupDir . '/backup_*.zip');
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
