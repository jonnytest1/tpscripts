<?PHP
    include( dirname(__FILE__) . '/../../learning/perceptron.php');
    $perceptron=new Perceptron("kissanime_weights");

    $data=explode(",",$_POST['data']);
    $confirm=$_POST['confirm'];
    
    echo $perceptron->adjust($data,$confirm);
?>