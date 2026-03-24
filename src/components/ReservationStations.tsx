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
            : (rs.firstArgumentValue !== null && rs.secondArgumentValue !== null)
                ? 'Ready'
                : 'Waiting'

    const color =
        status === 'Waiting' ? 'amber' :
            status === 'Ready' ? 'green' :
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
            <Text
                color={color}
                weight="medium"
                className="border-b border-gray-100 py-1"
            >
                {status}
            </Text>
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
