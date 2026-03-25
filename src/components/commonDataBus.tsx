import { Flex } from "@radix-ui/themes"
import { useSimulation } from "../hooks/useSimulation"

export const CommonDataBus =()  => {
    const CDB = useSimulation ((data) => data.commonDataBus)
    return(
        <Flex direction="row" gap="2">
            <div>{CDB.sourceStation}</div>
            <div>{CDB.value}</div>
            <div>{CDB.destinationRegister}</div>
        </Flex>
    )
}