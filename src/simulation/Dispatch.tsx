import type { ReservationStationData, SimulatorData } from "./Simulation";

export const dispatchStep: (currentState: SimulatorData) => SimulatorData = (currentState: SimulatorData) => {

    const bus = currentState.commonDataBus

    let resStations = currentState.reservationStations
    let regFile = currentState.registerFile

    if (bus.value !== null) {
        if (bus.sourceStation !== null) {
            resStations = resStations.map((station) => {
                return {
                    ...station,
                    firstArgumentValue:
                        station.firstArgumentStation === bus.sourceStation ?
                            bus.value : station.firstArgumentValue,
                    secondArgumentValue:
                        station.secondArgumentStation === bus.sourceStation ?
                            bus.value : station.secondArgumentValue,
                }
            })
        }
        else if (bus.destinationRegister !== null) {
            resStations = resStations.map((station) => {
                return {
                    ...station,
                    firstArgumentValue:
                        station.firstArgumentWaitingRegister ===
                            bus.destinationRegister ?
                            bus.value : station.firstArgumentValue,
                    secondArgumentValue:
                        station.secondArgumentWaitingRegister ===
                            bus.destinationRegister ?
                            bus.value : station.secondArgumentValue,
                }
            })
            regFile = regFile.map((register, i) => {
                return {
                    ...register,
                    value:
                        i === bus.destinationRegister ?
                            bus.value : register.value
                }
            })
        }
    }

    const isReady = (station: ReservationStationData) =>
        station.firstArgumentValue !== null &&
        station.secondArgumentValue !== null

    const readyStationsByIndex = resStations.map((station, i) => {
        return { station, i }
    }).filter(stationByIndex => isReady(stationByIndex.station))

    if (readyStationsByIndex.length === 0) {
        return {
            ...currentState,
            reservationStations: resStations,
            registerFile: regFile
        }
    }

    let addSubFuncUnits = currentState.addSubtractFunctionUnits
    let mulDivFuncUnits = currentState.multiplyDivideFunctionUnits

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
            resStations = resStations.map((station, i) => {
                if (i === readyAddSubStation.i)
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
                return { ...station }
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
                    ticksLeft: 2,
                    isEmpty: false
                }
            ]
            resStations = resStations.map((station, i) => {
                if (i === readyMulDivStation.i)
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
                return { ...station }
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

