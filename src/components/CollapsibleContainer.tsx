import './CollapsibleContainer.css'
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface CollapsibleContainerProps {
    title: ReactNode,
    children?: ReactNode,
}

export const CollapsibleContainer = ({ title, children }: CollapsibleContainerProps) => {

    const [isOpen, setIsOpen] = useState(true)
    const [contentHeight, setContentHeight] = useState(0)
    const contentRef = useRef<HTMLDivElement>(null)

    const toggleCollapse = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight)
        }
    }, [children])

    return (
        <div className='collapsible-wrapper'>
            <button className='collapse-trigger' onClick={toggleCollapse} aria-expanded={isOpen}>
                {title}
                <span>{isOpen ? 'Close' : 'Open'}</span>
            </button>
            <div
                className={'collapsible-content'}
                aria-hidden={!isOpen}
                style={{ height: isOpen ? `${contentHeight}px` : '0' }}
            >
                <div
                    ref={contentRef}
                    className='collapsible-inner'
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
