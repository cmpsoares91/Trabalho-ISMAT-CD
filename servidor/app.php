<?php
	//input logfile
	error_log((string)$_POST,0);
	echo $_POST['base'];
        $expe = json_decode ($_POST['']);
        print $expe;
        //$resultarray = array();
	echo "experiencia";
	if (!$_POST['base'] == ""){
                $string = $_POST['base'];
                $block = $_POST['block'];
                $blocksize = $_POST['bloksize'];
                $objective = $_POST['objective'];
                
                $min = $block * $blocksize;
                
                $max = $min + $blocksize - 1;
                
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
                /*
		//$data = json_decode($_POST['data']);
		$string = $data->{'base'};
		$min = $data->{'block'} * $data->{'blockSize'};
		$max = $min + $data->{'blockSize'} - 1;
		$result = $data->{'objective'};*/
		
		$size = strlen($objective);
		for ($i=$min; $i<$max; ++$i){
			$percentagem = ($i/$max)*100;
			print $percentagem + "% calculado.\n";
			$res = hash('sha256', $string+$i);
			
			if ($res == $objective){
				ob_start();
				$json_string = "{\"found\": \"true\", \"resolution\": \"" + $string+$i + "\", \"hash\": \"" + $res +"\"}";
                                $resultarray = array('data'=>$json_string);
                                echo json_encode($resultarray);
				break;
			}
		}
		if ($res =! $objective){
			ob_start();
			echo json_encode("{\"found\": \"false\"}");
		}
	}
?>
