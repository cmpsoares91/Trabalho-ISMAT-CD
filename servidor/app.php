<?php
	
	if (!$_POST['base'] == ""){
                $string = $_POST['base'];
                $block = $_POST['block'];
                $blocksize = $_POST['blockSize'];
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
                                $result = true;
                                echo json_encode($result);
				break;
			}
		}
		if ($res =! $objective){
			ob_start();
                        $result=false;
                        echo json_encode($result);
			//echo json_encode("{\"found\": \"false\"}");
		}
	}
?>
