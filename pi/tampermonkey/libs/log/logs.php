<?PHP
    include(dirname(__FILE__) . '/../../database.php');

    $db = new DataBase("tpscript");

    $logs=$db->sql("SELECT * FROM log ORDER BY timestamp DESC LIMIT 200");

    $sqlStr="SELECT * FROM log_attributes WHERE log_id IN ( ";
    $params=array();
    $paramTypes="";
    foreach($logs as $log){
        $params[] = $log[0];
        $sqlStr=$sqlStr." ?,";
        $paramTypes=$paramTypes."i";
    }
    $sqlStr=rtrim($sqlStr, ',')." )";
    $logsAtts=$db->sql($sqlStr,$paramTypes, $params);

    $responseLogs=array();

    foreach($logs as $log){
        $responseLog=array();
       
        $responseLog["id"]=$log[0];

        $responseLog["timestamp"]=$log[1];
        $responseLog["severity"]=$log[2];
        $responseLog["application"]=$log[3];
        $responseLog["message"]=$log[4];

        foreach($logsAtts as $logAtt){
            if($logAtt[0]==$log[0]){
                $responseLog[$logAtt[1]]=$logAtt[2];
            }
        }

        $responseLogs[]=$responseLog;

    }

    
    echo json_encode($responseLogs);
?>