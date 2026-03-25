import { Button, Dialog, Flex, Heading, Slider, Text } from "@radix-ui/themes"
import { useSimulation } from '../hooks/useSimulation'
import { Simulation } from '../simulation/Simulation'


export const TitleBar = () => {

    const clockRate = useSimulation((data) => data.clockRate)
    const simulation = Simulation.getSimulation()

    return (
        <div className='col-span-12'>
            <Flex justify="between" align="center">
                <Dialog.Root>
                    <Dialog.Trigger>
                        <Button variant='outline' >Settings</Button>
                    </Dialog.Trigger>
                            <Dialog.Content className="DialogContent">
                                <Dialog.Title className="DialogTitle">Settings</Dialog.Title>
                                <Dialog.Description className="DialogDescription">
                                    Change how many clock cycles each instruction takes.
                                </Dialog.Description>
                                <div className='flex items-center gap-2'>Test:
                                    <Slider 
                                        variant='classic'
                                        min={1}
                                        max={10}
                                    />
                                </div>
                            </Dialog.Content>
                </Dialog.Root>

                <Heading size="4">
                    Tomasulo Simulator
                </Heading>

                <Flex gap="2" align="center">
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
            </Flex>
        </div>
    )
}