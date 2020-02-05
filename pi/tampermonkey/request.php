<?PHP
function getQueryParams()
{
    if (array_key_exists("QUERY_STRING", $_SERVER)) {
        $search = $_SERVER["QUERY_STRING"];
        $queryParams = explode("&", $search);
        $query = [];
        foreach ($queryParams as $queryParam) {
            $queryParts = explode("=", $queryParam);
            $query[$queryParts[0]] = $queryParts[1];
        }
        return $query;
    }
    return array();
}
?>