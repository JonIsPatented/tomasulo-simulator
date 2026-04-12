import { Flex, Grid, Text } from '@radix-ui/themes'
import { useSimulation } from '../hooks/useSimulation'
import { type FunctionUnitData } from '../simulation/Simulation'

const FuncUnitGroup = ({
  title,
  units,
  type,
}: {
  title: string
  units: Array<FunctionUnitData<number>>
  type: 'add' | 'mul'
}) => {
  return (
    <Flex direction='column'>
      <Text
        size='2'
        weight='bold'
      >
        {title}
      </Text>
      <Grid
        columns='5'
        gap='2'
        className='items-center text-sm whitespace-nowrap'
      >
        <Text
          size='1'
          weight='bold'
          color='gray'
        >
          Op
        </Text>
        <Text
          size='1'
          weight='bold'
          color='gray'
        >
          Arg1
        </Text>
        <Text
          size='1'
          weight='bold'
          color='gray'
        >
          Arg2
        </Text>
        <Text
          size='1'
          weight='bold'
          color='gray'
          wrap='wrap'
        >
          Ticks Left
        </Text>
        <Text
          size='1'
          weight='bold'
          color='gray'
        >
          Source
        </Text>
        {units.map((i) => (
          <FuncUnitRows
            unit={i}
            type={type}
          />
        ))}
      </Grid>
    </Flex>
  )
}
const FuncUnitRows = ({
  unit,
  type,
}: {
  unit: FunctionUnitData<number>
  type: 'add' | 'mul'
}) => {
  const adderReservationStationCount = useSimulation(
    (data) => data.adderReservationStationCount
  )
  const sourceValue = !unit.isEmpty
    ? `${type}${
        type === 'mul'
          ? unit.sourceStationIndex -
            adderReservationStationCount
          : unit.sourceStationIndex
      }`
    : '-'
  return (
    <>
      <Text className='border-b border-gray-100 py-1'>
        {unit.isEmpty ? '-' : unit.operation}
      </Text>
      <Text className='border-b border-gray-100 py-1'>
        {unit.isEmpty ? '-' : unit.firstArgument}
      </Text>
      <Text className='border-b border-gray-100 py-1'>
        {unit.isEmpty ? '-' : unit.secondArgument}
      </Text>
      <Text className='border-b border-gray-100 py-1'>
        {unit.isEmpty ? '-' : unit.ticksLeft}
      </Text>
      <Text className='border-b border-gray-100 py-1'>
        {sourceValue}
      </Text>
    </>
  )
}
export const FuncUnits = () => {
  const { mulDivFuncUnits, addSubFuncUnits } =
    useSimulation((data) => {
      return {
        mulDivFuncUnits: data.multiplyDivideFunctionUnits,
        addSubFuncUnits: data.addSubtractFunctionUnits,
      }
    })

  return (
    <Grid
      columns='2'
      gap='2'
    >
      <FuncUnitGroup
        title='Add/Subtract'
        units={addSubFuncUnits}
        type='add'
      />
      <FuncUnitGroup
        title='Mul/Dev'
        units={mulDivFuncUnits}
        type='mul'
      />
    </Grid>
  )
}
