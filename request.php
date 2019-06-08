<?PHP
    function getQueryParams(){

       if(array_key_exists("argv",$_SERVER)){
           if(array_key_exists(0,$_SERVER["argv"])){
                $search=$_SERVER["argv"][0];
                $queryParams=explode("&",$search);
                $query=[];
                foreach($queryParams as $queryParam){
                    $queryParts=explode("=",$queryParam);
                    $query[$queryParts[0]]=$queryParts[1];
                }
                return $query;
            }
       }
       return array();
    }
?>