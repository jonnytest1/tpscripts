<?PHP
    include(dirname(__FILE__) . '/../database.php');


    $body=file_get_contents("php://input");

    echo $body;
    
    
    $db = new DataBase("tpscript");

    $db->sql("INSERT INTO times (data) VALUES ( ? )","s",array($body));


?>