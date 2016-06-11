<?php

require "validation.php";

function arrayToObj($array)
{
    return json_decode(json_encode($array), false);
}