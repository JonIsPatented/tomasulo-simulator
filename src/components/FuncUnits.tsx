import { Flex } from "@radix-ui/themes";
import { type FunctionUnitData } from "../simulation/Simulation";
import { useSimulation } from "../hooks/useSimulation";

const FunctionUnit = ({ functionUnit }: { functionUnit: FunctionUnitData<number> }) => {
    if (functionUnit.isEmpty) return
    return (
        <>
            <div>{functionUnit.operation}</div>
            <div>{functionUnit.firstArgument}</div>
            <div>{functionUnit.secondArgument}</div>
            <div>{functionUnit.ticksLeft}</div>
            <div>{functionUnit.sourceStationIndex}</div>
        </>
    )
}

export const FuncUnits = () => {
    const {
        mulDivFuncUnits,
        addSubFuncUnits,
    } = useSimulation((data) => {
        return {
            mulDivFuncUnits: data.multiplyDivideFunctionUnits,
            addSubFuncUnits: data.addSubtractFunctionUnits,
        }
    })

    return (
        <Flex direction="column">
            <Flex direction="row" gap="2">
                <FunctionUnit functionUnit={mulDivFuncUnits[0]} />
            </Flex>
            <Flex direction="row" gap="2">
                <FunctionUnit functionUnit={addSubFuncUnits[0]} />
            </Flex>
        </Flex>
    )
}
