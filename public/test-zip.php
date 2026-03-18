<?php
echo "<h1>PHP ZIP Extension Test</h1>";

if (class_exists('ZipArchive')) {
    echo "<p style='color: green; font-size: 20px;'><strong>✅ SUCCESS!</strong> ZipArchive class is available.</p>";
    echo "<p>Extension is loaded and working.</p>";
} else {
    echo "<p style='color: red; font-size: 20px;'><strong>❌ FAILED!</strong> ZipArchive class NOT found.</p>";
    echo "<p>Extension is NOT loaded.</p>";
}

echo "<hr>";
echo "<h2>Loaded Extensions:</h2>";
echo "<pre>";
print_r(get_loaded_extensions());
echo "</pre>";

echo "<hr>";
echo "<h2>PHP Info:</h2>";
phpinfo();
