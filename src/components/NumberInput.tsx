import { useState } from 'react'

interface NumberInputProps {
  minValue: number
  maxValue: number
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export const NumberInput = ({
  minValue,
  maxValue,
  value,
  onChange,
  disabled = false,
}: NumberInputProps) => {
  const [isEmpty, setIsEmpty] = useState(false)

  return (
    <input
      type='number'
      min={minValue}
      max={maxValue}
      value={isEmpty ? '' : value}
      onChange={(e) => {
        if (e.currentTarget.value == '') {
          setIsEmpty(true)
          return
        } else setIsEmpty(false)
        const clamped: number = Math.min(
          Math.max(parseInt(e.currentTarget.value), minValue),
          maxValue
        )
        onChange(clamped)
      }}
      onBlur={() => {
        setIsEmpty(false)
      }}
      disabled={disabled}
    />
  )
}
