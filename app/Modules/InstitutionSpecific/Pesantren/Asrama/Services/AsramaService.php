<?php

namespace App\Modules\InstitutionSpecific\Pesantren\Asrama\Services;

use App\Base\Services\BaseService;
use App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\Asrama;
use App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\PenghuniAsrama;

class AsramaService extends BaseService
{
    public function getPaginatedAsrama(int $perPage = 15, ?string $search = null)
    {
        $institutionId = $this->getInstitutionId();
        if (!$institutionId) {
            return Asrama::query()->whereRaw('1 = 0')->paginate($perPage);
        }

        $query = Asrama::query()
            ->with(['pengurus', 'kamar'])
            ->withCount('penghuni')
            ->forInstitution($institutionId)
            ->latest();

        if ($search) {
            $query->where('nama_asrama', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }

    public function create(array $data): Asrama
    {
        return $this->transaction(function () use ($data) {
            $institutionId = $this->getInstitutionId();
            if (!$institutionId) {
                throw new \Exception('User institution not found');
            }

            $asrama = Asrama::create([
                ...$data,
                'institution_id' => $institutionId,
                'terisi' => 0,
            ]);

            $this->logActivity('create_asrama', 'asrama', [
                'asrama_id' => $asrama->id,
            ]);

            return $asrama;
        });
    }

    public function update(int $id, array $data): Asrama
    {
        return $this->transaction(function () use ($id, $data) {
            $institutionId = $this->getInstitutionId();
            if (!$institutionId) {
                throw new \Exception('User institution not found');
            }

            $asrama = Asrama::forInstitution($institutionId)->findOrFail($id);
            $asrama->update($data);

            $this->logActivity('update_asrama', 'asrama', [
                'asrama_id' => $asrama->id,
            ]);

            return $asrama;
        });
    }

    public function assignSantri(int $asramaId, int $kamarId, int $siswaId): PenghuniAsrama
    {
        return $this->transaction(function () use ($asramaId, $kamarId, $siswaId) {
            $institutionId = $this->getInstitutionId();
            if (!$institutionId) {
                throw new \Exception('User institution not found');
            }

            $penghuni = PenghuniAsrama::create([
                'institution_id' => $institutionId,
                'asrama_id' => $asramaId,
                'kamar_id' => $kamarId,
                'siswa_id' => $siswaId,
                'tanggal_masuk' => now(),
                'status' => 'aktif',
            ]);

            // Update jumlah terisi
            $asrama = Asrama::find($asramaId);
            $asrama->increment('terisi');

            $kamar = \App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\KamarAsrama::find($kamarId);
            $kamar->increment('terisi');

            $this->logActivity('assign_santri_asrama', 'asrama', [
                'penghuni_id' => $penghuni->id,
                'siswa_id' => $siswaId,
            ]);

            return $penghuni;
        });
    }
}
