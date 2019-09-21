<?PHP


include(dirname(__FILE__) . '/../database.php');

$db = new DataBase("-----", "", "");

function getRealPOST()
{
    $pairs = explode("&", file_get_contents("php://input"));
    $vars = array();
    foreach ($pairs as $pair) {
        $nv = explode("=", $pair);
        $name = urldecode($nv[0]);
        $value = urldecode($nv[1]);
        $vars[$name] = $value;
    }
    return $vars;
}

$modelData = getRealPOST();

try {
    echo "name: " . $modelData["name"];
    $delSql = "DELETE FROM " . $modelData["name"];
    if (key_exists("key", $modelData)) {
        $delSql = $delSql . " WHERE modelkey=" . $modelData['key'] . " OR modelkey='name' OR modelkey='timestamp'";
    }
    echo $db->sql($delSql);
} catch (SQLPrepareStamentExcetion $e) {
    if ($e->getcode() == 1146) {
        echo "creating";
        echo $db->sql("CREATE TABLE " . $modelData["name"] . " (`modelkey` VARCHAR(50) NOT NULL DEFAULT 'null',`modelvalue` MEDIUMTEXT NULL DEFAULT NULL,PRIMARY KEY (`modelkey`))");
    } else {
        throw $e;
    }
}
$modelData["timestamp"] = date("c");

$sql = "INSERT INTO " . $modelData["name"] . " ( modelkey,modelvalue) VALUES";
$params = array();
$paramTypes = "";
foreach ($modelData as $key => $value) {
    $sql = $sql . " ( ? , ? ) ,";
    $paramTypes = $paramTypes . "ss";
    $params[] = $key;
    $params[] = $value;
}
echo $db->sql(rtrim($sql, ','), $paramTypes, $params);


?>