<?php

$serverName = 'localhost';
$dbName = 'wastecollection';
$tableName = 'users';
$userName = 'root';
$userPassword = '4ypz7298heV$4y';

$conn = mysqli_connect($serverName, $userName, $userPassword, $dbName);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
} else {
   // die("Connected to DB.");
}