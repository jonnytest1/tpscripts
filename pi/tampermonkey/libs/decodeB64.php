
<?PHP
    function decode_b64($str){
        $dec=base64_decode($str);
        $chars=str_split($dec);
        $res="";
        foreach($chars as $char){
            $res=$res.unichr(ord($char));
        }
        return $res;
    }
    function unichr($dec) {
        if ($dec < 128) {
          $utf = chr($dec);
        } else if ($dec < 2048) {
          $utf = chr(192 + (($dec - ($dec % 64)) / 64));
          $utf .= chr(128 + ($dec % 64));
        } else {
          $utf = chr(224 + (($dec - ($dec % 4096)) / 4096));
          $utf .= chr(128 + ((($dec % 4096) - ($dec % 64)) / 64));
          $utf .= chr(128 + ($dec % 64));
        }
        return $utf;
    }

?>