import type { SimulatorData } from "./Simulation";

export const dispatchStep = (currentState: SimulatorData) => {

    const bus = currentState.commonDataBus

    return {
        ...currentState
    }
}

