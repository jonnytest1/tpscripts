interface CustomStorage
{
    g:(identifier, standard)=>any;
    s:(identifier, value)=>void;
    p:(identifier, object, standard?)=>void
}
