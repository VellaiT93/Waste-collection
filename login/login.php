<?php

// Logs user in
function loginUser($row) {

    session_start();

    $_SESSION["userid"] = $row["userId"];
    $_SESSION["useruid"] = $row["userUid"];

    header("location: ../main.php?user=" . $_SESSION["useruid"]);

    exit();

}

if (isset($_POST["submit"])) {

    $userUid = $_POST["userName"];
    $userPW = $_POST["pwd"];

    // Require connection to DB (check)
    require_once 'dbh.php';

    // Check for empty
    if (empty($userUid) || empty($userPW)) {
        header("location: ../main.php?error=empty");
        exit();
    }

    // Check if user name or email exists in DB
    $sql = "SELECT * FROM wastecollection.users WHERE userUid = ? OR userEmail = ?;";
    $stmt = mysqli_stmt_init($conn);

    // Check if stmt failed
    if (!mysqli_stmt_prepare($stmt, $sql)) {
        header("location: ../main.php?error=stmtfailed");
        exit();
    }

    mysqli_stmt_bind_param($stmt, 'ss', $userUid, $userUid);
    mysqli_stmt_execute($stmt);

    $resultData = mysqli_stmt_get_result($stmt);

    // Check for matching username or email in the DB
    if (!$row = mysqli_fetch_assoc($resultData)) {
        header("location: ../main.php?error=nonmatch");
        exit();
    }

    $passwordHashed = $row['userPassword'];

    $checkPassword = password_verify($userPW, $passwordHashed);

    // Wrong password
    if ($checkPassword === false) {
        header("location: ../main.php?error=wrongpw");
        exit();
    } else {
        loginUser($row);
    }

    mysqli_stmt_close($stmt);

} else {
    exit();
}