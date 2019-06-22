<?PHP
    include( dirname(__FILE__) . '/../database.php');
    include( dirname(__FILE__) . '/../rotate/requests.php');

    $requests= new RotateRequest();
    
    echo $requests->updateMatcher("<span class=\"Counter\">44</span>");
?>