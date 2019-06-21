<?php
    include( dirname(__FILE__) . '/rotate.php');
    include( dirname(__FILE__) . '/../request.php');
    include( dirname(__FILE__) . '/../fileLoader.php');
    
    $fileLoader=new FileLoader();
    $rotate=new Rotate();

    $queryPAramas=getQueryParams();
    if(!array_key_exists("url",$queryPAramas)){
        echo "missing url param";
        return;
    }

    $requestUrl=getQueryParams()["url"];
    $rotateJs=$fileLoader->preProcessFileName("rotate/rotate");
    $rotateJs=$rotate->injectUrls($rotateJs,str_replace(".js","",$requestUrl));

    echo $rotateJs;

?>