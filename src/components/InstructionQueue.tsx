import { Flex } from "@radix-ui/themes"
import { useSimulation } from "../hooks/useSimulation"

export const InstructionQueue = () => {
    const queueData = useSimulation((data) => data.instructionQueue)

    return (
        <Flex direction="column" className="max-h-48 overflow-y-auto">
            {queueData.map((instr, i) => {
                // Render a memory instruction if it contains a base register, otherwise render an ALU instruction
                if (instr.type === 'memory') {
                    return (
                        <Flex key={`instr-${i}`} direction="row" gap="2">
                            <div>{instr.opcode}</div>
                            <div>f{instr.register}</div>
                            <div>{instr.offset}(f{instr.baseRegister})</div>
                        </Flex>
                    )
                }

                return (
                    <Flex key={`instr-${i}`} direction="row" gap="2">
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
