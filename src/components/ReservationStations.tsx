import { useSimulation } from '../hooks/useSimulation'
import { type ReservationStationArgument, type ReservationStationData } from '../simulation/Simulation'
import { Flex, Grid, Text } from '@radix-ui/themes'

const RSGroup = ({
    title,
    stations,
    start
}: {
    title: string
    stations: Array<ReservationStationData<number>>,
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
    rs: ReservationStationData<number>
    index: number
}) => {
    const getValue = (argument: number | ReservationStationArgument<number>) => {
        if (typeof argument === 'number') return argument.toString()
        if (argument.isReady)
            return argument.value.toString()
        if (!argument.isReady && argument.waitingFor == 'station')
            return `RS${argument.reservationStationIndex}`
        if (!argument.isReady && argument.waitingFor == 'load')
            return `f${argument.registerIndex}`
        return '-'
    }

    const status =
        rs.isEmpty
            ? 'Free'
            : rs.isExecuting
                ? 'Running'
                : rs.isReady
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
                {rs.isEmpty ? '-' : rs.operation}
            </Text>
            <Text className="border-b border-gray-100 py-1">
                {rs.isEmpty ? '-' : getValue(rs.firstArgument)}
            </Text>
            <Text className="border-b border-gray-100 py-1">
                {rs.isEmpty ? '-' : getValue(rs.secondArgument)}
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
