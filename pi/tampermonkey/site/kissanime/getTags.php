<?PHP
    include( dirname(__FILE__) . '/../../database.php');



    $db=new DataBase();
    echo json_encode( $db->sql("SELECT * FROM kissanime_tags ORDER BY tag_id "));    
?>