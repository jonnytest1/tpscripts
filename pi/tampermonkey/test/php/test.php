<?PHP
    include(__DIR__."../../../request.php");
    class SuccessfulTest extends Exception{

    }

    class FailedTest extends Exception {

        public $testMessage;
        function __construct($message){
            $this->testMessage=$message;
        }
    }
    class Tests{

        protected static $_instance = null;

        protected $testLog=array();
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
                throw new FailedTest(array(
                    "expected"=>$this->var,
                    "actual"=>$var
                ));
            }
            return;
        }

        function toString(){
            return json_encode($this->cases);
        }
        function testLog($message){
            
            $this->testLog[]=$message;
        }

        function addWithLog($case){
            if($case["success"]!="success"){
                $case["log"]=$this->testLog;
            }
            $this->testLog=array();
            $this->cases[]=$case;
        }
    }
    
    function expect($variable){
        return Tests::getInstance()->expect($variable);
    }
    function xtest($name,$test){
        $queryPAramas=getQueryParams();
		if(array_key_exists("test",$queryPAramas)){
			if($queryPAramas["test"]!=$name){
               return;
            }
        }
        Tests::getInstance()->cases[]=array(
            "name"=>$name,
            "success"=>"skipped"
        );
    }

    function testLog($message){
        Tests::getInstance()->testLog($message);
    }

    function test($name,$test){
        $case=array(
            "name"=>$name,
            "success"=>"success"
        );
        $queryPAramas=getQueryParams();
		if(array_key_exists("test",$queryPAramas)){
			if($queryPAramas["test"]!=$name){
               return;
            }
        }
        
        try{
           $test();
        }catch(SuccessfulTest $e){
           //nada
        }catch(FailedTest $e){
            $case["success"]="failed";
            $case["message"]=$e->testMessage;
        }catch(Error $e){
            $case["success"]="exception";
            $case["message"]=$e->getMessage();
        }
        Tests::getInstance()->addWithLog($case);
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
?>