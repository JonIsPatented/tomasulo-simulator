import { Button, Dialog, Flex, Grid, Heading, Slider, Text } from '@radix-ui/themes'
import { useSimulation } from '../hooks/useSimulation'
import { Simulation, type Instruction } from '../simulation/Simulation'
import { SettingsMenu } from './SettingsMenu'
import { NumberInput } from './NumberInput'import { useState } from "react"
import {assembleProgram} from "../simulation/Assemble"

export const TitleBar = () => {
  const clockRate = useSimulation((data) => data.clockRate)

  return (
    <Grid columns='3'>
      <Flex
        justify='start'
        align='center'
      >
        <SettingsMenu />
      </Flex>
      <Flex
        align='center'
        justify='center'
      >
        <Heading size='4'>Tomasulo Simulator</Heading>
      </Flex>
      <Flex
        gap='2'
        align='center'
        justify='end'
      >
        <Button
          onClick={Simulation.getSimulation().step}
          variant='outline'
        >
          Step
        </Button>
    const [code,setcode]= useState("");
    const clockRate = useSimulation((data) => data.clockRate)
    const simulation = Simulation.getSimulation()
    const RegFileSize = useSimulation((data)=> data.registerFile.length);
    
    function assemble(){
        const codeString:string = code;
        
        const ParsedInstructions = assembleProgram(codeString,RegFileSize);
       if(ParsedInstructions.ok){
        

        for(let i = 0; i< ParsedInstructions.value.length;i++){
           console.log(ParsedInstructions.value[i]);
        }
      
       }else{
        console.log(ParsedInstructions.error);
       }
}
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
                        <div className='flex items-center gap-2'>Test:
                            <Slider
                                variant='classic'
                                min={1}
                                max={10}
                            />
                            <div className="flex flex-col gap-2">
                                <Button onClick={() => assemble()}>import code</Button>
                            <label>Import Code:</label>
                            <textarea className="w-full h-40 border rounded p-2" 
                            placeholder="Paste your code here..." 
                            value={code} onChange={(input)=>setcode(input.target.value)}/>
                            </div>
                        </div>
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

        <Button
          onClick={Simulation.getSimulation().startClock}
          variant='outline'
        >
          Start
        </Button>

        <Button
          onClick={Simulation.getSimulation().stopClock}
          variant='outline'
        >
          Stop
        </Button>

        <NumberInput
          minValue={1}
          maxValue={10}
          value={clockRate}
          onChange={Simulation.getSimulation().setClockRate}
        />
        <Text size='2'>ticks/sec</Text>
      </Flex>
    </Grid>
  )
}
