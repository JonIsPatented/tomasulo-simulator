import { useState, type ReactNode } from "react";
import "./floatingPointReg.css";
interface floatingPointRegProps{
    registerName: ReactNode,
    defaultValue:string,
    IsBusy:boolean
};
export const FloatingPointReg = ({registerName,defaultValue,IsBusy}:floatingPointRegProps) =>{
    const [value,setValue] = useState(defaultValue);
    function handleChange (e:React.ChangeEvent<HTMLInputElement>){
        const intChars : RegExp = /^[0-9]*\.?[0-9]*$/
         if(!e.target.value){
            setValue("0");
        }else if(intChars.test(e.target.value)){
            setValue(e.target.value);
        }
    }
    return(
    <div>
        <div className={IsBusy?"busy" : "not"}>{registerName}</div>
        <input type="text" value={value} onChange={handleChange}/>
    </div>
    );
}