interface NumberInputProps{
    minValue: number
    maxValue: number
    value: number
    onChange: (value: number) => void
    disabled: boolean
}

export const NumberInput = ({minValue, maxValue, value, onChange, disabled}: NumberInputProps) => {
    return (
        <input
                type="number"
                name="quantity"
                min= {minValue}
                max= {maxValue}
                value={value}
                onChange={(e) => {
                    //I love having to manually sanitize
                    if (e.currentTarget.value == "") {
                        e.currentTarget.value = minValue.toString()
                    }
                    const clamped: number = Math.min(Math.max(parseInt(e.currentTarget.value), minValue), maxValue)
                    e.currentTarget.value = clamped.toString()
                    onChange(clamped)
                }}
                disabled={disabled}
            />
        )
}