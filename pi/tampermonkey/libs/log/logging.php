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
    }
?>