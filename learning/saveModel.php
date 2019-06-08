<?PHP


    include( dirname(__FILE__) . '/../database.php');

    $db=new DataBase("neural_test");

    $modelData=$_POST;
    
    try{
        echo json_encode($modelData);
        echo $db->sql("DELETE FROM ".$modelData["name"]);
    }catch(SQLPrepareStamentExcetion $e){
        if($e->getcode()==1146){
            echo "creating";
            echo $db->sql("CREATE TABLE ".$modelData["name"]." (`modelkey` VARCHAR(50) NOT NULL DEFAULT 'null',`modelvalue` MEDIUMTEXT NULL DEFAULT NULL,PRIMARY KEY (`modelkey`))");
        }else{
            throw $e;
        }
      
    }
    $modelData["timestamp"]=date("c");

    $sql="INSERT INTO ".$modelData["name"]." ( modelkey,modelvalue) VALUES";
    $params=array();
    $paramTypes="";
    foreach($modelData as $key=>$value){
        $sql=$sql." ( ? , ? ) ,";
        $paramTypes=$paramTypes."ss";
        $params[]=$key;
        $params[]=$value;
      
    }
    echo $db->sql(rtrim($sql,','),$paramTypes,$params);

    
    


?>
