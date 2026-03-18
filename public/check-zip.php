<?php
header('Content-Type: text/plain');

echo "=== PHP ZIP EXTENSION DIAGNOSTIC ===\n\n";

echo "1. PHP Version: " . PHP_VERSION . "\n";
echo "2. PHP Binary: " . PHP_BINARY . "\n";
echo "3. Loaded Config File: " . php_ini_loaded_file() . "\n\n";

echo "4. ZipArchive Class: ";
if (class_exists('ZipArchive')) {
    echo "✅ AVAILABLE\n";
} else {
    echo "❌ NOT FOUND\n";
}

echo "\n5. Loaded Extensions:\n";
$exts = get_loaded_extensions();
sort($exts);
foreach ($exts as $ext) {
    if (stripos($ext, 'zip') !== false) {
        echo "   - $ext ✅\n";
    }
}

if (!in_array('zip', $exts)) {
    echo "   ❌ ZIP extension NOT loaded\n";
}

echo "\n6. Extension Dir: " . ini_get('extension_dir') . "\n";

$zipDll = ini_get('extension_dir') . DIRECTORY_SEPARATOR . 'php_zip.dll';
echo "7. php_zip.dll exists: " . (file_exists($zipDll) ? "✅ YES" : "❌ NO") . "\n";

echo "\n=== END DIAGNOSTIC ===\n";
