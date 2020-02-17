<?PHP


include(__DIR__."/libs/log/logging.php");
include(__DIR__ . "/request.php");

//echo "//requstesting for ".$url."\n";

$qParams = getQueryParams();
$url = $qParams["url"];
$url = urldecode($url);


$authCode=null;
foreach (getallheaders() as $name => $value) {
    if($name == "secKey"){
        $authCode=$value;
        break;
    }
}
if($authCode == null) {
    if (!array_key_exists("auth", $qParams)) {
        echo "missing authentication";
        return;
    }
    $authCode=$qParams["auth"];
}

$permissionFile=file_get_contents(dirname(__FILE__)."/perm.json");
$permissionObject=json_decode($permissionFile,True);
if(!array_key_exists($authCode,$permissionObject)){
    echo "unauthorized key: " . $authCode;
    return;
}	
$permsissions=$permissionObject[$authCode];

$url = $url . ".js";

try {

    $authorized=False;
    if(!array_key_exists(0,$permsissions)){
        log_be("INFO","unauthorized site request");
        echo "//-------------------- unauthorized site : ".$url." no perms for key set -----------------------\n";
        return;
    }
    if($permsissions[0] == "*"){
        $authorized=True;
    }
    if(!$authorized){
        foreach($permsissions as $fileNamePermission){
            if($fileNamePermission == $url){
                $authorized=True;
            }
        }
    }
    if(!$authorized){
        echo "//-------------------- unauthorized site : ".$url."  current perms ".json_encode($permsissions)." -----------------------\n";
        log_be("INFO","unauthorized site request");
        return;
    }
    $url = dirname(__FILE__) ."/". $url;
    if (file_exists($url)) {
        $str = file_get_contents($url);
    } else {
        $url = str_replace("%25", "%", $url);
        $str = file_get_contents($url);
    }
    if (strpos($url, "rotate/rotate") > -1) {
        include(dirname(__FILE__) . '/rotate/rotate.php');
        include(dirname(__FILE__) . '/fileLoader.php');

        $fileLoader = new FileLoader();
        $rotate = new Rotate();

        $queryPAramas = $qParams;
        if (!array_key_exists("rotateUrl", $queryPAramas)) {
            echo "missing rotateUrl param";
            return;
        }
        $requestUrl = $qParams["rotateUrl"];
        $requestUrl=urldecode($requestUrl);
        $str = $fileLoader->preProcessFileName("rotate/rotate");
        $str = $rotate->injectUrls($str, str_replace(".js", "", $requestUrl));
    }
    if (strpos($str, "EvalScript") > -1) {
        //$str=parseLibs($str,$url);
    }
    echo $str;
} catch (ErrorException $e) {
    log_be("ERROR",$e->getMessage());
    echo "alert('failed getting file')";
}

function parseLibs($str, $url)
{
    preg_match_all('/<reference path="(.*)"(.*)\/>/', $str, $treffer, PREG_SET_ORDER);
    $libraries = array();
    foreach ((array) $treffer as $value) {
        if (strpos($value[1], ".d.ts") > -1 || strpos($value[1], "eval-script") > -1) {
            continue;
        }
        $pathParams = explode("/", $url);
        array_pop($pathParams);
        $importParams = explode("/", $value[1]);
        while ($importParams[0] == "..") {
            array_shift($importParams);
            array_pop($pathParams);
        }
        $import = implode("/", $pathParams) . "/" . implode("/", $importParams);
        $import = preg_replace("/\//", "", $import, 1);
        $libraries[] = str_replace(".js", "", $import);
    }
    $newStr = "";
    $lines = explode("\n", $str);
    foreach ($lines as $index => $line) {
        if (strpos($line, "new EvalScript") > -1 && strpos($line, ")") == FALSE && strpos($line, "finish") == FALSE) {
            $newStr = $newStr . $line . "\n    libraries:" . json_encode($libraries) . ",";
        } else {
            $newStr = $newStr . $line;
        }
        if ($index < count($lines)) {
            $newStr = $newStr . "\n";
        }
    }
    echo $newStr;
}
?>