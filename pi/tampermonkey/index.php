<?PHP 
	require( 'request.php');
	include( dirname(__FILE__) . '/fileLoader.php');
	try{
		require("rotate/rotate.php");

		$rotate=new Rotate();
		$fileLoader=new FileLoader();
		$exceptionHeader=" ";
		set_error_handler(function($errno, $errstr, $errfile, $errline, array $errcontext) {
			// error was suppressed with the @-operator
			if (0 === error_reporting()) {
				//return false;
			}
			throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
		});
		function StackTraceToString($n){
				$str="";
				if(array_key_exists("file",$n)){
					$str=$str."file: ".$n["file"]." ";
				}
				if(array_key_exists("line",$n)){
					$str=$str."line: ".$n["line"]." ";
				}
				
				return $str.$n["function"]." args: ".json_encode($n["args"]);
			}
		function logKibana($content){
			$url = 'http://192.168.178.48/logging';
			$data = array_replace_recursive(array(
				'@timestmap' => date('c'),
				 'message' => "caught exception",
				 'url'=>"".getQueryParams()["url"],
				"application"=>"php-server"),$content);
			
			// use key 'http' even if you send the request to https://...
			$options = array(
				'http' => array(
					'header'  => "Content-type: application/json\r\n",
					'method'  => 'PUT',
					'content' => json_encode($data)
				)
			);
			$context  = stream_context_create($options);
			$result = file_get_contents($url, false, $context);
		}
		function handleException($e){
			
			$data = array();
			if($e instanceof Throwable){
					$data["error_message"]=$e->getMessage();
					$data["error_stacktrace"]=join("\r\n",array_map("StackTraceToString",$e->getTrace()));
			}else{
				$data["error_message"]=json_encode($e);
			}
			global $exceptionHeader;
			$exceptionHeader=$exceptionHeader."alert('".$data["error_message"]."');";
			logKibana($data);
		}
		
		function endsWith($haystack, $needle) {
			return substr_compare($haystack, $needle, -strlen($needle)) === 0;
		}
		if(!($exceptionHeader==" ")){
				header("exception: ".$exceptionHeader);
		}

		$json="(function all(){ try{\n";
		
		$json=$json.$fileLoader->preProcessFileName('BASE').".then(async BASE=>{";
		
		$queryPAramas=getQueryParams();
		if(!array_key_exists("url",$queryPAramas)){
			echo "missing url param";
			return;
		}

		$requestUrl=getQueryParams()["url"];
		$parsedUrl=parse_url($requestUrl);

		$json=$json."\n//---------------------site start: rotate: ".$requestUrl."  site: ".urlencode($parsedUrl["host"])."  -----------------------\n";
		if($rotate->isRotate($requestUrl)){
			$json=$json."\n//isrotate true\n";
			$json=$json.$rotate->getNext($requestUrl);
		}
		$rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('site')); 
		foreach ($rii as $file) {
			if ($file->isDir()){ 
				continue;
			}
			
			$filesName = $file->getFilename(); 
			if (endsWith($filesName,".html")){ 
				continue;
			}
			//echo $filesName."\n";
			$filesName=str_replace(".". $file->getExtension(),"",  $filesName);
			$filesName=str_replace("%","\\\\\/",  str_replace("$","(.*)",$filesName));
			
			$requestUrlPAttern=str_replace("/","\\/",$requestUrl);

			$pattern="/(.*)".$filesName."(.*)/";
			//logKibana(array("message"=>"matching ".$pattern." to ".$requestUrlPAttern));
			if(preg_match($pattern, $requestUrlPAttern)==1){
				//logKibana(array("message"=>"matched"));
				$json=$json."//---------------------site start:-----------------------".$file->getPathname()."-----------------------\n";
				$requireName=$file->getPathname();
				if($file->getExtension()=="php"){
					require($requireName);
				}else{
					$requirePath=str_replace(".".$file->getExtension(),"",$file->getPathname());
					$json=$json."await reqS('".str_replace("%","%25",$requirePath)."');\n";
					//$json=$json.$fileLoader->preProcessFileName($file->getPathname());
				}
				$json=$json."//_________________________end of site________".$file->getPathname()."___________________\n";
			}
		}
		$json=$json."//_________________________end of site___________________________\n";

		$json=$json."\n});}catch(e){\n\tconsole.trace(e);\n\thandleError(e);\n}})();";
		echo $json;
	}catch(Exception $e){
		http_response_code(400);
		echo $e;
	}
?>