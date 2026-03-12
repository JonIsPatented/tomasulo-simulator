import type { ReactNode } from 'react'
import './Navbar.css'

interface NavbarProps{
    title: ReactNode,
    children?: ReactNode,
}

export const Navbar = ({title, children}:NavbarProps) => {
    return (
        <div className="NavbarMain"><h2>{title}</h2></div>
    )
}