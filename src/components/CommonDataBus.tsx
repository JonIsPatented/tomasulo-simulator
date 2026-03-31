import { Flex } from "@radix-ui/themes"
import { useSimulation } from "../hooks/useSimulation"
import type { Ref } from "react"

export const CommonDataBus = ({ ref }: { ref?: Ref<HTMLDivElement> }) => {
    const dataBus = useSimulation((data) => data.commonDataBus)
    return (
        <div ref={ref} className="w-full">
            <div
                className={`w-full h-3 \
                ${dataBus.value === null ? "bg-gray-600" : "bg-rose-400"} \
                rounded-md mb-2`}
            />
            <Flex direction="row" gap="2" justify="center">
                <div>{dataBus.sourceStation ?? '-'}</div>
                <div>{dataBus.value ?? '-'}</div>
                <div>{dataBus.destinationRegister ?? '-'}</div>
            </Flex>
        </div>
    )
}
