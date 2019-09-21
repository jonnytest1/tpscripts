<?PHP

include_once(dirname(__FILE__) . '/exceptions/sqlExceptions.php');
class DataBase
{

  public $link;


  function __construct($database, $usr = NULL , $pwd = NULL)
  {

    if ($usr == NULL) {
      $usr = getenv("DB_USER");
    }

    if ($pwd == FALSE) {
      $pwd = getenv("DB_PASSWORD");
    }
    
    if ($usr == FALSE) {
      $usr = "tpscript";
    }
    if ($pwd == FALSE) {
      $pwd = "123";
    }


    $server = getenv("DB_SERVER");
    if ($server == FALSE) {
      $server = "database";
    }
    $port = getenv("DB_PORT");
    if ($port == FALSE) {
      $port = "3306";
    }

    $db = $server . ":" . $port;

    $this->link = mysqli_connect($db,  $usr, $pwd, $database);
    //times_maria_1
  }


  function sql($sql, $paramTypes = "", $params = array())
  {
    if (!is_array($params)) {
      $params = array($params);
    }


    mysqli_report(MYSQLI_REPORT_STRICT);
    $statement = $this->link->prepare($sql);
    if ($statement == FALSE) {
      throw new SQLPrepareStamentExcetion($this->link);
    }
    if (sizeof(explode("?", $sql)) > 1) {
      //types: https://www.php.net/manual/de/mysqli-stmt.bind-param.php
      $statement->bind_param($paramTypes, ...$params);
    }


    $statement->execute();
    if ($this->link->error != NULL) {
      throw new SQLPrepareStamentExcetion($this->link);
    }
    if (substr($sql, 0, 6) == "SELECT") {
      $result = $statement->get_result();
      if ($result == FALSE) {
        echo json_encode($result) . " error " . $this->link->errno;
      }
      $response = array();
      for ($i = 0; $i < $result->num_rows; $i++) {
        $response[] = $result->fetch_array(MYSQLI_NUM);
      }
    } else if (substr($sql, 0, 6) == "INSERT") {
      $response = $statement->insert_id;
    } else if (substr($sql, 0, 6) == "UPDATE") {
      $response = $this->link->affected_rows;
    } else if (substr($sql, 0, 6) == "CREATE") {
      $response = TRUE;
    } else if (substr($sql, 0, 6) == "DELETE") {
      $response = $this->link->affected_rows;
    } else {
      $statement->close();
      throw new InvalidSQLTypeException($this->link);
    }
    $statement->close();




    return $response;
  }
}


?>