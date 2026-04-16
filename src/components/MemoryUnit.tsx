import { Grid } from '@radix-ui/themes/dist/cjs/index.js'
import { useSimulation } from '../hooks/useSimulation'
import { useState } from 'react'
import { Text, TextField } from '@radix-ui/themes'

export const MemoryUnit = () => {
  const memoryUnit = useSimulation((data) => data.memoryUnit)
  const [startIndex] = useState(0)
  const currentlyVisibleAddresses = Array.from(
    { length: 5 },
    (_, i) => i + startIndex
  )
  return (
    <Grid
      columns='2'
      gapX='2'
      className='items-center text-sm'
    >
      {/* Header */}
      <Text
        size='1'
        weight='bold'
        color='gray'
      >
        Address
      </Text>
      <Text
        size='1'
        weight='bold'
        align='center'
        color='gray'
      >
        Value
      </Text>

      {/* Visible Addresses */}
      {currentlyVisibleAddresses.map((address, i) => (
        <>
          <Text
            key={`address-${i}`}
            weight='medium'
            className='border-b border-gray-100 py-1 whitespace-nowrap'
          >
            {`0x${address
              .toString(16)
              .padStart(8, '0')
              .toUpperCase()}`}
          </Text>
          <TextField.Root
            key={`memory-value-${i}`}
            size='1'
            value={memoryUnit.get(address) ?? 0}
            readOnly
            className='text-right'
          />
        </>
      ))}
    </Grid>

    // <Table.Root>
    //   <Table.Header>
    //     <Table.Row>
    //       <Table.ColumnHeaderCell>Address</Table.ColumnHeaderCell>
    //       <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
    //     </Table.Row>
    //   </Table.Header>

    //   <Table.Body>
    //     {currentlyVisibleAddresses.map((address) => (
    //       <Table.Row>
    //         <Table.Cell>{address}</Table.Cell>
    //         <Table.Cell>{memoryUnit.get(address) ?? 0}</Table.Cell>
    //       </Table.Row>
    //     ))}
    //   </Table.Body>
    // </Table.Root>
  )
}
