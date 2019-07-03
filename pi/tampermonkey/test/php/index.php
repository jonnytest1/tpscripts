<?php

    header("Content-Type: application/json");
    include_once(dirname(__FILE__) . '/test.php');
    include_once( dirname(__FILE__) . '/mock-obj.php');
    include_once( dirname(__FILE__) . '/../../database.php');
    include_once( dirname(__FILE__) . '/../../rotate/requests.php');
    include_once( dirname(__FILE__) . '/../../rotate/rotate.php');

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

    })->toString();
?>

