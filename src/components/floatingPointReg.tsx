import { useState, type ReactNode } from "react";
import "./floatingPointReg.css";
interface floatingPointRegProps{
    registerName: ReactNode,
    defaultValue:string,
};
export const floatingPointReg = ({registerName,defaultValue}:floatingPointRegProps) =>{
    const [value,setValue] = useState(defaultValue)
    function handleChange (e:React.ChangeEvent<HTMLInputElement>){
        const intChars : RegExp = /^ [0-9]*\.?[0-9]* $/
        if(!intChars.test(e.target.value)){
            
        }
    }
    return(
    <div>
        <div>{registerName}</div>
        <input type="text" value={value} onChange={handleChange}/>
    </div>
    );
}