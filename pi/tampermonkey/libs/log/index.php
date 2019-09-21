<?PHP
include(dirname(__FILE__) . '/../../database.php');

$db = new DataBase("tpscript");

echo json_encode($_POST);

?>