<?PHP 
    class FileLoader{

        function preProcessFileName($fileName){
			$fileName=explode("?", $fileName)[0];
			$fileName=str_replace("_","/",$fileName);
			if(substr_compare($fileName, ".js", -strlen(".js")) != 0){
				$fileName=$fileName.".js";
			}
			
		
			try{
				return "\n//___file=".$fileName."\n".$this->parseImports($fileName)."\n//===file-end=".$fileName."\n";
			}catch(Exception $e){
				header("missingSite: ".$fileName);
				return "";
			}
		}

		function parseImports($fileName){
			$fileContent=file_get_contents(dirname(__FILE__)."/".$fileName);

			preg_match_all('/let (.*) = IMPORT;/', $fileContent, $treffer,PREG_SET_ORDER);
			foreach((array)$treffer as $value){
				try{
					$fileContent=str_replace("let ".$value[1]." = IMPORT;","let ".$value[1]." = (".$this->preProcessFileName($value[1]).")();",$fileContent);
				}catch(ErrorException $e){
					logKibana(array("message"=>json_encode($value)));
					handleException($e);
				}
			}
			return $fileContent;
		}

    }
?>