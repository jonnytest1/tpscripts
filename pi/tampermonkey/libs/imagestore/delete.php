<?PHP
    require_once(dirname(__FILE__) . '/../../database.php');

    $body=file_get_contents("php://input");
    
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    $db = new DataBase("tpscript");
    $db->sql("DELETE FROM image WHERE id = ?","i",array(
        $body
    ));
    
?>