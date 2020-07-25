<?PHP 
    require_once(dirname(__FILE__) . '/../decodeB64.php');

    $message =json_decode(decode_b64($body),true);

    

?>