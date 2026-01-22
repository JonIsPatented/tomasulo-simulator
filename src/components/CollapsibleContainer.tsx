import './CollapsibleContainer.css'
import { useRef, useState, type ReactNode } from 'react';

interface CollapsibleContainerProps {
    title: ReactNode,
    children?: ReactNode,
}

export const CollapsibleContainer = ({ title, children }: CollapsibleContainerProps) => {

    const [isOpen, setIsOpen] = useState(true)
    const contentRef = useRef(null)

    const toggleCollapse = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className='collapsible-wrapper'>
            <button className='collapse-trigger' onClick={toggleCollapse} aria-expanded={isOpen}>
                {title}
                <span>{isOpen ? 'Close' : 'Open'}</span>
            </button>
            <div
                ref={contentRef}
                className={`collapsible-content ${isOpen ? 'is-open' : ''}`}
                aria-hidden={!isOpen}
            >
                <div className='collapsible-inner'>{children}</div>
            </div>
        </div>
    )
}
