<?php
if (!$_POST['string'] == ""){
    $string = $_POST['string'];
    $min = $_POST['min'];
    $max = $_POST['max'];
    $result = $_POST['result'];
    $size = strlen($result);
    for ($i=$min; $i<$max; ++$i){
        $percentagem = ($i/$max)*100;
        print $percentagem + "% calculado.";
        $res = hash('sha256', $string+$i);
        
        if ($res == $result){
            ob_start();
            echo "true";
            break;
        }
    }
    if ($res =! $result){
        ob_start();
        echo "false";
    }
}
?>
