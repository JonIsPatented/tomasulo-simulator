import { Flex } from "@radix-ui/themes";
import { useSimulation } from "../hooks/useSimulation";
export const FuncUnits = () => {
    const [MDF,ASF] = useSimulation((data) => [data.multiplyDivideFunctionUnits,data.addSubtractFunctionUnits])
    return(
        
        <Flex direction="column">
            <Flex direction="row" gap="2">
            <div>{MDF[0].operation}</div>
            <div>{MDF[0].firstArgumentValue}</div>
            <div>{MDF[0].secondArgumentValue}</div>
            <div>{MDF[0].ticksLeft}</div>
            <div>{MDF[0].sourceReservationStation}</div>
        </Flex>
        <Flex direction="row" gap="2">
        <div>{ASF[0].operation}</div>
        <div>{ASF[0].firstArgumentValue}</div>
        <div>{ASF[0].secondArgumentValue}</div>
        <div>{ASF[0].ticksLeft}</div>
        <div>{ASF[0].sourceReservationStation}</div>
        </Flex>
        </Flex>
    )
}