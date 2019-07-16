

interface TensorflowLoaderSelector{
    (name:string,db?:boolean):TensorflowLoader
}

interface TensorflowLoader{


    

    save(details):Promise<any>;

    load():Promise<model>

    new?():Promise<model>
}

