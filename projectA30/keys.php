<?php
/*
 Author : Carlos Silva
 Version : 1.0
 Date : 16.06.2023
 Purpose : Project A30's key retrieval in PHP
*/

/**
 * Retrieves the API keys from the .apiKeys file and returns it.
 */
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