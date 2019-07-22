<?PHP
include(dirname(__FILE__) . '/../../database.php');



$db = new DataBase("kissanimeImageColor");
echo json_encode($db->sql("SELECT * FROM kissanime_tags ORDER BY tag_id "));
