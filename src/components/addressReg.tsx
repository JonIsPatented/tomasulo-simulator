import "./addressReg.css"
import React, { useState } from "react"
interface AddressRegProps{
    AddressRegName:string,
    AddressRegValue:string,
}
export const AddressReg = ({AddressRegName,AddressRegValue}:AddressRegProps) =>{
    const [value,setValue] = useState(AddressRegValue);
    function handleChange (e:React.ChangeEvent<HTMLInputElement>){
        const intChars : RegExp = /^[0-9]*$/
         if(!e.target.value){
            setValue("0");
        }else if(intChars.test(e.target.value)){
            setValue(e.target.value);
        }
    
    }
    return(
        <div>
            <div>{AddressRegName}</div>
            <input type="text" value={value} onChange={handleChange}/>
        </div>
    )
}