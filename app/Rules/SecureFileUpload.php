<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

class SecureFileUpload implements ValidationRule
{
    protected array $allowedMimeTypes;
    protected array $allowedExtensions;
    protected int $maxSize; // in KB
    protected ?array $dimensions;

    /**
     * Create a new rule instance.
     *
     * @param array $allowedMimeTypes
     * @param array $allowedExtensions
     * @param int $maxSize Max size in KB
     * @param array|null $dimensions ['min_width' => 100, 'max_width' => 4000, 'min_height' => 100, 'max_height' => 4000]
     */
    public function __construct(
        array $allowedMimeTypes,
        array $allowedExtensions,
        int $maxSize = 2048,
        ?array $dimensions = null
    ) {
        $this->allowedMimeTypes = $allowedMimeTypes;
        $this->allowedExtensions = $allowedExtensions;
        $this->maxSize = $maxSize;
        $this->dimensions = $dimensions;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$value instanceof UploadedFile) {
            $fail('File tidak valid.');
            return;
        }

        // Check if file was uploaded successfully
        if (!$value->isValid()) {
            $fail('Upload file gagal. Silakan coba lagi.');
            return;
        }

        // Check file size
        if ($value->getSize() > $this->maxSize * 1024) {
            $fail("Ukuran file maksimal {$this->maxSize} KB.");
            return;
        }

        // Check MIME type
        $mimeType = $value->getMimeType();
        if (!in_array($mimeType, $this->allowedMimeTypes)) {
            $fail('Tipe file tidak diizinkan. Hanya: ' . implode(', ', $this->allowedExtensions));
            return;
        }

        // Check extension (double check to prevent mime type spoofing)
        $extension = strtolower($value->getClientOriginalExtension());
        if (!in_array($extension, $this->allowedExtensions)) {
            $fail('Ekstensi file tidak diizinkan. Hanya: ' . implode(', ', $this->allowedExtensions));
            return;
        }

        // For images, validate dimensions
        if ($this->dimensions && in_array($mimeType, ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])) {
            try {
                $imageSize = getimagesize($value->getRealPath());
                if ($imageSize === false) {
                    $fail('File gambar tidak valid atau corrupt.');
                    return;
                }

                [$width, $height] = $imageSize;

                if (isset($this->dimensions['min_width']) && $width < $this->dimensions['min_width']) {
                    $fail("Lebar gambar minimal {$this->dimensions['min_width']}px.");
                    return;
                }

                if (isset($this->dimensions['max_width']) && $width > $this->dimensions['max_width']) {
                    $fail("Lebar gambar maksimal {$this->dimensions['max_width']}px.");
                    return;
                }

                if (isset($this->dimensions['min_height']) && $height < $this->dimensions['min_height']) {
                    $fail("Tinggi gambar minimal {$this->dimensions['min_height']}px.");
                    return;
                }

                if (isset($this->dimensions['max_height']) && $height > $this->dimensions['max_height']) {
                    $fail("Tinggi gambar maksimal {$this->dimensions['max_height']}px.");
                    return;
                }
            } catch (\Exception $e) {
                $fail('Gagal memvalidasi dimensi gambar.');
                return;
            }
        }

        // Additional security check: scan for malicious content in images
        if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            $content = file_get_contents($value->getRealPath());

            // Check for PHP code injection
            if (preg_match('/<\?php|<\?=|<script|javascript:/i', $content)) {
                $fail('File mengandung konten berbahaya.');
                return;
            }
        }

        // For PDFs, check if it's really a PDF
        if ($extension === 'pdf') {
            $content = file_get_contents($value->getRealPath(), false, null, 0, 4);
            if ($content !== '%PDF') {
                $fail('File PDF tidak valid.');
                return;
            }
        }

        // For documents, basic validation
        if (in_array($extension, ['doc', 'docx', 'xls', 'xlsx'])) {
            // Check file signature
            $handle = fopen($value->getRealPath(), 'rb');
            $signature = fread($handle, 4);
            fclose($handle);

            // ZIP signature (PK) for Office Open XML formats
            if (in_array($extension, ['docx', 'xlsx']) && $signature !== "PK\x03\x04") {
                $fail('Format file Office tidak valid.');
                return;
            }
        }
    }

    /**
     * Preset: Image upload validation
     */
    public static function image(int $maxSize = 2048, ?array $dimensions = null): self
    {
        return new self(
            ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
            ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            $maxSize,
            $dimensions
        );
    }

    /**
     * Preset: Document upload validation
     */
    public static function document(int $maxSize = 5120): self
    {
        return new self(
            [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ],
            ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
            $maxSize
        );
    }

    /**
     * Preset: Photo/avatar upload
     */
    public static function photo(int $maxSize = 2048): self
    {
        return new self(
            ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
            ['jpg', 'jpeg', 'png', 'webp'],
            $maxSize,
            ['min_width' => 100, 'max_width' => 4000, 'min_height' => 100, 'max_height' => 4000]
        );
    }
}
