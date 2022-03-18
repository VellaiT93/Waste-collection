<?php

if (isset($_GET["level"]) && isset($_GET["userName"])) {
    
    $level = $_GET["level"];
    $userUid = $_GET["userName"];

    // Require connection to DB (check)
    require_once 'dbh.php';

    $sql = "SELECT score FROM `".$dbName."`.`".$level."` WHERE userUid = ?;";
    $stmt = mysqli_stmt_init($conn);

    // Check if stmt failed
    if (!mysqli_stmt_prepare($stmt, $sql)) {
        header("location: ../main.php?error=stmtfailed");
        exit();
    }

    mysqli_stmt_bind_param($stmt, 's', $userUid);
    mysqli_stmt_execute($stmt);

    $resultData = mysqli_stmt_get_result($stmt);

    $row = mysqli_fetch_assoc($resultData);

    mysqli_stmt_close($stmt);

    echo json_encode($row);

    exit();

}