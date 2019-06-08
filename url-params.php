function getQueryParams(){
	   $search=$_SERVER["argv"][0];
	   $queryParams=explode("&",$search);
	   $query=[];
	   foreach($queryParams as $queryParam){
		   $queryParts=explode("=",$queryParam);
		   $query[$queryParts[0]]=$queryParts[1];
	   }
	   return $query;
}
echo json_encode(getQueryParams());