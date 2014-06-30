<?php
	//input logfile
	$req_dump = print_r($_REQUEST, TRUE);
	$fp = fopen('request.log', 'a');
	fwrite($fp, $req_dump);
	fclose($fp);

	if (!$_POST['data'] == ""){
		$exp = "entrei";
		
		$json = file_get_contents('php://input');
		$obj = json_decode($json);
                
                //logfile
                $logfile = 'log.txt';
                $current = file_get_contents($logfile);
                $current .= $exp;
				$current .= $_POST;
				$current .= $obj;
                file_put_contents($logfile, $current);
                
		$data = json_decode($_POST['data']);
		$string = $data->{'base'};
		$min = $data->{'block'} * $data->{'blockSize'};
		$max = $min + $data->{'blockSize'} - 1;
		$result = $data->{'objective'};
		
		$size = strlen($result);
		for ($i=$min; $i<$max; ++$i){
			$percentagem = ($i/$max)*100;
			print $percentagem + "% calculado.\n";
			$res = hash('sha256', $string+$i);
			
			if ($res == $result){
				ob_start();
				$json_string = "{\"found\": \"true\", \"resolution\": \"" + $string+$i + "\", \"hash\": \"" + $res +"\"}";
				echo json_encode($json_string);
				break;
			}
		}
		if ($res =! $result){
			ob_start();
			echo json_encode("{\"found\": \"false\"}");
		}
	}
?>
