<?PHP
    include( dirname(__FILE__) . '/perceptron.php');
    Class NeuralNetwork{
        private $inputNodes=array();

        private $outputNodes=array();

        private $hiddenNodes=array();

        private $inputs;

        private $outputs;

        private $hidden;

        function __construct($input,$hidden,$output) {
            $this->hidden=$hidden;
            $this->outputs=$output;
            $this->inputs=$input;

            for($i=0;$i<$this->inputs;$i++){
                $this->inputNodes[$i]=new Perceptron("nnInput".$i,1,"neural_test");
            }
            for($i=0;$i<$this->hidden;$i++){
                $this->hiddenNodes[$i]=new Perceptron("nnHidden".$i,$this->inputs,"neural_test");
            }
            for($i=0;$i<$this->outputs;$i++){
                $this->outputNodes[$i]=new Perceptron("nnOutput".$i,$this->hidden,"neural_test");
            }
        }

        function guess($data){
            $results=Array();
            for($i=0;$i<$this->inputs;$i++){
                $results[$i]=$this->inputNodes[$i]->guess(array($data[$i]));
            }
            $resultsHidden=array();
            for($i=0;$i<$this->hidden;$i++){
                $resultsHidden[$i]=$this->hiddenNodes[$i]->guess($results);
            }
            $output=array();
            for($i=0;$i<$this->outputs;$i++){
                $output[$i]=$this->outputNodes[$i]->guess($resultsHidden);
            }
            return $output;
        }
        function adjust($data,$error){
            $results=Array();
            $resultsHidden=array();
            $output=array();

            for($i=0;$i<$this->inputs;$i++){
                $results[$i]=$this->inputNodes[$i]->guess(array($data[$i]));
            }
            for($i=0;$i<$this->hidden;$i++){
                $resultsHidden[$i]=$this->hiddenNodes[$i]->guess($results);
            }
            for($i=0;$i<$this->outputs;$i++){
                $output[$i]=$this->outputNodes[$i]->guess($resultsHidden);
            }

            
            for($i=0;$i<$this->outputs;$i++){
                $errorWeightsHidden=$this->outputNodes[$i]->adjustNormalized($resultsHidden,$error);
                for($j=0;$j<$this->hidden;$j++){
                    $errorWeightsInput=$this->hiddenNodes[$j]->adjustNormalized($results,$error*$errorWeightsHidden[$j]);
                    for($k=0;$k<$this->inputs;$k++){
                        $this->inputNodes[$k]->adjustNormalized(array($data[$k]),$error* $errorWeightsInput[$k]);
                    }
                }
            }
        }
        function save(){
            for($i=0;$i<$this->inputs;$i++){
                $this->inputNodes[$i]->save();
            }
            for($i=0;$i<$this->hidden;$i++){
                $this->hiddenNodes[$i]->save();
            }
            for($i=0;$i<$this->outputs;$i++){
                $this->outputNodes[$i]->save();
            }
        }
    }
?>