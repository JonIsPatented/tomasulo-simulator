import { Button, Dialog, Flex, Grid, Heading, Slider, Text } from "@radix-ui/themes"
import { useSimulation } from '../hooks/useSimulation'
import { Simulation } from '../simulation/Simulation'
import { NumberInput } from "./NumberInput"


export const TitleBar = () => {

    const clockRate = useSimulation((data) => data.clockRate)
    const simulation = Simulation.getSimulation()

    return (
        <Grid columns="3">
            <Flex justify="start" align="center">
                <Dialog.Root>
                    <Dialog.Trigger>
                        <Button variant='outline' >Settings</Button>
                    </Dialog.Trigger>
                    <Dialog.Content className="DialogContent">
                        <Dialog.Title className="DialogTitle">Settings</Dialog.Title>
                        <Dialog.Description className="DialogDescription">
                            Change how many clock cycles each instruction takes.
                        </Dialog.Description>
                        <Grid columns="12" align="center">
                            <Text className="col-span-3">
                                Addition:
                            </Text>
                            <div className="col-span-8">
                                <Slider
                                    variant='classic'
                                    min={1}
                                    max={60}
                                    onValueChange={(e) => {
                                        simulation.adjustInstructionDurations((durations) => {
                                            durations.addition = e[0]
                                            return durations
                                        })
                                    }}
                                    value={[useSimulation((data) => data.cyclesPerInstruction.addition)]}
                                    disabled={useSimulation((data) => data.running)}
                                />
                            </div>
                            <NumberInput
                                minValue={1}
                                maxValue={60}
                                value={useSimulation((data) => data.cyclesPerInstruction.addition)}
                                onChange={(val) => {simulation.adjustInstructionDurations((durations) => {
                                            durations.addition = val
                                            return {...durations}
                                })}}
                                disabled={useSimulation((data) => data.running)}
                            />
                        </Grid>
                        <Grid columns="12" align="center">
                            <Text className="col-span-3">
                                Subtraction:
                            </Text>
                            <div className="col-span-8">
                                <Slider
                                    variant='classic'
                                    min={1}
                                    max={60}
                                    onValueChange={(e) => {
                                        simulation.adjustInstructionDurations((durations) => {
                                            durations.subtraction = e[0]
                                            return durations
                                        })
                                    }}
                                    value={[useSimulation((data) => data.cyclesPerInstruction.subtraction)]}
                                    disabled={useSimulation((data) => data.running)}
                                />
                            </div>
                            <NumberInput
                                minValue={1}
                                maxValue={60}
                                value={useSimulation((data) => data.cyclesPerInstruction.subtraction)}
                                onChange={(val) => {simulation.adjustInstructionDurations((durations) => {
                                            durations.subtraction = val
                                            return {...durations}
                                })}}
                                disabled={useSimulation((data) => data.running)}
                            />
                        </Grid>
                        <Grid columns="12" align="center">
                            <Text className="col-span-3">
                                Multiplication:
                            </Text>
                            <div className="col-span-8">
                                <Slider
                                    variant='classic'
                                    min={1}
                                    max={60}
                                    onValueChange={(e) => {
                                        simulation.adjustInstructionDurations((durations) => {
                                            durations.multiplication = e[0]
                                            return durations
                                        })
                                    }}
                                    value={[useSimulation((data) => data.cyclesPerInstruction.multiplication)]}
                                    disabled={useSimulation((data) => data.running)}
                                />
                            </div>
                            <NumberInput
                                minValue={1}
                                maxValue={60}
                                value={useSimulation((data) => data.cyclesPerInstruction.multiplication)}
                                onChange={(val) => {simulation.adjustInstructionDurations((durations) => {
                                            durations.multiplication = val
                                            return {...durations}
                                })}}
                                disabled={useSimulation((data) => data.running)}
                            />
                        </Grid>
                        <Grid columns="12" align="center">
                            <Text className="col-span-3">
                                Division:
                            </Text>
                            <div className="col-span-8">
                                <Slider
                                    variant='classic'
                                    min={1}
                                    max={60}
                                    onValueChange={(e) => {
                                        simulation.adjustInstructionDurations((durations) => {
                                            durations.division = e[0]
                                            return durations
                                        })
                                    }}
                                    value={[useSimulation((data) => data.cyclesPerInstruction.division)]}
                                    disabled={useSimulation((data) => data.running)}
                                />
                            </div>
                            <NumberInput
                                minValue={1}
                                maxValue={60}
                                value={useSimulation((data) => data.cyclesPerInstruction.division)}
                                onChange={(val) => {simulation.adjustInstructionDurations((durations) => {
                                            durations.division = val
                                            return {...durations}
                                })}}
                                disabled={useSimulation((data) => data.running)}
                            />
                        </Grid>
                        <Grid columns="12" align="center">
                            <Text className="col-span-3">
                                Loading:
                            </Text>
                            <div className="col-span-8">
                                <Slider
                                    variant='classic'
                                    min={1}
                                    max={60}
                                    onValueChange={(e) => {
                                        simulation.adjustInstructionDurations((durations) => {
                                            durations.loading = e[0]
                                            return durations
                                        })
                                    }}
                                    value={[useSimulation((data) => data.cyclesPerInstruction.loading)]}
                                    disabled={useSimulation((data) => data.running)}
                                />
                            </div>
                            <NumberInput
                                minValue={1}
                                maxValue={60}
                                value={useSimulation((data) => data.cyclesPerInstruction.loading)}
                                onChange={(val) => {simulation.adjustInstructionDurations((durations) => {
                                            durations.loading = val
                                            return {...durations}
                                })}}
                                disabled={useSimulation((data) => data.running)}
                            />
                        </Grid>
                        <Grid columns="12" align="center">
                            <Text className="col-span-3">
                                Storing:
                            </Text>
                            <div className="col-span-8">
                                <Slider
                                    variant='classic'
                                    min={1}
                                    max={60}
                                    onValueChange={(e) => {
                                        simulation.adjustInstructionDurations((durations) => {
                                            durations.storing = e[0]
                                            return {...durations}
                                        })
                                    }}
                                    value={[useSimulation((data) => data.cyclesPerInstruction.storing)]}
                                    disabled={useSimulation((data) => data.running)}
                                />
                            </div>
                            <NumberInput
                                minValue={1}
                                maxValue={60}
                                value={useSimulation((data) => data.cyclesPerInstruction.storing)}
                                onChange={(val) => {simulation.adjustInstructionDurations((durations) => {
                                            durations.storing = val
                                            return {...durations}
                                })}}
                                disabled={useSimulation((data) => data.running)}
                            />
                        </Grid>
                    </Dialog.Content>
                </Dialog.Root>
            </Flex>
            <Flex align="center" justify="center">
                <Heading size="4">
                    Tomasulo Simulator
                </Heading>
            </Flex>
            <Flex gap="2" align="center" justify="end">

                <Button onClick={simulation.step} variant="outline">
                    Step
                </Button>

                <Button onClick={simulation.startClock} variant="outline">
                    Start
                </Button>

                <Button onClick={simulation.stopClock} variant="outline">
                    Stop
                </Button>

                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max="10"
                    defaultValue={clockRate}
                    onChange={(e) => {
                        //I love having to manually sanitize
                        if (e.currentTarget.value == "") {
                            e.currentTarget.value = "1"
                        }
                        const clamped: number = Math.min(Math.max(parseInt(e.currentTarget.value), 1), 10)
                        e.currentTarget.value = clamped.toString()
                        simulation.setClockRate(clamped)
                    }}
                />
                <Text size="2">
                    ticks/sec
                </Text>
            </Flex>
        </Grid>
        
    )
}
