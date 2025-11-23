<?php
declare(strict_types=1);

/**
 * Centralised database configuration/connection helper.
 * Prefer configuring credentials via environment variables (see .env.example).
 */

const DEFAULT_DB_CONFIG = [
    'host' => 'localhost',
    'user' => 'root',
    'pass' => 'alkesha15',
    'name' => 'trial',
];

/**
 * Fetch database credentials from environment with secure fallbacks.
 */
function get_db_config(): array
{
    return [
        'host' => getenv('DB_HOST') ?: DEFAULT_DB_CONFIG['host'],
        'user' => getenv('DB_USER') ?: DEFAULT_DB_CONFIG['user'],
        'pass' => getenv('DB_PASS') ?: DEFAULT_DB_CONFIG['pass'],
        'name' => getenv('DB_NAME') ?: DEFAULT_DB_CONFIG['name'],
    ];
}

/**
 * Create a mysqli connection with consistent error handling.
 */
function get_db_connection(): mysqli
{
    $cfg = get_db_config();
    $conn = new mysqli($cfg['host'], $cfg['user'], $cfg['pass'], $cfg['name']);
    if ($conn->connect_error) {
        throw new RuntimeException('Database connection failed: ' . $conn->connect_error);
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

