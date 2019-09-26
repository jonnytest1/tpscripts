<?php

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

            echo $errno." ".$errstr, $errfile, $errline;
        }
    }


    include(dirname(__FILE__) . '/../database.php');
    
    $db = new DataBase("tpscript");

    $results=$db->sql("SELECT * FROM times");

    $now=new DateTime();

    $csv=";Projektzeiten;;;;;;;;;;;;;;;;;;;;;\r\n;Zuletzt aktualisiert am;"
        .$now->format("d.m.Y H:i")
        .";;;;;;;;;;;;;;;;;;;;\r\n;;;;;;;;;;;;;;;;;;;;;;\r\n;Land;--;;;;;;;;;;;;;;;;;;;;\r\n;;;;;;;;;;;;;;;;;;;;;;;Personalnummer*;Datum *;Beginn (HH:MM);Ende (HH:MM);Dauer (HH:MM) *;Servicenummer *;Zeitart;Zuschlag;Aufgabennummer *;Abweichende abrechenbare Dauer (HH:MM);Arbeitsbeschreibung;Interner Kommentar;ObjectNodeSenderTechnicalID;ChangeStateID;UUID;ContextParameterKeyDate;ContextParameterCountryCode;;;;;";

    foreach ($results as $dataset) {

        $jsonData= json_decode($dataset[1],true);
        
        foreach ($jsonData as $json) {
            $startString=$json["start"];
            $endString=$json["end"];
            $timeStart=strtotime($startString);
            $timeEnd=strtotime($endString);
            
            $start=DateTime::createFromFormat("U", $timeStart);
            $categories=explode(",",$json["categories"]);

            $duration=$timeEnd-$timeStart;

            foreach ($categories as $category){
                $PersonalNummer="TODO";
                $Datum=$start->format("Y.m.d");
                $Duration=gmdate("H:i", $duration/sizeof($categories));
                $ServiceNumber="TODO";
                $TimeType="DE1100";
                $TaskId=$category;
                $Beschreibung=$json["subject"];
                $Comment=$Beschreibung;
                $ContextParameterKeyDate=$start->format("Ymd");
    
                $csv=$csv."\r\n;".$PersonalNummer.";".$Datum.";;;".$Duration;
                $csv=$csv.";".$ServiceNumber.";".$TimeType.";;".$TaskId.";;".$Beschreibung.";".$Comment;
                $csv=$csv.";;;;".$ContextParameterKeyDate.";--;;;;;";
            }
        }
    }

    header("Content-Type:Application/Octet-Stream");
    header('Content-Disposition: filename="sap_times.csv"');
    
    echo $csv;
    
 
?>