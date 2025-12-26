<?php
// database connection settings
$dsn = 'mysql:host=localhost;port=3306;dbname=LiquorInventory_2025';
$username = 'root';
$password = '';

// connect to database
try {
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    $error_message = $e->getMessage();
    echo json_encode(['error' => ['text' => $error_message]]);
    exit();
}
?>