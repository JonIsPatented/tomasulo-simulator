import { Flex } from "@radix-ui/themes"
import { useSimulation } from "../hooks/useSimulation"

export const InstructionQueue = () => {
    const queueData = useSimulation((data) => data.instructionQueue)
    return (
        <Flex direction="column">
            {queueData.map(instr => {
                return (
                    <Flex direction="row" gap="2">
                        <div>{instr.opcode}</div>
                        <div>f{instr.source1}</div>
                        <div>f{instr.source2}</div>
                        <div>f{instr.destination}</div>
                    </Flex>
                )
            })}
        </Flex>
    )
}
