import {
  Dialog,
  Button,
  Text,
  Grid,
  Slider,
  TextArea,
  Flex,
  Card,
  Callout,
} from '@radix-ui/themes'
import {
  Simulation,
  type InstructionDurations,
} from '../simulation/Simulation'
import { useSimulation } from '../hooks/useSimulation'
import { NumberInput } from './NumberInput'
import { useState } from 'react'
import type { AssembleError } from '../simulation/Assemble'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

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
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState<AssembleError | null>(null)
  const hasStarted = useSimulation((data) => data.running)

  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Trigger>
        <Button variant='outline'>Settings</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Settings</Dialog.Title>

        <Grid
          columns={{ xs: '1', md: '2' }}
          gap='2'
        >
          <div>
            <Dialog.Description>
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
                durationNarrower={(durations) =>
                  durations.subtraction
                }
              />
              <DurationControlSlider
                label='Multiplication:'
                toAdjustDurations={(durations, value) => {
                  durations.multiplication = value
                }}
                durationNarrower={(durations) =>
                  durations.multiplication
                }
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
          </div>
          <Flex
            direction='column'
            gap='2'
          >
            <Button
              onClick={() => {
                const result =
                  Simulation.getSimulation().loadProgram(code)
                if (result.ok) {
                  setOpen(false)
                  setError(null)
                  setOpen(false)
                  return
                }
                setError(result.error)
              }}
              disabled={hasStarted}
            >
              Import Code
            </Button>
            <TextArea
              radius='large'
              className='h-40 w-full'
              placeholder='Paste your code here...'
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {error && (
              <Callout.Root>
                <Callout.Icon>
                  <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>
                  {(() => {
                    switch (error.code) {
                      case 'EMPTY_PROGRAM':
                        return `Program input is empty.`
                      case 'INVALID_INSTRUCTION':
                        return `Invalid instruction at line ${error.line}: ${error.text}`
                      case 'INVALID_REGISTER':
                        return `Invalid register index on line ${error.line}: ${error.register} is greater than the maximum ${error.registerFileSize}.`
                    }
                  })()}
                </Callout.Text>
              </Callout.Root>
            )}
          </Flex>
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  )
}
