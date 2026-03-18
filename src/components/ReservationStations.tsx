import { useSimulation } from '../hooks/useSimulation'
import { type ReservationStationData } from '../simulation/Simulation'

export const ReservationStations = () => {
    const { reservationStations, adderReservationStationCount } = useSimulation()

    const adders = reservationStations.slice(0, adderReservationStationCount)
    const multipliers = reservationStations.slice(adderReservationStationCount)

    return (
        <div className="grid grid-cols-2 gap-4">
            <RSGroup title="Add/Sub" stations={adders} start={0} />
            <RSGroup title="Mul/Div" stations={multipliers} start={adderReservationStationCount} />
        </div>
    )
}

const RSGroup = ({
    title,
    stations,
    start
}: {
    title: string
    stations: ReservationStationData[],
    start: number
}) => {
    return (
        <div className="flex flex-col gap-2">

            {/* Group title */}
            <span className="font-medium">{title}</span>

            {/* Header row */}
            <div className="grid grid-cols-6 text-xs font-semibold opacity-70 text-center">
                <span>Name</span>
                <span>Op</span>
                <span>Arg 1</span>
                <span>Arg 2</span>
                <span>Status</span>
            </div>

            {/* Station rows */}
            {stations.map((rs, i) => (
                <RSRow key={start + i} rs={rs} index={start + i} />
            ))}
        </div>
    )
}

const RSRow = ({
    rs,
    index
}: {
    rs: ReservationStationData
    index: number
}) => {
    const getValue = (value: number | null, station: number | null) => {
        if (value !== null) return value
        if (station !== null) return `RS${station}`
        return '-'
    }

    // Determine station status for styling
    const status =
        rs.isEmpty
            ? 'Free'
            : (rs.firstArgumentValue !== null && rs.secondArgumentValue !== null)
                ? 'Ready'
                : 'Waiting'

    const isWaiting = status === 'Waiting'

    return (
        <div
            className={`
                grid grid-cols-6 items-center text-sm
                py-1 px-2
                ${isWaiting ? 'opacity-70 italic' : ''}
                border-b border-gray-200
                rounded-sm
            `}
        >
            <span className="font-medium text-center">RS{index}</span>
            <span className="text-center">{rs.operation ?? '-'}</span>
            <span className="text-center">{getValue(rs.firstArgumentValue, rs.firstArgumentStation)}</span>
            <span className="text-center">{getValue(rs.secondArgumentValue, rs.secondArgumentStation)}</span>
            <span className="text-center font-medium">{status}</span>
        </div>
    )
}
