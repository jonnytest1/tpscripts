<?PHP
    function log_be($severity,$message,$timestamp=False){
        if($timestamp==False){
            $now=new DateTime();
            $timestamp=$now->format('Y-m-d H:i:s'); 
        }
        dbLog(array(
            "application"=>"php_backend",
            "Severity"=>$severity,
            "timestamp"=>$timestamp,
            "message"=>$message

        ));
    }

    function dbLog($parsed){
        $db = new DataBase("tpscript");
        $newId= $db->sql("INSERT INTO log (timestamp,severity,application,message,ip) VALUES (TIMESTAMP(?) ,? ,? ,?,?)","sssss",array(
            $parsed["timestamp"],
            $parsed["Severity"],
            $parsed["application"],
            $parsed["message"],
            $parsed["ip"]
        ));

        unset($parsed["timestamp"]);
        unset($parsed["Severity"]);
        unset($parsed["application"]);
        unset($parsed["message"]);
        unset($parsed["ip"]);


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
            //echo $sqlStr;
            //echo json_encode($params);
            echo $db->sql( $sqlStr,$paramTypes, $params);
        }
    }
?>