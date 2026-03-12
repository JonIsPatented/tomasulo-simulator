import type { ReactNode } from 'react'
import './Navbar.css'

interface NavbarProps{
    title: ReactNode,
    children?: ReactNode,
}

export const Navbar = ({title, children}:NavbarProps) => {
    return (
        <div className='NavbarMain'>
            <h3>icon</h3>
            <div></div>
            <h2>{title}</h2>
            <div></div>
            <h3>clock</h3>
        </div>
    )
}