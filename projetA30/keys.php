<?php

function retrieveApiKeys()
{
    $path = __DIR__ . '/.apiKeys';
    $apiKeys = array();
    if (file_exists($path)) {
        $content = file_get_contents($path);
        $keyData = json_decode($content, true);

        if ($keyData) {
            foreach ($keyData as $key => $value) {
                $apiKeys[$key] = $value;
            }
        }


    } else {
        $apiKeys = null;
    }
    return $apiKeys;
}

$apiKeys = retrieveApiKeys();

echo json_encode($apiKeys);