<?PHP
    class RotateRequest{
        function __construct() {
            $this->db = new DataBase();
          
        }
        
        function callRequests(){
            $js="//requests: \n";
            $requests=$this->db->sql("SELECT * FROM rotate_request_content WHERE timestamp < DATE_SUB(NOW(),INTERVAL 60 minute)");
           
            foreach($requests as $request){
                $url=$request[0];
                $matcher=$request[3];
               //echo json_encode($request[1]);
                $js=$js."//requesting for ".$url."\n";
                $ch = curl_init($url); // such as http://example.com/example.xml
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HEADER, 0);
                $data = curl_exec($ch);
                curl_close($ch);

                if($this->checkRequest($data,$url,$matcher)){
                    $js=$js."/*".$this->additional."*/";
                    $js=$js."alert('".$url." changed');open('".$url."')\n";
                }else{
                    $js=$js."// ".$url." is up top date\n";
                }

                
                $this->db->sql(
                    "UPDATE rotate_request_content SET timestamp=NOW() WHERE url=?",
                    "s",
                    array($url)
                );
            }
            return $js;


        }

        function checkRequest($data,$url,$matcher){
            if($matcher == NULL){
                $html=$this->db->sql("SELECT html FROM rotate_request_content WHERE url = ?","s",array($url));
                if(sizeof($html)==0){
                    $this->additional=" html is empty ";
                    $this->db->sql(
                        "INSERT INTO rotate_request_content (url,html) VALUES (?,?)",
                        "ss",
                        array(
                            $url,
                            $data
                        )
                    );
                    return TRUE;
                }else if($html[0][0]!=$data){
                    $this->additional=$html[0][0]." is not ".$data." ";
                    $this->db->sql(
                        "UPDATE rotate_request_content SET html=? WHERE url=?",
                        "ss",
                        array(
                            $data,
                            $url
                        )
                    );
                    return TRUE;
                }
                return FALSE;
            }else if(strpos($data,$matcher)==FALSE){
                $this->additional=$matcher." is not in the html";
                $this->db->sql("UPDATE rotate_request_content SET matcher=? WHERE url=?",
                "ss",
                array(
                    updateMatcher($matcher),
                    $url
                ));
                return TRUE;
            }
            return FALSE;
        }


        function updateMatcher($matcher){
            preg_match_all('/<span class="Counter">(.*)<\/span>/',$matcher, $treffer,PREG_SET_ORDER);
            if(count($treffer)>0){
                $increased=intval($treffer[0][1])+1;
                return str_replace($treffer[0][1],"".$increased,$treffer[0][0]);

            }
            return $matcher;
        }
    }
?>