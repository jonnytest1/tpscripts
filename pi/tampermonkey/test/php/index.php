
<?php
    include(dirname(__FILE__) . '/test.php');
include( dirname(__FILE__) . '/../../database.php');
    include( dirname(__FILE__) . '/../../rotate/requests.php');

    echo Tests::run(function(){

        test("example",function(){
            expect("test")->toBe("test");
        });
        
        test("rotate increments",function(){
            $requests= new RotateRequest();
            expect("<span class=\"Counter\">45</span>")
                ->toBe($requests->updateMatcher("<span class=\"Counter\">44</span>"));
        });



    })->toString();
?>

