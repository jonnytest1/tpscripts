<?PHP 
    
    require("../../database.php");


    $db=new DataBase("kissanimeImageColor");
    
    $tagList= $_POST["tags"];
    $tags=explode(",",$tagList);


    $data=$_POST["image"];

    $chosen=$_POST["chosen"]=="true";

    mysqli_report(MYSQLI_REPORT_ALL);
    $statement=$db->link->prepare("INSERT INTO kissanime_images (imagedata) VALUES (?)");
    $statement->bind_param("s",json_encode($data));
    $statement->execute();
    $imageID= $statement->insert_id;
    $statement->close();

    foreach($tags as $tag){
      echo $tag;
        try{
        $tagstm=$db->link->prepare("INSERT INTO kissanime_tags (tag_name) VALUES (?)");
        $tagstm->bind_param("s",$tag);
        $tagstm->execute();
        $tagID = $tagstm->insert_id;
        $tagstm->close();
        }catch(mysqli_sql_exception $e){
          if(strpos( $e,"Duplicate entry")>-1){
            echo "duplicate ";
          $selectstm=$db->link->prepare("SELECT tag_id FROM kissanime_tags WHERE tag_name = ?");
          $selectstm->bind_param("s",$tag);
          $selectstm->execute();
          $result = $selectstm->get_result();

          $tagID=$result->fetch_array(MYSQLI_NUM)[0];
          
          $selectstm->close();
          }else{
            throw $e;
          }
        }

        $insertstm=$db->link->prepare("INSERT INTO kissanime_images_tag (image,tag,correct) VALUES (?,?,?)");
        $insertstm->bind_param("iii",$imageID,$tagID,$chosen);
        $insertstm->execute();
        $insertstm->close();
    }
