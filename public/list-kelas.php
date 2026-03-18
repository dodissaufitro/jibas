<?php
// Simple script to list available kelas_id for import
require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "<html><head><title>Daftar Kelas ID</title>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    table { border-collapse: collapse; width: 100%; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    th { background: #4472C4; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    tr:hover { background: #f9f9f9; }
    .highlight { color: #e74c3c; font-weight: bold; }
</style></head><body>";

echo "<h1>📋 Daftar Kelas ID untuk Import Siswa</h1>";
echo "<p>Gunakan <span class='highlight'>ID</span> di kolom <code>kelas_id</code> pada file Excel import</p>";

try {
    $kelas = DB::table('kelas')
        ->join('jenjang', 'kelas.jenjang_id', '=', 'jenjang.id')
        ->leftJoin('jurusan', 'kelas.jurusan_id', '=', 'jurusan.id')
        ->select('kelas.id', 'kelas.nama', 'kelas.tingkat', 'kelas.nama_kelas', 'jenjang.nama as jenjang_nama', 'jurusan.nama as jurusan_nama')
        ->orderBy('jenjang.nama')
        ->orderBy('kelas.tingkat')
        ->orderBy('kelas.nama')
        ->get();

    if ($kelas->isEmpty()) {
        echo "<p style='color: red;'>⚠️ Tidak ada data kelas. Silakan tambahkan kelas terlebih dahulu.</p>";
    } else {
        echo "<table>";
        echo "<tr><th>ID</th><th>Nama Kelas</th><th>Tingkat</th><th>Jenjang</th><th>Jurusan</th></tr>";

        foreach ($kelas as $k) {
            echo "<tr>";
            echo "<td class='highlight'>{$k->id}</td>";
            echo "<td>{$k->nama_kelas}</td>";
            echo "<td>{$k->tingkat}</td>";
            echo "<td>{$k->jenjang_nama}</td>";
            echo "<td>" . ($k->jurusan_nama ?? '-') . "</td>";
            echo "</tr>";
        }

        echo "</table>";
        echo "<p style='margin-top: 20px;'><strong>Total:</strong> " . $kelas->count() . " kelas</p>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}

echo "</body></html>";
