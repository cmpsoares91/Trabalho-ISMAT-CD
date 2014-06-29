<?php
	if (!$_POST['data'] == ""){
		$data = json_decode($_POST['data']);
		$string = $data->{'baseStr'};
		$min = $data->{'block'} * $data->{'blockSize'};
		$max = $min + $data->{'blockSize'} - 1;
		$result = $data->{'objective'};
		
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
