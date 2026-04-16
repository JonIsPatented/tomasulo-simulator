import { Dialog, Button, Text, Grid, Slider } from '@radix-ui/themes'
import {
  Simulation,
  type InstructionDurations,
} from '../simulation/Simulation'
import { useSimulation } from '../hooks/useSimulation'
import { NumberInput } from './NumberInput'

interface DurationControlSliderProps {
  label: string
  toAdjustDurations: (
    durations: InstructionDurations,
    value: number
  ) => void
  durationNarrower: (durations: InstructionDurations) => number
}

const DurationControlSlider = ({
  label,
  toAdjustDurations,
  durationNarrower,
}: DurationControlSliderProps) => {
  const duration = useSimulation((data) =>
    durationNarrower(data.cyclesPerInstruction)
  )
  const isRunning = useSimulation((data) => data.running)

  return (
    <>
      <Text>{label}</Text>
      <Slider
        variant='classic'
        min={1}
        max={60}
        onValueChange={(e) => {
          Simulation.getSimulation().adjustInstructionDurations(
            (durations) => {
              toAdjustDurations(durations, e[0])
              return { ...durations }
            }
          )
        }}
        value={[duration]}
        disabled={isRunning}
      />
      <NumberInput
        minValue={1}
        maxValue={60}
        value={duration}
        onChange={(val) => {
          Simulation.getSimulation().adjustInstructionDurations(
            (durations) => {
              toAdjustDurations(durations, val)
              return { ...durations }
            }
          )
        }}
        disabled={isRunning}
      />
    </>
  )
}

export const SettingsMenu = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant='outline'>Settings</Button>
      </Dialog.Trigger>
      <Dialog.Content className='DialogContent'>
        <Dialog.Title className='DialogTitle'>Settings</Dialog.Title>
        <Dialog.Description className='DialogDescription'>
          Change how many clock cycles each instruction takes.
        </Dialog.Description>

        <Grid
          columns='auto 1fr auto'
          align='center'
          gapX='4'
        >
          <DurationControlSlider
            label='Addition:'
            toAdjustDurations={(durations, value) => {
              durations.addition = value
            }}
            durationNarrower={(durations) => durations.addition}
          />
          <DurationControlSlider
            label='Subtraction:'
            toAdjustDurations={(durations, value) => {
              durations.subtraction = value
            }}
            durationNarrower={(durations) => durations.subtraction}
          />
          <DurationControlSlider
            label='Multiplication:'
            toAdjustDurations={(durations, value) => {
              durations.multiplication = value
            }}
            durationNarrower={(durations) => durations.multiplication}
          />
          <DurationControlSlider
            label='Division:'
            toAdjustDurations={(durations, value) => {
              durations.division = value
            }}
            durationNarrower={(durations) => durations.division}
          />
          <DurationControlSlider
            label='Loading:'
            toAdjustDurations={(durations, value) => {
              durations.loading = value
            }}
            durationNarrower={(durations) => durations.loading}
          />
          <DurationControlSlider
            label='Storing:'
            toAdjustDurations={(durations, value) => {
              durations.storing = value
            }}
            durationNarrower={(durations) => durations.division}
          />
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  )
}
