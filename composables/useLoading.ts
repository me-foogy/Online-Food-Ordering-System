export const useLoadingScreen = () =>{
    const loading =  useState<boolean>('global:loading', ()=>false);   
    return loading
}