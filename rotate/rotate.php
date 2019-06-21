<?PHP
	include( dirname(__FILE__) . '/../database.php');
	include( dirname(__FILE__) . '/requests.php');
	class Rotate{

		private $db;

		function __construct() {
			$this->db = new DataBase();
		}

		private $rotateSites=array(
			"https://www.media.mit.edu/projects/alterego/updates/",
			"https://readcomiconline.to/BookmarkList",
			"https://kissanime.ru/BookmarkList",
			"https://kissmanga.com/BookmarkList",
			"https://www.crunchyroll.com/home/queue",
			"https://www1.swatchseries.to/tvschedule",
			"https://novelplanet.com/ReadingList",
			"https://github.com/notifications"
		);

		function isRotate($url){
			return in_array($url,$this->rotateSites);
		}

		function injectUrls($str,$url){
			$index=array_search($url,$this->rotateSites)+1;
			$index=$index%count($this->rotateSites);
			$nextUrl=$this->rotateSites[$index];

			$rotateFile="\n//next url = ".$nextUrl."\n";
			$str=str_replace("let NEXTURL = INJECT;","let NEXTURL='".$nextUrl."';",$str);
			$str=str_replace("let URLS = INJECT;","let URLS =".json_encode($this->rotateSites).";",$str);
			$str=$str."\nreqS('rotate/'+encodeURIComponent(encodeURIComponent(location.href)))";

			return $str;
		}

		function getNext($url){
			
			$requester=new RotateRequest();
			$rotateFile=$requester->callRequests();
			return $rotateFile."\nreqS('rotate/?url='+location.href)";//?url="+$url+"
		}
	}
?>