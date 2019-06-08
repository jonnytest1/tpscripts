

<?PHP
    if (strpos($requestUrl,"/Special/AreYouHuman")>-1) {
        $json=$json.preProcessFileName("site_kissanime_areyouhuman");
    } else if(strpos($requestUrl,"Anime/")>-1) {
        $json=$json.preProcessFileName("site_kissanime_confirm");
    }
?>

