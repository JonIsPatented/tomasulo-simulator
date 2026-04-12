import type { FunctionUnitData, ReadyStation, ReservationStationData, SimulatorData } from "./Simulation";

export const dispatchStep: (currentState: SimulatorData) => SimulatorData = (currentState: SimulatorData) => {

    const bus = currentState.commonDataBus

    let resStations = currentState.reservationStations
    let regFile = currentState.registerFile
    let transmitFlags = currentState.transmitFlags

    if (bus.isActive) {
        if (bus.source === 'operation') {
            transmitFlags = {
                ...transmitFlags,
                commonDataBusToRegisterFile: true,
            }
            resStations = resStations.map((station, i): ReservationStationData<number> => {

                const firstFromStation =
                    !station.isEmpty &&
                    !station.isReady &&
                    !station.firstArgument.isReady &&
                    station.firstArgument.waitingFor === 'station' &&
                    station.firstArgument.reservationStationIndex === bus.sourceStation

                const secondFromStation =
                    !station.isEmpty &&
                    !station.isReady &&
                    !station.secondArgument.isReady &&
                    station.secondArgument.waitingFor === 'station' &&
                    station.secondArgument.reservationStationIndex === bus.sourceStation

                if (i === bus.sourceStation)
                    return {
                        isEmpty: true,
                        isReady: false,
                        isExecuting: false,
                    }

                if (firstFromStation || secondFromStation)
                    transmitFlags = {
                        ...transmitFlags,
                        commonDataBusToReservationStations: true,
                    }

                return !firstFromStation && !secondFromStation ? {
                    ...station,
                } : firstFromStation && station.secondArgument.isReady ? {
                    isReady: true,
                    isEmpty: false,
                    isExecuting: false,
                    operation: station.operation,
                    firstArgument: bus.value,
                    secondArgument: station.secondArgument.value,
                } : station.firstArgument.isReady ? {
                    isReady: true,
                    isEmpty: false,
                    isExecuting: false,
                    operation: station.operation,
                    firstArgument: station.firstArgument.value,
                    secondArgument: bus.value,
                } : firstFromStation && secondFromStation ? {
                    isReady: true,
                    isEmpty: false,
                    isExecuting: false,
                    operation: station.operation,
                    firstArgument: bus.value,
                    secondArgument: bus.value,
                } : firstFromStation ? {
                    isReady: false,
                    isEmpty: false,
                    isExecuting: false,
                    operation: station.operation,
                    firstArgument: {
                        isReady: true,
                        value: bus.value,
                    },
                    secondArgument: {
                        ...station.secondArgument
                    }
                } : {
                    isReady: false,
                    isEmpty: false,
                    isExecuting: false,
                    operation: station.operation,
                    firstArgument: {
                        ...station.firstArgument
                    },
                    secondArgument: {
                        isReady: true,
                        value: bus.value,
                    },
                }
            })
            regFile = regFile.map((register) => {
                if (!register.hasValue && register.alias === bus.sourceStation) {
                    return {
                        hasValue: true,
                        value: bus.value,
                    }
                }
                return register
            })
        }
        else if (bus.source === 'load') {
            transmitFlags = {
                ...transmitFlags,
                commonDataBusToLoadStoreUnits: true,
                commonDataBusToReservationStations: true,
            }
            resStations = resStations.map((station) => {
                const firstFromRegister =
                    !station.isEmpty &&
                    !station.isReady &&
                    !station.firstArgument.isReady &&
                    station.firstArgument.waitingFor === 'load' &&
                    station.firstArgument.registerIndex === bus.destinationRegister

                const secondFromRegister =
                    !station.isEmpty &&
                    !station.isReady &&
                    !station.secondArgument.isReady &&
                    station.secondArgument.waitingFor === 'load' &&
                    station.secondArgument.registerIndex === bus.destinationRegister

                if (firstFromRegister || secondFromRegister)
                    transmitFlags = {
                        ...transmitFlags,
                        commonDataBusToReservationStations: true,
                    }

                return !firstFromRegister && !secondFromRegister ? {
                    ...station,
                } : firstFromRegister && station.secondArgument.isReady ? {
                    isReady: true,
                    isEmpty: false,
                    isExecuting: false,
                    operation: station.operation,
                    firstArgument: bus.value,
                    secondArgument: station.secondArgument.value,
                } : station.firstArgument.isReady ? {
                    isReady: true,
                    isEmpty: false,
                    isExecuting: false,
                    operation: station.operation,
                    firstArgument: station.firstArgument.value,
                    secondArgument: bus.value,
                } : firstFromRegister && secondFromRegister ? {
                    isReady: true,
                    isEmpty: false,
                    isExecuting: false,
                    operation: station.operation,
                    firstArgument: bus.value,
                    secondArgument: bus.value,
                } : firstFromRegister ? {
                    isReady: false,
                    isEmpty: false,
                    isExecuting: false,
                    operation: station.operation,
                    firstArgument: {
                        isReady: true,
                        value: bus.value,
                    },
                    secondArgument: {
                        ...station.secondArgument
                    }
                } : {
                    isReady: false,
                    isEmpty: false,
                    isExecuting: false,
                    operation: station.operation,
                    firstArgument: {
                        ...station.firstArgument
                    },
                    secondArgument: {
                        isReady: true,
                        value: bus.value,
                    },
                }
            })
            regFile = regFile.map((register, i) => {
                if (bus.source === 'load' && i === bus.destinationRegister) {
                    return {
                        hasValue: true,
                        value: bus.value,
                    }
                }
                return register
            })
        }
    }

    const readyStationsByIndex: Array<{
        station: ReadyStation<number>,
        index: number,
    }> = resStations.map((station, i) => {
        return { station, i }
    }).filter(
        stationByIndex => stationByIndex.station.isReady
    ).map(stationByIndex => {
        return {
            station: stationByIndex.station as ReadyStation<number>,
            index: stationByIndex.i
        }
    })

    const dec = (fu: FunctionUnitData<number>) => {
        if (fu.isEmpty || fu.ticksLeft === 0) return fu
        return {
            ...fu,
            ticksLeft: fu.ticksLeft - 1
        }
    }

    let addSubFuncUnits = currentState.addSubtractFunctionUnits.map(dec)
    let mulDivFuncUnits = currentState.multiplyDivideFunctionUnits.map(dec)
    let functionUnitTransmit = false

    if (readyStationsByIndex.length === 0) {
        return {
            ...currentState,
            reservationStations: resStations,
            registerFile: regFile,
            addSubtractFunctionUnits: addSubFuncUnits,
            multiplyDivideFunctionUnits: mulDivFuncUnits,
            transmitFlags: transmitFlags,
        }
    }

    if (addSubFuncUnits[0].isEmpty) {
        const readyAddSubStation = readyStationsByIndex.find(
            stationByIndex => {
                return stationByIndex.index <
                    currentState.adderReservationStationCount
            }
        )
        if (readyAddSubStation) {
            const station = readyAddSubStation.station
            addSubFuncUnits = [
                {
                    operation: station.operation,
                    firstArgument: station.firstArgument,
                    secondArgument: station.secondArgument,
                    sourceStationIndex: readyAddSubStation.index,
                    ticksLeft: station.operation === 'add' ?
                        currentState.cyclesPerInstruction.addition :
                        currentState.cyclesPerInstruction.subtraction,
                    isEmpty: false
                }
            ]

            resStations = resStations.map((s, i) => {
                if (s.isReady && i === readyAddSubStation.index) {
                    return {
                        ...s,
                        isExecuting: true
                    }
                }
                return s
            })

            functionUnitTransmit = true
        }
    }

    if (mulDivFuncUnits[0].isEmpty) {
        const readyMulDivStation = readyStationsByIndex.find(
            stationByIndex => {
                return stationByIndex.index >=
                    currentState.adderReservationStationCount
            }
        )
        if (readyMulDivStation) {
            const station = readyMulDivStation.station
            mulDivFuncUnits = [
                {
                    operation: station.operation,
                    firstArgument: station.firstArgument,
                    secondArgument: station.secondArgument,
                    sourceStationIndex: readyMulDivStation.index,
                    ticksLeft: station.operation == 'mul' ?
                        currentState.cyclesPerInstruction.multiplication :
                        currentState.cyclesPerInstruction.division,
                    isEmpty: false
                }
            ]

            resStations = resStations.map((s, i) => {
                if (s.isReady && i === readyMulDivStation.index) {
                    return {
                        ...s,
                        isExecuting: true
                    }
                }
                return s
            })

            functionUnitTransmit = true
        }
    }


    return {
        ...currentState,
        reservationStations: resStations,
        registerFile: regFile,
        addSubtractFunctionUnits: addSubFuncUnits,
        multiplyDivideFunctionUnits: mulDivFuncUnits,
        transmitFlags: {
            ...transmitFlags,
            reservationStationsToFunctionUnits: functionUnitTransmit
        },
    }

}

