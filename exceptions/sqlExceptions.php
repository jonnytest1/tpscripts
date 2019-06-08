<?PHP
    include( dirname(__FILE__) . '/baseException.php');

    class BaseSQLException extends BaseException
    {
        public function __construct($message, $code = 0, Exception $previous = null) {
            if($message instanceof mysqli ){
                $code=$message->errno;
                $message=$message->error;
            }

            parent::__construct($message, $code, $previous);
        }
    }

    class SQLPrepareStamentExcetion extends BaseSQLException
    {
        public function __construct($message, $code = 0, Exception $previous = null) {
            // etwas Code

            // sicherstellen, dass alles korrekt zugewiesen wird
            parent::__construct($message, $code, $previous);
        }
    
        // maßgeschneiderte Stringdarstellung des Objektes
        public function __toString() {
            return __CLASS__.parent::__toString();
        }
    }   
    class InvalidSQLTypeException extends BaseSQLException
    {
        public function __construct($message, $code = 0, Exception $previous = null) {
            // etwas Code

            // sicherstellen, dass alles korrekt zugewiesen wird
            parent::__construct($message, $code, $previous);
        }
    
        // maßgeschneiderte Stringdarstellung des Objektes
        public function __toString() {
            return __CLASS__.parent::__toString();
        }
    }   
?>