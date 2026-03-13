<?php

namespace App\Modules\InstitutionSpecific\Pesantren\IzinPulang\Models;

use App\Base\Models\BaseModel;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IzinPulang extends BaseModel
{
    protected $table = 'izin_pulang';

    protected $fillable = [
        'institution_id',
        'siswa_id',
        'jenis_izin', // pulang, sakit, keperluan_keluarga, acara
        'tanggal_izin',
        'tanggal_mulai',
        'tanggal_selesai',
        'tujuan',
        'penjemput_nama',
        'penjemput_hubungan',
        'penjemput_telepon',
        'alasan',
        'status', // pending, disetujui, ditolak, kembali
        'disetujui_oleh',
        'tanggal_disetujui',
        'catatan_approval',
        'tanggal_kembali',
        'terlambat',
    ];

    protected $casts = [
        'tanggal_izin' => 'datetime',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'tanggal_disetujui' => 'datetime',
        'tanggal_kembali' => 'datetime',
        'terlambat' => 'boolean',
    ];

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'disetujui_oleh');
    }

    // Accessors
    public function getDurasiAttribute(): int
    {
        return $this->tanggal_selesai->diffInDays($this->tanggal_mulai) + 1;
    }

    public function getStatusBadgeAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'warning',
            'disetujui' => 'success',
            'ditolak' => 'danger',
            'kembali' => 'info',
            default => 'secondary',
        };
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeDisetujui($query)
    {
        return $query->where('status', 'disetujui');
    }

    public function scopeBelumKembali($query)
    {
        return $query->where('status', 'disetujui')
            ->whereNull('tanggal_kembali');
    }

    public function scopeTerlambat($query)
    {
        return $query->where('terlambat', true);
    }
}
