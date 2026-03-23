type SubSectionProps = {
    title: string
    children?: React.ReactNode
}

export const SubSection = ({ title, children }: SubSectionProps) => {
    return (
        <div className='flex flex-col gap-1'>
            <span className='text-sm font-medium'>
                {title}
            </span>
            {children}
        </div>
    )
}
