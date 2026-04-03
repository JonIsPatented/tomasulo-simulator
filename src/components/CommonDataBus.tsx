import { Flex } from "@radix-ui/themes"
import { useSimulation } from "../hooks/useSimulation"
import { type DataBus } from "../simulation/Simulation"
import type { Ref } from "react"

const DataBusLabel = ({ dataBus }: { dataBus: DataBus<number> }) => {
    const adderReservationStationCount = useSimulation(
        data => data.adderReservationStationCount
    )


    if (!dataBus.isActive) {
        return (
            <div>- - -</div>
        )
    }
    if (dataBus.source === 'load') {
        return (
            <div>`f${dataBus.destinationRegister} = ${dataBus.value}`</div>
        )
    }

    const isFromAdder = dataBus.sourceStation < adderReservationStationCount

    return (
        <div>
            {`${isFromAdder ? 'add' : 'mul'}${dataBus.sourceStation} = ${dataBus.value}`}
        </div>
    )
}

export const CommonDataBus = ({ ref }: { ref?: Ref<HTMLDivElement> }) => {
    const dataBus = useSimulation((data) => data.commonDataBus)
    return (
        <div ref={ref} className="w-full">
            <div
                className={`w-full h-3 \
                ${dataBus.isActive ? "bg-rose-400" : "bg-gray-600"} \
                rounded-md mb-2`}
            />
            <Flex direction="row" gap="2" justify="center">
                <DataBusLabel dataBus={dataBus} />
            </Flex>
        </div>
    )
}
