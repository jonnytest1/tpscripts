

interface TensorflowLoaderSelector{
    (name:string):TensorflowLoader
}

interface TensorflowLoader{


    

    save(details):Promise<any>;

    load():Promise<model>

    new?():Promise<model>
}

