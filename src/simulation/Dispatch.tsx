import type { FunctionUnit, ReservationStationData, SimulatorData } from "./Simulation";

export const dispatchStep: (currentState: SimulatorData) => SimulatorData = (currentState: SimulatorData) => {

    const bus = currentState.commonDataBus

    let resStations = currentState.reservationStations
    let regFile = currentState.registerFile

    if (bus.value !== null) {
        if (bus.sourceStation !== null) {
            resStations = resStations.map((station) => {
                const firstFromStation = station.firstArgumentStation === bus.sourceStation
                const secondFromStation = station.secondArgumentStation === bus.sourceStation

                return {
                    ...station,
                    firstArgumentValue: firstFromStation ? bus.value : station.firstArgumentValue,
                    firstArgumentStation: firstFromStation ? null : station.firstArgumentStation,
                    firstArgumentWaitingRegister: firstFromStation ? null : station.firstArgumentWaitingRegister,

                    secondArgumentValue: secondFromStation ? bus.value : station.secondArgumentValue,
                    secondArgumentStation: secondFromStation ? null : station.secondArgumentStation,
                    secondArgumentWaitingRegister: secondFromStation ? null : station.secondArgumentWaitingRegister,
                }
            })
            regFile = regFile.map((register) => {
                if (register.alias === bus.sourceStation) {
                    return {
                        ...register,
                        value: bus.value,
                        alias: null
                    }
                }
                return register
            })
        }
        else if (bus.destinationRegister !== null) {
            resStations = resStations.map((station) => {
                const firstFromRegister = station.firstArgumentWaitingRegister === bus.destinationRegister
                const secondFromRegister = station.secondArgumentWaitingRegister === bus.destinationRegister

                return {
                    ...station,
                    firstArgumentValue: firstFromRegister ? bus.value : station.firstArgumentValue,
                    firstArgumentWaitingRegister: firstFromRegister ? null : station.firstArgumentWaitingRegister,

                    secondArgumentValue: secondFromRegister ? bus.value : station.secondArgumentValue,
                    secondArgumentWaitingRegister: secondFromRegister ? null : station.secondArgumentWaitingRegister
                }
            })
            regFile = regFile.map((register, i) => {
                if (i === bus.destinationRegister) {
                    return {
                        ...register,
                        value: bus.value,
                        alias: null
                    }
                }
                return register
            })
        }
    }

    const isReady = (station: ReservationStationData) =>
        !station.isEmpty &&
        !station.isExecuting &&
        station.firstArgumentValue !== null &&
        station.secondArgumentValue !== null

    const readyStationsByIndex = resStations.map((station, i) => {
        return { station, i }
    }).filter(stationByIndex => isReady(stationByIndex.station))

    const dec = (fu: FunctionUnit) => {
        if (fu.ticksLeft === null) return fu
        if (fu.ticksLeft === 0) return fu
        return {
            ...fu,
            ticksLeft: fu.ticksLeft - 1
        }
    }

    let addSubFuncUnits = currentState.addSubtractFunctionUnits.map(dec)
    let mulDivFuncUnits = currentState.multiplyDivideFunctionUnits.map(dec)

    if (readyStationsByIndex.length === 0) {
        return {
            ...currentState,
            reservationStations: resStations,
            registerFile: regFile,
            addSubtractFunctionUnits: addSubFuncUnits,
            multiplyDivideFunctionUnits: mulDivFuncUnits
        }
    }

    if (addSubFuncUnits[0].isEmpty) {
        const readyAddSubStation = readyStationsByIndex.find(
            stationByIndex => {
                return stationByIndex.i <
                    currentState.adderReservationStationCount
            }
        )
        if (readyAddSubStation) {
            const station = readyAddSubStation.station
            addSubFuncUnits = [
                {
                    operation: station.operation,
                    firstArgumentValue: station.firstArgumentValue,
                    secondArgumentValue: station.secondArgumentValue,
                    sourceReservationStation: readyAddSubStation.i,
                    ticksLeft: 2,
                    isEmpty: false
                }
            ]

            resStations = resStations.map((s, i) => {
                if (i === readyAddSubStation.i) {
                    return {
                        ...s,
                        isExecuting: true
                    }
                }
                return s
            })
        }
    }

    if (mulDivFuncUnits[0].isEmpty) {
        const readyMulDivStation = readyStationsByIndex.find(
            stationByIndex => {
                return stationByIndex.i >=
                    currentState.adderReservationStationCount
            }
        )
        if (readyMulDivStation) {
            const station = readyMulDivStation.station
            mulDivFuncUnits = [
                {
                    operation: station.operation,
                    firstArgumentValue: station.firstArgumentValue,
                    secondArgumentValue: station.secondArgumentValue,
                    sourceReservationStation: readyMulDivStation.i,
                    ticksLeft: station.operation == '*' ? 10 : 40,
                    isEmpty: false
                }
            ]

            resStations = resStations.map((s, i) => {
                if (i === readyMulDivStation.i) {
                    return {
                        ...s,
                        isExecuting: true
                    }
                }
                return s
            })
        }
    }

    return {
        ...currentState,
        reservationStations: resStations,
        registerFile: regFile,
        addSubtractFunctionUnits: addSubFuncUnits,
        multiplyDivideFunctionUnits: mulDivFuncUnits,
    }

}

