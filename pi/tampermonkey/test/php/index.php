<?php

    try{
        header("Content-Type: application/json");
        require_once(dirname(__FILE__) . '/test.php');
        require_once( dirname(__FILE__) . '/mock-obj.php');
        //echo "mockim";
        require_once( dirname(__FILE__) . '/../../database.php');
        require_once( dirname(__FILE__) . '/../../rotate/requests.php');
        //echo "req";
        require_once( dirname(__FILE__) . '/../../rotate/rotate.php');
       // echo "rot";
        require_once( dirname(__FILE__) . '/../../libs/log/index.php');

    }catch(ErrorException $e){
        echo "error in inports";
    }

    echo Tests::run(function(){

        test("example",function(){
            expect("test")->toBe("test");
        });

        test("rotate increments",function(){
            $requests= new RotateRequest();
            expect("count(\$data)==45")
                ->toBe($requests->updateMatcher("count(\$data)==44"));
        });

        xtest("rotate matches correctly",function(){

            $dbMock=new MockObj("sql",function ($obj,$arg1){
                if(strpos($arg1,"WHERE timestamp")>-1){
                    return array(array(
                        0=>"https://api.github.com/users/CodingTrain/repos?type=all&n=50",
                        3=>"count(\$data)==44;"
                    ));
                }
                return FALSE;
              
            });
            $requests= new RotateRequest();
            $requests->db=$dbMock;
           
            expect("//requests: \n//requesting for https://api.github.com/users/CodingTrain/repos?type=all&n=50\n// https://api.github.com/users/CodingTrain/repos?type=all&n=50 is up top date\n")
                ->toBe($requests->callRequests());
        });

        test("logging decrypt",function(){
            $b64="eyJhcHBsaWNhdGlvbiI6ImFuZHJvaWQgdGltZXIiLCJTZXZlcml0eSI6IlRJTUVSIiwidGltZXN0YW1wIjoiMjAyMC0wNy0yMlQxNDowNDozNS43ODJaIiwibWVzc2FnZSI6Ii0wNTc0NDU2NyJ9";

            $json=json_decode(decode_b64($b64),true);

            expect($json)->toHaveKey("application");
        });

    })->toString();
?>

