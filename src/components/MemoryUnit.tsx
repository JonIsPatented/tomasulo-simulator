import { Grid } from '@radix-ui/themes/dist/cjs/index.js'
import { useSimulation } from '../hooks/useSimulation'
import { useCallback, useState } from 'react'
import { IconButton, Text, TextField } from '@radix-ui/themes'
import {
  EnterIcon,
  ThickArrowDownIcon,
  ThickArrowUpIcon,
} from '@radix-ui/react-icons'

export const MemoryUnit = () => {
  const memoryUnit = useSimulation((data) => data.memoryUnit)
  const [startIndex, setStartIndex] = useState(0)
  const visibleAddressCount = 5
  const currentlyVisibleAddresses = Array.from(
    { length: visibleAddressCount },
    (_, i) => i + startIndex
  )
  const [currentAddressFieldText, setCurrentAddressFieldText] =
    useState('')

  const handleAddressJump = useCallback(() => {
    let addressText = currentAddressFieldText.toLowerCase()
    if (addressText.startsWith('0x')) {
      addressText = addressText.substring(2)
    }
    if (addressText.match(/[^\dabcdef]/)) {
      setCurrentAddressFieldText('')
      return
    }
    addressText = '0x' + addressText

    const address = parseInt(addressText)

    const maxAddress =
      parseInt('0xFFFFFFFF') - visibleAddressCount + 1

    const adjustedAddress = Math.max(Math.min(address, maxAddress), 0)

    setStartIndex(adjustedAddress)
    setCurrentAddressFieldText('')
  }, [
    currentAddressFieldText,
    setCurrentAddressFieldText,
    setStartIndex,
  ])
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
        align='right'
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
            {`0x${(4 * address)
              .toString(16)
              .padStart(8, '0')
              .toUpperCase()}`}
          </Text>
          <Text
            key={`memory-value-${i}`}
            weight='medium'
            className='w-full border-b border-gray-100 py-1 text-right whitespace-nowrap'
          >
            {memoryUnit.get(address) ?? 0}
          </Text>
        </>
      ))}
      <Grid
        columns='1fr auto auto'
        className='col-span-2 pt-1'
        align='center'
        gap='2'
      >
        <TextField.Root
          className='w-full'
          placeholder='Jump to Address'
          value={currentAddressFieldText}
          onChange={(e) =>
            setCurrentAddressFieldText(e.currentTarget.value.trim())
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddressJump()
          }}
        >
          <TextField.Slot>
            <IconButton variant='ghost'>
              <EnterIcon onClick={handleAddressJump} />
            </IconButton>
          </TextField.Slot>
        </TextField.Root>
        <IconButton
          variant='ghost'
          onClick={() =>
            setStartIndex((val) =>
              Math.min(
                val + 1,
                parseInt('FFFFFFFF', 16) - visibleAddressCount + 1
              )
            )
          }
        >
          <ThickArrowDownIcon />
        </IconButton>
        <IconButton
          variant='ghost'
          onClick={() => setStartIndex((val) => Math.max(val - 1, 0))}
        >
          <ThickArrowUpIcon />
        </IconButton>
      </Grid>
    </Grid>
  )
}
