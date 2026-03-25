import { Flex } from "@radix-ui/themes"
import { useSimulation } from "../hooks/useSimulation"

export const Iqueue = () =>{
    const queData = useSimulation((data) => data.instructionQueue)
    return(
        <Flex direction="column">
            <Flex direction="row" gap="2">
                <div>{queData[0].opcode}</div>
                <div>{queData[0].source1}</div>
                <div>{queData[0].source2}</div>
                <div>{queData[0].destination}</div>
            </Flex>
            <Flex direction="row" gap="2">
                <div>{queData[1].opcode}</div>
                <div>{queData[1].source1}</div>
                <div>{queData[1].source2}</div>
                <div>{queData[1].destination}</div>
            </Flex>
            <Flex direction="row" gap="2">
                <div>{queData[2].opcode}</div>
                <div>{queData[2].source1}</div>
                <div>{queData[2].source2}</div>
                <div>{queData[2].destination}</div>
            </Flex>
            <Flex direction="row" gap="2">
                <div>{queData[3].opcode}</div>
                <div>{queData[3].source1}</div>
                <div>{queData[3].source2}</div>
                <div>{queData[3].destination}</div>
            </Flex>
        </Flex>
    )
}