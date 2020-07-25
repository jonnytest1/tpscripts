<?PHP
    require_once(dirname(__FILE__) . '/../../database.php');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    $db = new DataBase("tpscript");
    $data= $db->sql("SELECT * FROM image");
    echo json_encode($data);
?>