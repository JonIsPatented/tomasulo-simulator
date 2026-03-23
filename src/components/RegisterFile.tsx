import { useSimulation } from '../hooks/useSimulation'

export const RegisterFile = () => {
    const registerFile = useSimulation((data) => data.registerFile)

    return (
        <div className='flex flex-col gap-2'>

            {/* Header */}
            <div className='grid grid-cols-3 text-xs font-semibold opacity-70'>
                <span>Register</span>
                <span className='text-center'>Value</span>
                <span className='text-center'>Tag</span>
            </div>

            {/* Rows */}
            {registerFile.map((reg, i) => {
                const isWaiting = reg.alias !== null

                return (
                    <div
                        key={i}
                        className={`
                            grid grid-cols-3 items-center text-sm
                            py-1 px-2
                            ${isWaiting ? 'opacity-70 italic' : ''}
                        `}
                    >
                        {/* Register name */}
                        <span className='font-medium'>
                            R{i}
                        </span>

                        {/* Value */}
                        <div className='flex justify-center'>
                            <input
                                className='w-20 text-center'
                                value={reg.value ?? '-'}
                                readOnly
                            />
                        </div>

                        {/* Tag (alias) */}
                        <span className='text-center text-xs'>
                            {reg.alias !== null ? `RS${reg.alias}` : '-'}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
