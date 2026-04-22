import { Grid, Text } from '@radix-ui/themes'
import {
  formatInstruction,
  type Instruction,
} from '../simulation/Simulation'
import { useSimulation } from '../hooks/useSimulation'

interface InstructionEntryProps {
  instruction: Instruction
  start: number
  done?: number
}

const InstructionEntry = ({
  instruction,
  start,
  done,
}: InstructionEntryProps) => {
  return (
    <>
      <Text
        key={`instr-${start}`}
        size='1'
        weight='medium'
        className='border-b border-gray-100 py-1 whitespace-nowrap'
      >
        {formatInstruction(instruction)}
      </Text>
      <Text
        key={`issued-${start}`}
        size='1'
        weight='medium'
        align='center'
        className='border-b border-gray-100 py-1 whitespace-nowrap'
      >
        {start}
      </Text>
      <Text
        key={`dispatched-${start}`}
        size='1'
        weight='medium'
        align='center'
        className='border-b border-gray-100 py-1 whitespace-nowrap'
      >
        {done ?? '-'}
      </Text>
    </>
  )
}

export const InstructionHistory = () => {
  const history = useSimulation((data) => data.instructionHistory)
  return (
    <Grid
      columns='1fr auto auto'
      gapX='4'
      gapY='2'
      className='items-center text-sm'
    >
      {/* Headers */}
      <Text
        size='1'
        weight='bold'
        color='gray'
      >
        Instruction
      </Text>
      <Text
        size='1'
        weight='bold'
        color='gray'
        align='center'
      >
        Issued On
      </Text>
      <Text
        size='1'
        weight='bold'
        color='gray'
        align='center'
      >
        Completed On
      </Text>

      {/* Instruction Entries */}
      {history.map((entry) => (
        <InstructionEntry
          instruction={entry.instruction}
          start={entry.start}
          done={entry.end}
        />
      ))}
    </Grid>
  )
}
