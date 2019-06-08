<?PHP
    include( dirname(__FILE__) . '/../database.php');
    Class Perceptron{

        private $db;

        private $weights=array();

        private $weightLength;

        private $tableName;

        function __construct($tableName,$inputs=6241+3,$database="tpscript") {
            $this->weightLength=$inputs+1;
            $this->db = new DataBase($database);
            $this->tableName=$tableName;

            try{
                $weights=$this->db->sql("SELECT * FROM ".$this->tableName);
            }catch(SQLPrepareStamentExcetion $e){
                if($e->getcode()==1146){
                    echo $this->db->sql("CREATE TABLE ".$this->tableName." (
                        `weight_index` INT(11) NOT NULL,
                        `weighting` DOUBLE NOT NULL,
                        PRIMARY KEY (`weight_index`) ) ");
                    $weights=$this->db->sql("SELECT * FROM ".$this->tableName);
                }else{
                    throw $e;
                }
                
            }
          
            
            
            foreach($weights as $weight){
                $this->weights[$weight[0]]=$weight[1];
            }
            //image values 2641
            //3 tags


            if(sizeof($this->weights)<$this->weightLength){
                echo "inserting random".sizeof($this->weights)." ".$this->weightLength;
                $sql="INSERT INTO ".$this->tableName." (weight_index,weighting) VALUES  ";
                $params=[];
                $paramTypes="";
    
                for($i=0;$i<$this->weightLength;$i++){
                    $sql=$sql." (? , RAND()),";
                    $paramTypes=$paramTypes."i";
                    $params[]=$i;
                }
                echo $this->db->sql(rtrim($sql,','),$paramTypes,$params);
            }
        }

        function sigmoid($x){
            return 1/(1+ pow( M_E ,$x*-1));
        }
        function sigmoidDeriv($value){
            return $this->sigmoid($value)+(1-$this->sigmoid($value));
        }
       function guess($data){
            $data[]=1;
            $value=0;

            for($i=0;$i<$this->weightLength;$i++){
                $value=$value+($this->weights[$i]*$data[$i]);
            }
            return $this->sigmoid($value);
       }

       function adjust($data,$correct){
            $data[]=1;
            $sql="UPDATE ".$this->tableName." SET weighting=CASE weight_index";
            $params=[];
            $paramTypes="";

            for($i=0;$i<$this->weightLength;$i++){
                $sql=$sql." WHEN ? THEN weighting + ?";
                $paramTypes=$paramTypes."id";
                $params[]=$i;
                if($correct=="true"){
                    $params[]=(0.01*$data[$i]);
                }else{
                    $params[]=(-0.01*$data[$i]);
                }
                if($i==6){
                //break;
                }
            }
            $sql=$sql." ELSE weighting END ";
            echo $this->db->sql($sql,$paramTypes,$params);
        }

        function adjustNormalized($data,$error){
            $data[]=1;
            $learningFactor=0.1;
            $sumWeights=0;
            $smallest=999999999;
            $errorWeights=array();
            for($i=0;$i<$this->weightLength;$i++){
               $errorWeights[$i]=$this->weights[$i]*$error;


                $dif=   $error *
                        $learningFactor *
                        ($data[$i]*(1-$data[$i]))
                    //  *$this->weights[$i]
                        ;
                $this->weights[$i]=$this->weights[$i]+$dif;

                //normalize
                $sumWeights=$sumWeights+$this->weights[$i];
                if($this->weights[$i]<$smallest){
                    $smallest=$this->weights[$i];
                }
            }
            //shift positive
            if($smallest<0&&false){
                for($i=0;$i<$this->weightLength;$i++){
                    $this->weights[$i]=$this->weights[$i] - $smallest;
                }
            }
            for($i=0;$i<$this->weightLength;$i++){
                if($sumWeights==0){
                    throw new BaseException("sum is 0");
                }

                $this->weights[$i]=$this->weights[$i] / $sumWeights;
            }
            return $errorWeights;
        }

        function save(){

            $sql="UPDATE ".$this->tableName." SET weighting=CASE weight_index";
            $params=[];
            $paramTypes="";

            for($i=0;$i<$this->weightLength;$i++){
                $sql=$sql." WHEN ? THEN ?";
                $paramTypes=$paramTypes."id";
                $params[]=$i;
                $params[]=$this->weights[$i];
                
            }
            $sql=$sql." ELSE weighting END ";
            $this->db->sql($sql,$paramTypes,$params);
        }

    }


?>