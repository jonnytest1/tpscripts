<?PHP
require_once(dirname(__FILE__) . '/../database.php');
require_once(dirname(__FILE__) . '/requests.php');
class Rotate
{

	private $db;
	private $rotateSites;

	function __construct()
	{
		$this->db = new DataBase("tpscript");
		$this->rotateSites = $this->getRotateArray();
	}
	private $notRotateSites = array(
		"rotate.js",
	);

	function getRotateArray()
	{
		$sites = array();
		$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(dirname(__FILE__)));
		foreach ($iterator as $file) {
			if ($file->isDir()) {
				continue;
			}
			$name = $file->getFilename();
			if ($file->getExtension() == "php"||preg_match("/_disabled$/",pathinfo($name)['filename'])) {
				continue;
			}
		

			if (in_array($name, $this->notRotateSites)) {
				continue;
			}
			$sites[] = urldecode(str_replace(".js", "", $name));
		}
		return $sites;
	}

	function isRotate($url)
	{
		return in_array($url, $this->rotateSites);
	}

	function injectUrls($str, $url)
	{
		if($url==NULL){
			$url=$this->rotateSites[0];
		}


		$currentIndex=array_search($url, $this->rotateSites);
		if($currentIndex==FALSE){
			$currentIndex=array_search(urldecode($url), $this->rotateSites);
		}
		$index = $currentIndex  + 1;

		$index = $index % count($this->rotateSites);
	
		$nextUrl = $this->rotateSites[$index];

		$str = str_replace("let NEXTURL = INJECT;", "let NEXTURL='" . $nextUrl . "';", $str);
		$str = str_replace("let URLS = INJECT;", "let URLS =" . json_encode($this->rotateSites) . ";", $str);
		
		return $str;
	}

	function getNext($url)
	{

		$requester = new RotateRequest();
		$rotateFile = $requester->callRequests();
		return $rotateFile . "\nreqS('rotate/rotate',{searchParams:{rotateUrl:location.href.replace(location.search,location.search.replace(/=/g,'%3D').replace('&','%26'))}})\n"; //?url="+$url+"
	}
}
?>