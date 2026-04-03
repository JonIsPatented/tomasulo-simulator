import { useSimulation } from '../hooks/useSimulation'
import { type ReservationStationData } from '../simulation/Simulation'
import { Flex, Grid, Text } from '@radix-ui/themes'

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
        <Flex direction="column" gap="2">
            <Text size="2" weight="bold">
                {title}
            </Text>

            <Grid columns="5" gap="2" className="items-center text-sm whitespace-nowrap">

                {/* Header */}
                <Text size="1" weight="bold" color="gray">Name</Text>
                <Text size="1" weight="bold" color="gray">Op</Text>
                <Text size="1" weight="bold" color="gray">Arg 1</Text>
                <Text size="1" weight="bold" color="gray">Arg 2</Text>
                <Text size="1" weight="bold" color="gray">Status</Text>

                {stations.map((rs, i) => (
                    <RSRow key={start + i} rs={rs} index={start + i} />
                ))}
            </Grid>
        </Flex>
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

    const status =
        rs.isEmpty
            ? 'Free'
            : (rs.isExecuting)
                ? 'Running'
                : (rs.firstArgumentValue !== null && rs.secondArgumentValue !== null)
                    ? 'Ready'
                    : 'Waiting'

    const color =
        status === 'Waiting' ? 'amber' :
            status === 'Ready' ? 'green' :
                status === 'Running' ? 'blue' :
                    'gray'

    return (
        <>
            <Text weight="medium" className="border-b border-gray-100 py-1">
                RS{index}
            </Text>
            <Text className="border-b border-gray-100 py-1">
                {rs.operation ?? '-'}
            </Text>
            <Text className="border-b border-gray-100 py-1">
                {getValue(rs.firstArgumentValue, rs.firstArgumentStation)}
            </Text>
            <Text className="border-b border-gray-100 py-1">
                {getValue(rs.secondArgumentValue, rs.secondArgumentStation)}
            </Text>
            <div className="border-b b order-gray-100 py-1">
                    <span className={`
                        inline-flex items-center justify-center
                        px-2 py-0.5 rounded-full text-xs font-medium
                        ${status === 'Waiting' ? 'bg-amber-100 text-amber-700' : ''}
                        ${status === 'Ready' ? 'bg-green-100 text-green-700' : ''}
                        ${status === 'Running' ? 'bg-blue-100 text-blue-700' : ''}
                        ${status === 'Free' ? 'bg-gray-100 text-gray-500' : ''}
                    `}>
                        {status}
                    </span>
            </div>
        </>
    )
}

export const ReservationStations = () => {
    const [reservationStations, adderReservationStationCount] = useSimulation(
        (data) => [data.reservationStations, data.adderReservationStationCount]
    )

    const adders = reservationStations.slice(0, adderReservationStationCount)
    const multipliers = reservationStations.slice(adderReservationStationCount)

    return (
        <Grid columns="2" gap="4">
            <RSGroup title='Add/Sub' stations={adders} start={0} />
            <RSGroup title='Mul/Div' stations={multipliers} start={adderReservationStationCount} />
        </Grid>
    )
}
