// note that dispite my name being the last to edit this componet jon cole was actually the one to write this I'm just removing any refrence to it being collapsible
// this is to comply with the latest email from our end user Daniel Koranek
// this is not actually required to do however it will drive me crazy if it is not done 
import './Container.css'
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface CollapsibleContainerProps {
    title: ReactNode,
    children?: ReactNode,
}

export const Container = ({ title, children }: CollapsibleContainerProps) => {

    
    const [contentHeight, setContentHeight] = useState(0)
    const contentRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight)
        }
    }, [children])

    return (
        <div className='wrapper'>
            <h2 className='header'>
                {title}
            </h2>
            <div
                className={'content'}
                >
                <div
                    ref={contentRef}
                    className='inner'
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
