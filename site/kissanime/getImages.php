<?PHP
    include( dirname(__FILE__) . '/../../database.php');
    include( dirname(__FILE__) . '/../../request.php');

    $minID=-1;
    $param=getQueryParams();
    if(array_key_exists("minID",$param)){
        $minID=$param["minID"];
    }

    $db=new DataBase();
    $resultArray=array();
    $imagesArray= $db->sql("SELECT kissanime_images.image_id,kissanime_images.imagedata,kissanime_tags.tag_name
        FROM kissanime_tags,kissanime_images_tag,kissanime_images
        WHERE kissanime_images.image_id=kissanime_images_tag.image
        AND kissanime_tags.tag_id =kissanime_images_tag.tag
        AND kissanime_images_tag.correct=TRUE
        AND kissanime_images.image_id > ?
        AND kissanime_tags.tag_name != 'undefined'
        ORDER BY kissanime_images.image_id 
        LIMIT 63 ","i",$minID); 
    foreach($imagesArray as $imgarray){
        $found=false;
        for($i=0;$i<sizeof($resultArray);$i++){
            if($resultArray[$i][0]==$imgarray[0]){
                array_splice( $resultArray[$i], 1, 0,$imgarray[2]);
                $found=true;
                break;
            }
        }
        if(!$found){
            $resultArray[]=array($imgarray[0],$imgarray[2],$imgarray[1]);
        }
    }   
    echo json_encode($resultArray);
    
?>