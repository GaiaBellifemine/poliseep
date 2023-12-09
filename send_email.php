<?php

if(isset($_POST["codice"]))
    $random_pin = $_POST["codice"];

if(isset($_POST["email"]))
    $email = $_POST["email"];

$subject = "PoliSeep -- PASSWORD RECOVERY";
$message = "Hello, use the PIN '".$random_pin."' to recover your password. ";
//$headers = "PoliSeep (Management System) says: ";
$headers = "From: gruppo47.ingsw@gmail.com";

if(mail($email, $subject, $message, $headers))
    echo "OK"; 
else
    echo "KO";

?>