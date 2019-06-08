<?PHP


    include( dirname(__FILE__) . '/../database.php');

    $db=new DataBase("neural_test");

    $modelData=$_POST;
    try{
        echo json_encode( $db->sql("SELECT * FROM ".$modelData["name"]));
    }catch(SQLPrepareStamentExcetion $e){
        if($e->getcode()==1146){
            http_response_code(404);
            echo "not found";
           
        }
    }
   

    
    


?>
