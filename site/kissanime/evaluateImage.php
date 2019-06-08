<?PHP
    include( dirname(__FILE__) . '/../../learning/perceptron.php');
  
    $perceptron=new Perceptron("kissanime_weights");
  
    $data=explode(",",$_POST['data']);
    
    echo $perceptron->guess($data);
?>