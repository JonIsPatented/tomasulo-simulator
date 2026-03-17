import { useState, type ReactNode } from 'react'
import { Slider } from 'primereact/slider';
import './Navbar.css'
import { InputNumber, type InputNumberValueChangeEvent } from 'primereact/inputnumber';

        

interface NavbarProps{
    title: ReactNode,
    children?: ReactNode,
}

export const Navbar = ({title, children}:NavbarProps) => {
    const [value, setValue] = useState(1);

    return (
        <div className='NavbarMain'>
            <h3>icon</h3>
            <div className='NavbarSpacer'></div>
            <h2>{title}</h2>
            <div className='NavbarSpacer'></div>
            <div className='Clock'>
                <h4>Time</h4>
                <div className="card flex justify-content-center">
                    <Slider 
                        value={value} 
                        onChange={(e) => setValue(e.value)} 
                        className="w-14rem"
                        min={1}
                        max={10}

                    />
                    <InputNumber 
                        value={value} 
                        onValueChange={(e: InputNumberValueChangeEvent) => setValue(e.value)} 
                        mode="decimal"
                        showButtons
                        min={1}
                        max={10}
                    />
                </div>
            </div>
        </div>
    )
}