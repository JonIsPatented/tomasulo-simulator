import { Flex } from "@radix-ui/themes"
import { useSimulation } from "../hooks/useSimulation"

export const Iqueue = () => {
    const queData = useSimulation((data) => data.instructionQueue)
    return (
        <Flex direction="column">
            {queData.map(instr => {
                return (
                    <Flex direction="row" gap="2">
                        <div>{instr.opcode}</div>
                        <div>{instr.source1}</div>
                        <div>{instr.source2}</div>
                        <div>{instr.destination}</div>
                    </Flex>
                )
            })}
        </Flex>
    )
}
