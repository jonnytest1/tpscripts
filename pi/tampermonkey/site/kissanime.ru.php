

<?PHP
    if (strpos($requestUrl,"/Special/AreYouHuman")>-1) {
        $json=$json.";await reqS(\"site/kissanime/areyouhuman\")";//   preProcessFileName("site_kissanime_areyouhuman");
    } else if(strpos($requestUrl,"Anime/")>-1) {
        $json=$json.";await reqS(\"site/kissanime/confirm\")";
        //$json=$json.preProcessFileName("site_kissanime_confirm");
    }
?>

