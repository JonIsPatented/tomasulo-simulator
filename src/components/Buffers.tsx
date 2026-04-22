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
    return (
        <>
            <Text weight="medium" className="border-b border-gray-100 py-1">
                B{index}
            </Text>
            <Text className="border-b border-gray-100 py-1">
                {b.isReady ? b.address : '-'}
            </Text>
        </>)
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
