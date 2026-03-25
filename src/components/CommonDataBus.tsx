import { Flex } from "@radix-ui/themes"
import { useSimulation } from "../hooks/useSimulation"

export const CommonDataBus = () => {
    const dataBus = useSimulation((data) => data.commonDataBus)
    return (
        <Flex direction="row" gap="2">
            <div>{dataBus.sourceStation ?? '-'}</div>
            <div>{dataBus.value ?? '-'}</div>
            <div>{dataBus.destinationRegister ?? '-'}</div>
        </Flex>
    )
}
