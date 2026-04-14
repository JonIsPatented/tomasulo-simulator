import { Dialog, Button, Text, Grid, Slider } from '@radix-ui/themes'
import { Simulation } from '../simulation/Simulation'
import { useSimulation } from '../hooks/useSimulation'
import { NumberInput } from './NumberInput'

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
          columns='12'
          align='center'
        >
          <Text className='col-span-3'>Addition:</Text>
          <div className='col-span-8'>
            <Slider
              variant='classic'
              min={1}
              max={60}
              onValueChange={(e) => {
                Simulation.getSimulation().adjustInstructionDurations(
                  (durations) => {
                    durations.addition = e[0]
                    return durations
                  }
                )
              }}
              value={[
                useSimulation(
                  (data) => data.cyclesPerInstruction.addition
                ),
              ]}
              disabled={useSimulation((data) => data.running)}
            />
          </div>
          <NumberInput
            minValue={1}
            maxValue={60}
            value={useSimulation(
              (data) => data.cyclesPerInstruction.addition
            )}
            onChange={(val) => {
              Simulation.getSimulation().adjustInstructionDurations(
                (durations) => {
                  durations.addition = val
                  return { ...durations }
                }
              )
            }}
            disabled={useSimulation((data) => data.running)}
          />
        </Grid>
        <Grid
          columns='12'
          align='center'
        >
          <Text className='col-span-3'>Subtraction:</Text>
          <div className='col-span-8'>
            <Slider
              variant='classic'
              min={1}
              max={60}
              onValueChange={(e) => {
                Simulation.getSimulation().adjustInstructionDurations(
                  (durations) => {
                    durations.subtraction = e[0]
                    return durations
                  }
                )
              }}
              value={[
                useSimulation(
                  (data) => data.cyclesPerInstruction.subtraction
                ),
              ]}
              disabled={useSimulation((data) => data.running)}
            />
          </div>
          <NumberInput
            minValue={1}
            maxValue={60}
            value={useSimulation(
              (data) => data.cyclesPerInstruction.subtraction
            )}
            onChange={(val) => {
              Simulation.getSimulation().adjustInstructionDurations(
                (durations) => {
                  durations.subtraction = val
                  return { ...durations }
                }
              )
            }}
            disabled={useSimulation((data) => data.running)}
          />
        </Grid>
        <Grid
          columns='12'
          align='center'
        >
          <Text className='col-span-3'>Multiplication:</Text>
          <div className='col-span-8'>
            <Slider
              variant='classic'
              min={1}
              max={60}
              onValueChange={(e) => {
                Simulation.getSimulation().adjustInstructionDurations(
                  (durations) => {
                    durations.multiplication = e[0]
                    return durations
                  }
                )
              }}
              value={[
                useSimulation(
                  (data) => data.cyclesPerInstruction.multiplication
                ),
              ]}
              disabled={useSimulation((data) => data.running)}
            />
          </div>
          <NumberInput
            minValue={1}
            maxValue={60}
            value={useSimulation(
              (data) => data.cyclesPerInstruction.multiplication
            )}
            onChange={(val) => {
              Simulation.getSimulation().adjustInstructionDurations(
                (durations) => {
                  durations.multiplication = val
                  return { ...durations }
                }
              )
            }}
            disabled={useSimulation((data) => data.running)}
          />
        </Grid>
        <Grid
          columns='12'
          align='center'
        >
          <Text className='col-span-3'>Division:</Text>
          <div className='col-span-8'>
            <Slider
              variant='classic'
              min={1}
              max={60}
              onValueChange={(e) => {
                Simulation.getSimulation().adjustInstructionDurations(
                  (durations) => {
                    durations.division = e[0]
                    return durations
                  }
                )
              }}
              value={[
                useSimulation(
                  (data) => data.cyclesPerInstruction.division
                ),
              ]}
              disabled={useSimulation((data) => data.running)}
            />
          </div>
          <NumberInput
            minValue={1}
            maxValue={60}
            value={useSimulation(
              (data) => data.cyclesPerInstruction.division
            )}
            onChange={(val) => {
              Simulation.getSimulation().adjustInstructionDurations(
                (durations) => {
                  durations.division = val
                  return { ...durations }
                }
              )
            }}
            disabled={useSimulation((data) => data.running)}
          />
        </Grid>
        <Grid
          columns='12'
          align='center'
        >
          <Text className='col-span-3'>Loading:</Text>
          <div className='col-span-8'>
            <Slider
              variant='classic'
              min={1}
              max={60}
              onValueChange={(e) => {
                Simulation.getSimulation().adjustInstructionDurations(
                  (durations) => {
                    durations.loading = e[0]
                    return durations
                  }
                )
              }}
              value={[
                useSimulation(
                  (data) => data.cyclesPerInstruction.loading
                ),
              ]}
              disabled={useSimulation((data) => data.running)}
            />
          </div>
          <NumberInput
            minValue={1}
            maxValue={60}
            value={useSimulation(
              (data) => data.cyclesPerInstruction.loading
            )}
            onChange={(val) => {
              Simulation.getSimulation().adjustInstructionDurations(
                (durations) => {
                  durations.loading = val
                  return { ...durations }
                }
              )
            }}
            disabled={useSimulation((data) => data.running)}
          />
        </Grid>
        <Grid
          columns='12'
          align='center'
        >
          <Text className='col-span-3'>Storing:</Text>
          <div className='col-span-8'>
            <Slider
              variant='classic'
              min={1}
              max={60}
              onValueChange={(e) => {
                Simulation.getSimulation().adjustInstructionDurations(
                  (durations) => {
                    durations.storing = e[0]
                    return { ...durations }
                  }
                )
              }}
              value={[
                useSimulation(
                  (data) => data.cyclesPerInstruction.storing
                ),
              ]}
              disabled={useSimulation((data) => data.running)}
            />
          </div>
          <NumberInput
            minValue={1}
            maxValue={60}
            value={useSimulation(
              (data) => data.cyclesPerInstruction.storing
            )}
            onChange={(val) => {
              Simulation.getSimulation().adjustInstructionDurations(
                (durations) => {
                  durations.storing = val
                  return { ...durations }
                }
              )
            }}
            disabled={useSimulation((data) => data.running)}
          />
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  )
}
