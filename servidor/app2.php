<?php
	if (!$_POST['data'] == ""){
		ob_start();
		echo $_POST['data'];
	}
?>
