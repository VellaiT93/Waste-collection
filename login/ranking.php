<?php

if (isset($_GET["level"])) {

    $level = $_GET["level"];

    // Require connection to DB (check)
    require_once 'dbh.php';
    
    $sql = "SELECT * FROM `".$dbName."`.`".$level."`;";
    $stmt = mysqli_stmt_init($conn);

    // Check if stmt failed
  /*  if (!mysqli_stmt_prepare($stmt, $sql)) {
        header("location: ../main.php?error=stmtfailed");
        exit();
    }

    mysqli_stmt_execute($stmt);
    $resultData = mysqli_stmt_get_result($stmt);

    if (!$row = mysqli_fetch_assoc($resultData)) {
        header("location: ../main.php?error=emptydb");
        exit();
    }*/
    
    $result = mysqli_query($conn, $sql);
    $resultCheck = mysqli_num_rows($result);

    $row = array();

    if ($resultCheck > 0) {
        while ($temp = mysqli_fetch_assoc($result)) {
            array_push($row, $temp);
        }
    }

    echo json_encode($row);

    exit();

}