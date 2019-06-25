<?PHP
    include( dirname(__FILE__) . '/request.php');

    $qParams=getQueryParams();
    $url=$qParams["url"];
   
    $url="/".$url.".js";
    $url=dirname(__FILE__) .$url;
    try{

        if(file_exists($url)){
            $str=file_get_contents($url );
        }else{
            $url=str_replace("%25","%",$url);
            $str=file_get_contents($url);
        }

        

        if(strpos($url,"rotate/rotate")>-1){
            include( dirname(__FILE__) . '/rotate/rotate.php');
            include( dirname(__FILE__) . '/fileLoader.php');
            
            $fileLoader=new FileLoader();
            $rotate=new Rotate();
        
            $queryPAramas=$qParams;
            if(!array_key_exists("rotateUrl",$queryPAramas)){
                echo "missing rotateUrl param";
                return;
            }
            $requestUrl=$qParams["rotateUrl"];
            $str=$fileLoader->preProcessFileName("rotate/rotate");
            $str=$rotate->injectUrls($str,str_replace(".js","",$requestUrl));
            
        }
        if(strpos($str,"EvalScript")>-1){
           //$str=parseLibs($str,$url);
        }
        echo $str;
        
    }catch(ErrorException $e){
        echo "alert('failed getting file')";
    }

    function parseLibs($str,$url){
        preg_match_all('/<reference path="(.*)"(.*)\/>/',$str, $treffer,PREG_SET_ORDER);
        $libraries=array();
        foreach((array)$treffer as $value){
            if(strpos($value[1],".d.ts")>-1||strpos($value[1],"eval-script")>-1){
                continue;
            }
            $pathParams=explode("/",$url);
            array_pop($pathParams);
            $importParams=explode("/",$value[1]);
            while($importParams[0]==".."){
                array_shift($importParams);
                array_pop($pathParams);
                
            }
            $import=implode("/",$pathParams)."/".implode("/",$importParams);
            $import = preg_replace("/\//", "", $import, 1);
            $libraries[]=str_replace(".js","",$import);
        }
        $newStr="";
        $lines=explode("\n",$str);
        foreach( $lines as $index=> $line){
            if(strpos($line,"new EvalScript")>-1&&strpos($line,")")==FALSE&&strpos($line,"finish")==FALSE){
                $newStr=$newStr.$line."\n    libraries:".json_encode($libraries).",";
            }else{
                $newStr=$newStr.$line;
            }
            if($index<count($lines)){
                $newStr=$newStr."\n";
            }
        }
        echo $newStr;

    }
?>