import { useSimulation } from "../hooks/useSimulation";
import { Flex, Grid, Text } from "@radix-ui/themes";
import type { LoadBufferData, StoreBufferData } from "../simulation/Simulation";

const BGroup = ({
    title,
    buffers,
    start
}: {
    title: string
    buffers: Array<LoadBufferData | StoreBufferData<number>>
    start: number
}) => {
    return (
        <Flex direction="column" gap="2">
            <Text size="2" weight="bold">
                {title}
            </Text>
            <Grid columns="2" gap="2" className="items-center text-sm">
                {/* heading */}
                <Text size="1" weight="bold" color="gray">name</Text>
                <Text size="1" weight="bold" color="gray">value</Text>
                {buffers.map((b, i) => (
                    <BRow key={start + i} b={b} index={start + i} />
                ))}
            </Grid>
        </Flex>
    )
}
const BRow = ({
    b,
    index
}: {
    b: LoadBufferData | StoreBufferData<number>
    index: number
}) => {
    const getDisplayValue = (buffer: LoadBufferData | StoreBufferData<number>) => {
        if (buffer.isEmpty) return '-'

        if (buffer.isReady) {
            if ('isLoading' in buffer) {
                return buffer.isLoading
                    ? `addr=${buffer.address}, t=${buffer.ticksLeft}, loading`
                    : `addr=${buffer.address}, ready`
            }

            return buffer.isStoring
                ? `addr=${buffer.address}, val=${buffer.value}, t=${buffer.ticksLeft}, storing`
                : `addr=${buffer.address}, val=${buffer.value}, ready`
        }

        if ('isLoading' in buffer) {
            const source =
                buffer.waitingFor.source === "loadBuffer"
                    ? `LB${buffer.waitingFor.index}`
                    : `RS${buffer.waitingFor.index}`

            return `wait ${source}, off=${buffer.offset}`
        }

        if (buffer.waitingFor === "address") {
            const source =
                buffer.addressSource.source === "loadBuffer"
                    ? `LB${buffer.addressSource.index}`
                    : `RS${buffer.addressSource.index}`

            return `wait addr ${source}, off=${buffer.offset}, val=${buffer.value}`
        }

        if (buffer.waitingFor === "value") {
            const source =
                buffer.valueSource.source === "loadBuffer"
                    ? `LB${buffer.valueSource.index}`
                    : `RS${buffer.valueSource.index}`

            return `addr=${buffer.address}, wait val ${source}`
        }

        const addressSource =
            buffer.addressSource.source === "loadBuffer"
                ? `LB${buffer.addressSource.index}`
                : `RS${buffer.addressSource.index}`

        const valueSource =
            buffer.valueSource.source === "loadBuffer"
                ? `LB${buffer.valueSource.index}`
                : `RS${buffer.valueSource.index}`

        return `wait both addr=${addressSource}, val=${valueSource}, off=${buffer.offset}`
    }

    return (
        <>
            <Text weight="medium" className="border-b border-gray-100 py-1">
                B{index}
            </Text>
            <Text className="border-b border-gray-100 py-1">
                {getDisplayValue(b)}
            </Text>
        </>
    )
}

export const Buffers = () => {
    const [loadBuffers, storeBuffers] = useSimulation(
        (data) => [data.loadBuffers, data.storeBuffers]
    );
    return (
        <Grid columns="2" gap="4">
            <BGroup title="load" buffers={loadBuffers} start={0} />
            <BGroup title="store" buffers={storeBuffers} start={loadBuffers.length} />
        </Grid>
    )
}
