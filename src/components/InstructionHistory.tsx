import { Grid, Text } from '@radix-ui/themes'
import {
  formatInstruction,
  type Instruction,
} from '../simulation/Simulation'

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
      <InstructionEntry
        instruction={{
          type: 'arithmetic',
          opcode: 'add',
          destination: 1,
          source1: 2,
          source2: 3,
        }}
        start={4}
      />
    </Grid>
  )
}
