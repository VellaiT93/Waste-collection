<?php

session_start();

if (isset($_SESSION["useruid"])) {
    $result = true;
    $userName = $_SESSION["useruid"];

    $return = array();

    array_push($return, $result);
    array_push($return, $userName);

    echo json_encode($return);
} else {
    $result = false;
    echo json_encode($result);
}

exit();