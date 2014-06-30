<?php
	if (!$_POST['key1'] == ""){
		ob_start();
		echo $_POST['key1'];
	}
?>
