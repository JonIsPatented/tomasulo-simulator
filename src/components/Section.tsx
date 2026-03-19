import { Panel } from 'primereact/panel'

type SectionProps = {
    title: string
    children?: React.ReactNode
}

export const Section = ({ title, children }: SectionProps) => {
    return (
        <Panel header={title} className='w-full shadow-md rounded-lg'>
            <div className='flex flex-col gap-2'>
                {children}
            </div>
        </Panel>
    )
}
