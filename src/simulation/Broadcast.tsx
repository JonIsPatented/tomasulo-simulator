import type { ArithmeticOpcode, SimulatorData } from "./Simulation"

// ⋆.˚⟡ ࣪ ˖ MEMORY IS A LIE ⋆.˚⟡ ࣪ ˖
// for now...

// Computes the result for each type of operation
// Currently does not support load / store
const computeResult = (
    operation: ArithmeticOpcode,
    firstArgumentValue: number,
    secondArgumentValue: number
): number => {
    switch (operation) {
        case 'add':
            return firstArgumentValue + secondArgumentValue
        case 'sub':
            return firstArgumentValue - secondArgumentValue
        case 'mul':
            return firstArgumentValue * secondArgumentValue
        case 'div':
            return secondArgumentValue === 0 ? NaN : firstArgumentValue / secondArgumentValue
    }
}

export const broadcastStep = (currentState: SimulatorData): SimulatorData => {
    const multiplyFunctionUnit = currentState.multiplyDivideFunctionUnits[0]
    const addFunctionUnit = currentState.addSubtractFunctionUnits[0]

    // Checks if the mul / div function unit is done
    if (!multiplyFunctionUnit.isEmpty && multiplyFunctionUnit.ticksLeft === 0) {
        return {
            ...currentState,
            commonDataBus: {
                isActive: true,
                value: computeResult(
                    multiplyFunctionUnit.operation,
                    multiplyFunctionUnit.firstArgument,
                    multiplyFunctionUnit.secondArgument,
                ),
                source: 'operation',
                sourceStation: multiplyFunctionUnit.sourceStationIndex,
            },
            multiplyDivideFunctionUnits: [
                {
                    isEmpty: true
                }
            ],
            transmitFlags: {
                ...currentState.transmitFlags,
                functionUnitsToCommonDataBus: true
            },
        }
    }

    // Checks if the add / sub function unit is done
    if (!addFunctionUnit.isEmpty && addFunctionUnit.ticksLeft === 0) {
        return {
            ...currentState,
            commonDataBus: {
                isActive: true,
                value: computeResult(
                    addFunctionUnit.operation,
                    addFunctionUnit.firstArgument,
                    addFunctionUnit.secondArgument
                ),
                source: 'operation',
                sourceStation: addFunctionUnit.sourceStationIndex,
            },
            addSubtractFunctionUnits: [
                {
                    isEmpty: true
                }
            ],
            transmitFlags: {
                ...currentState.transmitFlags,
                functionUnitsToCommonDataBus: true
            },
        }
    }

    return {
        ...currentState,
        commonDataBus: {
            isActive: false
        }
    }
}
