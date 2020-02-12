<?PHP
include_once(dirname(__FILE__) . '/../database.php');
include_once(dirname(__FILE__) . '/requests.php');
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
			if ($file->getExtension() == "php") {
				continue;
			}
			$name = $file->getFilename();

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
		$index = array_search($url, $this->rotateSites) + 1;

		$index = $index % count($this->rotateSites);
		$nextUrl = $this->rotateSites[$index];

		$rotateFile = "\n//next url = " . $nextUrl . "\n";
		$str = str_replace("let NEXTURL = INJECT;", "let NEXTURL='" . $nextUrl . "';", $str);
		$str = str_replace("let URLS = INJECT;", "let URLS =" . json_encode($this->rotateSites) . ";", $str);
		$str = $str . "\nreqS('rotate/'+encodeURIComponent(location.href.replace(location.search,'')))";

		return $str;
	}

	function getNext($url)
	{

		$requester = new RotateRequest();
		$rotateFile = $requester->callRequests();
		$rotateFile = $rotateFile."\n".$this->checkLogs();
		return $rotateFile . "\nreqS('rotate/rotate',{searchParams:{rotateUrl:location.href.replace(location.search,'')}})\n"; //?url="+$url+"
	}
	

	function checkLogs()
	{
		$logsREsponse="\n//checking new logs\n";
		$affected = $this->db->sql("UPDATE log SET checked = TRUE WHERE checked is NULL OR checked = FALSE");
		$logsREsponse=$logsREsponse."//  ".$affected." new logs\n";
		if($affected > 0 ){
			$logsREsponse=$logsREsponse."open('https://pi4.e6azumuvyiabvs9s.myfritz.net/tm/libs/log/?count=".$affected."');\n";
		}
		return $logsREsponse;
	}

}
?>