<?php

function createUser($conn, $name, $userPW, $userUid, $userEmail) {

    $sql = "INSERT INTO wastecollection.users (userName, userPassword, userUid, userEmail) VALUES (?, ?, ?, ?);";
    $stmt = mysqli_stmt_init($conn);

    // Check if stmt failed
    if (!mysqli_stmt_prepare($stmt, $sql)) {
        header("location: ../main.php?error=stmtfailed");
        exit();
    }

    $passwordHash = password_hash($userPW, PASSWORD_DEFAULT);

    mysqli_stmt_bind_param($stmt, 'ssss', $name, $passwordHash, $userUid, $userEmail);
    mysqli_stmt_execute($stmt);

   // mysqli_stmt_close($stmt);

    // THIS PART ALLOWS TO AUTOMATICALLY LOGIN THE USER AFTER REGISTERING!!!

    $sql = "SELECT * FROM wastecollection.users WHERE userUid = '".$userUid."';";
    $stmt = mysqli_stmt_init($conn);

    // Check if stmt failed
    if (!mysqli_stmt_prepare($stmt, $sql)) {
        header("location: ../main.php?error=stmtfailed");
        exit();
    }

    mysqli_stmt_execute($stmt);

    $resultData = mysqli_stmt_get_result($stmt);

    // Check for matching username or email in the DB
    if (!$row = mysqli_fetch_assoc($resultData)) {
        header("location: ../main.php?error=nonmatch");
        exit();
    }

    mysqli_stmt_close($stmt);

    session_start();

    $_SESSION["userid"] = $row["userId"];
    $_SESSION["useruid"] = $row["userUid"];

    header("location: ../main.php?user=" . $_SESSION["useruid"]);

    // header("location: ../main.php?user=usercreated");

    exit();

}

if (isset($_POST['submit'])) {

    $name = $_POST['name'];
    $userUid = $_POST['userName'];
    $userEmail = $_POST['userEmail'];
    $userPW = $_POST['pwd'];
    $userPWRep = $_POST['pwdRepeat'];

    // Require connection to DB (check)
    require_once 'dbh.php';

    // Check for empty
    if (empty($name) || empty($userName) || empty($userEmail) || empty($userPW) || empty($userPWRep)) {
        header("location: ../main.php?error=empty");
        exit();
    }

    // Check for correct name
    /*if (!preg_match("/[^a-z\s-]/i", $name)) {
        header("location: ../main.php?error=wrongname");
        exit();
    }*/

    // Check for correct user name
    if (!preg_match("/^[a-zA-Z0-9]*$/", $userName)) {
        header("location: ../main.php?error=wrongusername");
        exit();
    }

    // Check for proper email
    if (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
        header("location: ../main.php?error=wrongemail");
        exit();
    }

    // Check for password match
    if ($userPW !== $userPWRep) {
        header("location: ../main.php?error=pwmissmatch");
        exit();
    }

    // Check if user name already exists in DB
    $sql = "SELECT * FROM wastecollection.users WHERE userUid = ? OR userEmail = ?;";
    $stmt = mysqli_stmt_init($conn);

    // Check if stmt failed
    if (!mysqli_stmt_prepare($stmt, $sql)) {
        header("location: ../main.php?error=stmtfailed");
        exit();
    }

    mysqli_stmt_bind_param($stmt, 'ss', $userUid, $userEmail);
    mysqli_stmt_execute($stmt);

    $resultData = mysqli_stmt_get_result($stmt);

    if (mysqli_fetch_assoc($resultData)) {
        header("location: ../main.php?error=nameemailtaken");
        exit();
    } else {
        createUser($conn, $name, $userPW, $userUid, $userEmail);
    }

    mysqli_stmt_close($stmt);

} else {
    exit();
}