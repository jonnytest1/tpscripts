<?PHP
    require("./learning/neuralNetwork.php");

    $nn=new NeuralNetwork(2,2,1);
   // echo json_encode( $nn->guess(array(1,2)));
   // $nn->adjust(array(1,2),"true");

    function f($x){
        return $x;
    }
    echo "run<br>";

    $vals=array(
        array(
            "pt"=>array(0,0),
            "res"=>0
        ),
        array(
            "pt"=>array(1,1),
            "res"=>0
        ),
        array(
            "pt"=>array(1,0),
            "res"=>1
        ),
        array(
            "pt"=>array(0,1),
            "res"=>1
        ),
        
    );

    $guesses=0;
    $correct=0;
    for($i=0;$i<100000;$i++){

        $point=$vals[random_int ( 0 , 3)];

        $res=$nn->guess($point["pt"]);

        $error = $point["res"]-$res[0];
        $nn->adjust($point,$error);
        
        
       // echo $point[1]." probabove: ".$res[0]. "y: ".f($point[0])."<br>";
       
    }

    $nn->save();
    echo json_encode( $nn->guess($vals[0]["pt"]));
    echo  json_encode( $nn->guess($vals[1]["pt"]));
    echo  json_encode( $nn->guess($vals[2]["pt"]));
    echo  json_encode( $nn->guess($vals[3]["pt"]));
?>