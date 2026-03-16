import { useEffect, useState } from "react";
import "./loadBuffer.css";
interface LoadBufferProps{
    LoadBufferAddress:string,
    LoadBufferValue:string,
    IsBusy:boolean
};
export const LoadBuffer = ({LoadBufferAddress,LoadBufferValue,IsBusy}:LoadBufferProps) =>{
    
    const [value,setValue] = useState(LoadBufferValue);
    useEffect(() => {
        setValue(LoadBufferValue);
    }, [LoadBufferValue]);
    function HandleChange (e:React.ChangeEvent<HTMLInputElement>){
        setValue(e.target.value);
    }
    
    return(
        <div className={IsBusy?"busy" : "not"}>
            <div>{LoadBufferAddress}</div>
            <input type="text" value={value} onChange={HandleChange}/>
        </div>
    )
}