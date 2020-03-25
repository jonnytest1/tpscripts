<?PHP
    include(dirname(__FILE__) . '/../../database.php');
    include(dirname(__FILE__) . '/logging.php');

    $body=file_get_contents("php://input");
    $body=str_replace("'","\"",$body);
    $parsed=json_decode($body,true);
    
    $headers=getallheaders();
    if(key_exists("HTTP_X_FORWARDED_FOR",$headers)){
        $parsed["ip"]=$headers['HTTP_X_FORWARDED_FOR'];
    }else if(key_exists("REMOTE_ADDR",$_SERVER)){
        $parsed["ip"]=$_SERVER['REMOTE_ADDR'];
    }

    if(!key_exists("timestamp",$parsed)){
        $now=new DateTime();
        $parsed["timestamp"]=$now->format('Y-m-d H:i:s'); 
    }else if(is_numeric(  $parsed["timestamp"])){
        $ts=new DateTime($parsed["timestamp"]);
        $parsed["timestamp"]=$ts->getTimestamp(); 
    }
    if(!key_exists("application",$parsed)){
        http_response_code(400);
        echo "// missing key application in ".json_encode($parsed)."\n";
        return;
    }

    if(!key_exists("Severity",$parsed)){
        http_response_code(400);
        echo "missing key Severity";
        return;
    }
    if(!key_exists("message",$parsed)){
        http_response_code(400);
        echo "missing key message";
        return;
    }
    dbLog($parsed);
?>