import type { SimulatorData } from "./Simulation";

export const dispatchStep = (currentState: SimulatorData) => {

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
            resStation = resStation.map((station) => {
                return {
                    ...station,
                    firstArgumentValue:
                        station.firstArgumentWaitingRegister === bus.destinationRegister ?
                            bus.value : station.firstArgumentValue,
                    secondArgumentValue:
                        station.secondArgumentWaitingRegister === bus.destinationRegister ?
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

    return {
        ...currentState
    }
}

