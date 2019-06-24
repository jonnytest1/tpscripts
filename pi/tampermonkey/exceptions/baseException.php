<?PHP

    class BaseException extends Exception
    {
        public function __construct($message, $code = 0, Exception $previous = null) {
            // etwas Code

            $stack=debug_backtrace();
            $stackStr="";

            foreach($stack as $stackElement){

                $argsArray=$stackElement["args"];
                for($i=0;$i<sizeof($argsArray);$i++){
                    if($argsArray[$i]!=null){
                        if(is_string($argsArray[$i])||is_int($argsArray[$i])||is_float($argsArray[$i])){
                            $prev=$argsArray[$i];
                            $argsArray[$i]=substr($argsArray[$i],0,50);
                            if(strlen($argsArray[$i])<strlen($prev)){
                                $argsArray[$i]= $argsArray[$i]." ...";
                            }
                        }else if(is_array($argsArray[$i])){
                            $argsArray[$i]= json_encode($argsArray[$i]);
                            $argsArray[$i]=substr($argsArray[$i],0,50);
                            if(strlen($argsArray[$i])<strlen($prev)){
                                $argsArray[$i]= $argsArray[$i]." ...";
                            }
                        }else{
                            $argsArray[$i]=get_class($argsArray[$i]).".class";
                        }
                    }
                }
                $args=json_encode($argsArray);
                $args=str_replace('"',"'",$args);
                $args=str_replace(']',"",$args);
                $args=str_replace('[',"",$args);
                
                $stackStr=$stackStr."\t".$stackElement["file"].":".$stackElement["line"].":".$stackElement["function"]."(".$args.")"."\n";
            }
            $this->stackStr=$stackStr;
            // sicherstellen, dass alles korrekt zugewiesen wird
            parent::__construct($message, $code, $previous);
        }

        // maßgeschneiderte Stringdarstellung des Objektes
        public function __toString() {
            return ": [{$this->code}]: {$this->message}\n{$this->stackStr}";
        }
    }   
?>