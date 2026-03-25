import type { SimulatorData } from "./Simulation"

// ⋆.˚⟡ ࣪ ˖ MEMORY IS A LIE ⋆.˚⟡ ࣪ ˖
// for now...

const emptyBus = () => {
    return {
        value: null,
        sourceStation: null,
        destinationRegister: null
    }
}

// Computes the result for each type of operation
// Currently does not support load / store
const computeResult = (
    operation: '+' | '-' | '*' | '/' | null,
    firstArgumentValue: number | null,
    secondArgumentValue: number | null
): number | null => {
    if (
        operation === null ||
        firstArgumentValue === null ||
        secondArgumentValue === null
    ) {
        return null
    }

    switch (operation) {
        case '+':
            return firstArgumentValue + secondArgumentValue
        case '-':
            return firstArgumentValue - secondArgumentValue
        case '*':
            return firstArgumentValue * secondArgumentValue
        case '/':
            return secondArgumentValue === 0 ? NaN : firstArgumentValue / secondArgumentValue
        default:
            return null
    }
}

export const broadcastStep = (currentState: SimulatorData) => {
    const multiplyFunctionUnit = currentState.multiplyDivideFunctionUnits[0]
    const addFunctionUnit = currentState.addSubtractFunctionUnits[0]

    // Checks if the mul / div function unit is done
    if (multiplyFunctionUnit.ticksLeft === 0) {
        return {
            ...currentState,
            commonDataBus: {
                value: computeResult(
                    multiplyFunctionUnit.operation,
                    multiplyFunctionUnit.firstArgumentValue,
                    multiplyFunctionUnit.secondArgumentValue
                ),
                sourceStation: multiplyFunctionUnit.sourceReservationStation,
                destinationRegister: null
            },
            multiplyDivideFunctionUnits: [
                {
                    operation: null,
                    firstArgumentValue: null,
                    secondArgumentValue: null,
                    ticksLeft: null,
                    sourceReservationStation: null,
                    isEmpty: true
                }
            ],
            reservationStations: currentState.reservationStations.map((station, i) => {
                if (i === multiplyFunctionUnit.sourceReservationStation) {
                    return {
                        operation: null,
                        firstArgumentValue: null,
                        firstArgumentStation: null,
                        firstArgumentWaitingRegister: null,
                        secondArgumentValue: null,
                        secondArgumentStation: null,
                        secondArgumentWaitingRegister: null,
                        isEmpty: true,
                        isExecuting: false
                    }
                }
                return station
            })
        }
    }

    // Checks if the add / sub function unit is done
    if (addFunctionUnit.ticksLeft === 0) {
        return {
            ...currentState,
            commonDataBus: {
                value: computeResult(
                    addFunctionUnit.operation,
                    addFunctionUnit.firstArgumentValue,
                    addFunctionUnit.secondArgumentValue
                ),
                sourceStation: addFunctionUnit.sourceReservationStation,
                destinationRegister: null
            },
            addSubtractFunctionUnits: [
                {
                    operation: null,
                    firstArgumentValue: null,
                    secondArgumentValue: null,
                    ticksLeft: null,
                    sourceReservationStation: null,
                    isEmpty: true
                }
            ],
            reservationStations: currentState.reservationStations.map((station, i) => {
                if (i === addFunctionUnit.sourceReservationStation) {
                    return {
                        operation: null,
                        firstArgumentValue: null,
                        firstArgumentStation: null,
                        firstArgumentWaitingRegister: null,
                        secondArgumentValue: null,
                        secondArgumentStation: null,
                        secondArgumentWaitingRegister: null,
                        isEmpty: true
                    }
                }
                return station
            })

        }
    }

    return {
        ...currentState,
        commonDataBus: emptyBus()
    }
}
