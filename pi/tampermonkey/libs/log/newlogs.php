<?php
    require_once(dirname(__FILE__) . '/../../database.php');
    $db=new DataBase("tpscript");
    $affected = $db->sql("UPDATE log SET checked = TRUE WHERE (checked is NULL OR checked = FALSE) AND NOT severity = 'DEBUG' AND NOT severity = 'INFO' AND NOT severity = 'WARN'");
		
    $response=array(
        "affected"=>$affected
    );
    echo json_encode($response);
?>