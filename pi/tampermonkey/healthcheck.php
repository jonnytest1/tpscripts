<?PHP
include(dirname(__FILE__) . '/fileLoader.php');
try {
	echo "works";
} catch (Exception $e) {
	http_response_code(400);
	echo $e;
}
?>