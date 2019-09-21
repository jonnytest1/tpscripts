<?PHP
    include(dirname(__FILE__) . '/../../database.php');


    $body=file_get_contents("php://input");
    $decoded=base64_decode($body);
    
    $parsed=json_decode($decoded,true);

    $db = new DataBase("tpscript");
    if(!key_exists("timestamp",$parsed)){
        $now=new DateTime();
        $parsed["timestamp"]=$now->format('Y-m-d H:i:s'); 
    }else if(is_numeric(  $parsed["timestamp"])){
        $ts=new DateTime($parsed["timestamp"]);
        $parsed["timestamp"]=$now->getTimestamp(); 
    }
    if(!key_exists("application",$parsed)){
        http_response_code(400);
        echo "missing key application in ".json_encode($parsed);
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
    $newId= $db->sql("INSERT INTO log (timestamp,severity,application,message) VALUES (TIMESTAMP(?) ,? ,? ,?)","ssss",array(
        $parsed["timestamp"],
        $parsed["Severity"],
        $parsed["application"],
        $parsed["message"]
    ));

    unset($parsed["timestamp"]);
    unset($parsed["Severity"]);
    unset($parsed["application"]);
    unset($parsed["message"]);

    
    if(sizeof($parsed) > 0){
        $sqlStr="INSERT INTO log_attributes (log_id,`key`,`value`) VALUES ";
        $params=array();
        $paramTypes="";
        foreach ($parsed as $key => $value) {
            $sqlStr=$sqlStr." (? , ? , ?) ,";
            $paramTypes=$paramTypes."dss";
            $params[]= $newId;
            $params[]= $key;
            $params[]= $value;
        }
        $sqlStr=rtrim($sqlStr, ',');
        echo $sqlStr;
        echo json_encode($params);
        $db->sql( $sqlStr,$paramTypes, $params);
    }
?>