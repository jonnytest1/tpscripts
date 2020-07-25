<?PHP
    require_once(dirname(__FILE__) . '/../../database.php');

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    $body=file_get_contents("php://input");
    
    
    $db = new DataBase("tpscript");
    $newId= $db->sql("INSERT image (b64) VALUES (?)","s",array(
        $body
    ));
    echo $newId
?>