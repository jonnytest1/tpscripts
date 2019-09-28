<?PHP
    include(dirname(__FILE__) . '/../database.php');


    $body=file_get_contents("php://input");

    //echo $body;
    
    $data=json_decode($body,true);

    $sapId=$data["sapId"];

    $appointments=$data["appointments"];

    $db = new DataBase("tpscript");

    $db->sql("INSERT INTO times (data,sapId) VALUES ( ?, ? )","si",array(
       
        json_encode($appointments), $sapId));

?>