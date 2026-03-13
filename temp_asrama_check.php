<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

Auth::loginUsingId(1);

$request = Illuminate\Http\Request::create('/pesantren/asrama', 'GET');
$response = $kernel->handle($request);

echo 'STATUS: ' . $response->getStatusCode() . PHP_EOL;

$content = $response->getContent();
if (is_string($content)) {
    echo 'CONTENT_HEAD: ' . substr($content, 0, 200) . PHP_EOL;
}

$kernel->terminate($request, $response);
