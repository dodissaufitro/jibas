<?php

namespace App\Http\Requests;

use App\Rules\SecureFileUpload;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSiswaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $siswaId = $this->route('siswa')->id;
        $userId = $this->route('siswa')->user_id;

        return [
            'nis'            => ['required', 'string', 'max:20', Rule::unique('siswa')->ignore($siswaId)],
            'nisn'           => ['nullable', 'string', 'max:20', Rule::unique('siswa')->ignore($siswaId)],
            'nik'            => ['nullable', 'string', 'max:20', 'regex:/^[0-9]{16}$/'],
            'nama_lengkap'   => ['required', 'string', 'max:255', 'min:3'],
            'jenis_kelamin'  => ['required', Rule::in(['L', 'P'])],
            'tempat_lahir'   => ['required', 'string', 'max:255'],
            'tanggal_lahir'  => ['required', 'date', 'before:today', 'after:' . now()->subYears(25)->format('Y-m-d')],
            'alamat'         => ['required', 'string', 'min:10'],
            'email'          => ['nullable', 'email:rfc,dns', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'no_hp'          => ['nullable', 'string', 'max:15', 'regex:/^[0-9+\-\s()]+$/'],
            'nama_ayah'      => ['required', 'string', 'max:255'],
            'nama_ibu'       => ['required', 'string', 'max:255'],
            'no_hp_ortu'     => ['required', 'string', 'max:15', 'regex:/^[0-9+\-\s()]+$/'],
            'kelas_id'       => ['required', 'exists:kelas,id'],
            'status'         => ['required', Rule::in(['aktif', 'lulus', 'pindah', 'keluar'])],
            'tanggal_masuk'  => ['required', 'date', 'before_or_equal:today'],
            'tanggal_keluar' => ['nullable', 'date', 'after:tanggal_masuk'],
            'foto'           => ['nullable', SecureFileUpload::photo(2048)],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nis.required' => 'NIS wajib diisi.',
            'nis.unique' => 'NIS sudah terdaftar.',
            'nik.regex' => 'NIK harus 16 digit angka.',
            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'nama_lengkap.min' => 'Nama lengkap minimal 3 karakter.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'tempat_lahir.required' => 'Tempat lahir wajib diisi.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.before' => 'Tanggal lahir harus sebelum hari ini.',
            'tanggal_lahir.after' => 'Umur siswa tidak boleh lebih dari 25 tahun.',
            'alamat.required' => 'Alamat wajib diisi.',
            'alamat.min' => 'Alamat minimal 10 karakter.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'no_hp.regex' => 'Format nomor HP tidak valid.',
            'nama_ayah.required' => 'Nama ayah wajib diisi.',
            'nama_ibu.required' => 'Nama ibu wajib diisi.',
            'no_hp_ortu.required' => 'Nomor HP orang tua wajib diisi.',
            'no_hp_ortu.regex' => 'Format nomor HP orang tua tidak valid.',
            'kelas_id.required' => 'Kelas wajib dipilih.',
            'kelas_id.exists' => 'Kelas tidak ditemukan.',
            'status.required' => 'Status wajib dipilih.',
            'tanggal_masuk.required' => 'Tanggal masuk wajib diisi.',
            'tanggal_keluar.after' => 'Tanggal keluar harus setelah tanggal masuk.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'nis' => 'NIS',
            'nisn' => 'NISN',
            'nik' => 'NIK',
            'nama_lengkap' => 'nama lengkap',
            'jenis_kelamin' => 'jenis kelamin',
            'tempat_lahir' => 'tempat lahir',
            'tanggal_lahir' => 'tanggal lahir',
            'alamat' => 'alamat',
            'email' => 'email',
            'no_hp' => 'nomor HP',
            'nama_ayah' => 'nama ayah',
            'nama_ibu' => 'nama ibu',
            'no_hp_ortu' => 'nomor HP orang tua',
            'kelas_id' => 'kelas',
            'status' => 'status',
            'tanggal_masuk' => 'tanggal masuk',
            'tanggal_keluar' => 'tanggal keluar',
            'foto' => 'foto',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'nis' => trim($this->nis ?? ''),
            'nama_lengkap' => trim($this->nama_lengkap ?? ''),
            'email' => trim($this->email ?? ''),
        ]);
    }
}
