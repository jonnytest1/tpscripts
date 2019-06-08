<?PHP
	require("database.php");
	include( dirname(__FILE__) . '/request.php');
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
			"https://novelplanet.com/ReadingList"
		);

		function isRotate($url){
			return in_array($url,$this->rotateSites);
		}

		function getNext($url){
			
			
			$index=array_search($url,$this->rotateSites)+1;
			$index=$index%count($this->rotateSites);
			$nextUrl=$this->rotateSites[$index];

			$rotateFile="\n//next url = ".$nextUrl."\n";
			
			$requester=new RotateRequest();
			$rotateFile=$rotateFile.$requester->callRequests();

			$rotateFile=$rotateFile.preProcessFileName("rotate/rotate");

			$rotateFile=str_replace("let NEXTURL = INJECT;","let NEXTURL='".$nextUrl."';",$rotateFile);
			$rotateFile=str_replace("let LENGTH = INJECT;","let LENGTH='".sizeof($this->rotateSites)."';",$rotateFile);
			$rotateFile=str_replace("let URLS = INJECT;","let URLS =".json_encode($this->rotateSites).";",$rotateFile);
			$rotateFile=$rotateFile.preProcessFileName("rotate/".urlencode($url));

			return $rotateFile;
		}
	}
?>