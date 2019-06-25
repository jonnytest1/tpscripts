<?PHP

    class SuccessfulTest extends Exception{

    }

    class FailedTest extends Exception {
        function __construct($message){
            $this->message=$message;
        }
    }
    class Tests{

        protected static $_instance = null;

        function __construct() {
            $this->cases=array();
        }

        public static function getInstance()
        {
            if (null === self::$_instance)
            {
                self::$_instance = new self;
            }
            return self::$_instance;
        }

        public static function run($fnc){
            try{
                $fnc();
	        }catch(ErrorException $e){
                self::getInstance()->cases[]=array(
                    "success"=>"error",
                    "message"=>$e->getMessage(),
                    "stack"=>join("\r\n",array_map("StackTraceToString",$e->getTrace()))
                );
            }
            return self::getInstance();

        }

        public function expect($var){
            $this->var=$var;
            return $this;
        }
        function toBe($var){
            if($this->var==null){
                throw "variable is not set";
            }
            if($this->var==$var){
                throw new SuccessfulTest(); 
            }else{
                throw new FailedTest("expected "-$this->var." got ".$var);
            }
            return;
        }

        function toString(){
            return json_encode($this->cases);
        }
    }
    
    function expect($variable){
        return Tests::getInstance()->expect($variable);
    }

    function test($name,$test){
        try{
            $test();
        }catch(SuccessfulTest $e){
            Tests::getInstance()->cases[]=array(
                "name"=>$name,
                "success"=>"success"
            );
        }catch(FailedTest $e){
            Tests::getInstance()->cases[]=array(
                "name"=>$name,
                "success"=>"failed",
                "message"=>$e->message
            );
        }catch(Error $e){
            Tests::getInstance()->cases[]=array(
                "name"=>$name,
                "success"=>"exception",
                "message"=>$e->getMessage()
            );
        }
    }

    register_shutdown_function( "fatal_handler" );

        function fatal_handler() {
            $errfile = "unknown file";
            $errstr  = "shutdown";
            $errno   = E_CORE_ERROR;
            $errline = 0;

            $error = error_get_last();

            if( $error !== NULL) {
                $errno   = $error["type"];
                $errfile = $error["file"];
                $errline = $error["line"];
                $errstr  = $error["message"];

                Tests::getInstance()->cases[]=array(
                    "success"=>"error",
                    "message"=> $errstr,
                    "stack"=>"file: ".$errfile." line: ".$errline
                );
                


            }
}
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------





   
?>