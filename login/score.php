<?php

function insertScore($conn, $sql, $userUd, $cost, $time, $userId, $fullName) {

    $stmt = mysqli_stmt_init($conn);

    // Check if stmt failed
    if (!mysqli_stmt_prepare($stmt, $sql)) {
        header("location: ../main.php?error=stmtfailed");
        exit();
    }

    mysqli_stmt_bind_param($stmt, 'iisis', $cost, $time, $userUd, $userId, $fullName);
    mysqli_stmt_execute($stmt);

    mysqli_stmt_close($stmt);

    echo json_encode($cost);

    exit();

}


if (isset($_POST["level"]) && isset($_POST["userName"]) && isset($_POST["cost"]) && isset($_POST["time"]) && isset($_POST["dbScore"])) {

    $level = $_POST["level"];
    $userUd = $_POST["userName"];
    $cost = $_POST["cost"];
    $time = $_POST["time"];

    $dbScore = $_POST["dbScore"];

    // Require connection to DB (check)
    require_once 'dbh.php';

    $sql = "SELECT userId, userName FROM wastecollection.users WHERE userUid = ?;";
    $stmt = mysqli_stmt_init($conn);

    // Check if stmt failed
    if (!mysqli_stmt_prepare($stmt, $sql)) {
        header("location: ../main.php?error=stmtfailed");
        exit();
    }

    mysqli_stmt_bind_param($stmt, 's', $userUd);
    mysqli_stmt_execute($stmt);

    $resultData = mysqli_stmt_get_result($stmt);
    $result = mysqli_fetch_assoc($resultData);

    $userId = $result["userId"];
    $fullName = $result["userName"];

    mysqli_stmt_close($stmt);


    // Check if user already exists
    if ($dbScore === "none") {
        $insertSql = "INSERT INTO `".$dbName."`.`".$level."` (score, time, userUid, userId, userName) VALUES (?, ?, ?, ?, ?);";
        insertScore($conn, $insertSql, $userUd, $cost, $time, $userId, $fullName);
    } else {
        $insertSql = "UPDATE `".$dbName."`.`".$level."` SET score = ?, time = ?, userUid = ?, userId = ?, userName = ? WHERE userUid = '".$userUd."';";
        insertScore($conn, $insertSql, $userUd, $cost, $time, $userId, $fullName);
    }

}