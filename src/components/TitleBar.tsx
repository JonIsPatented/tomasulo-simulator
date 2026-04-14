import { Button, Flex, Grid, Heading, Text } from '@radix-ui/themes'
import { useSimulation } from '../hooks/useSimulation'
import { Simulation } from '../simulation/Simulation'
import { SettingsMenu } from './SettingsMenu'
import { NumberInput } from './NumberInput'

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
