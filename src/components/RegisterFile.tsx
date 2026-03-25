import { useSimulation } from '../hooks/useSimulation'
import { Grid, Text, TextField } from '@radix-ui/themes'

export const RegisterFile = () => {
    const registerFile = useSimulation((data) => data.registerFile)

    return (
        <Grid columns="3" gap="2" className="items-center text-sm">

            {/* Header */}
            <Text size="1" weight="bold" color="gray">Register</Text>
            <Text size="1" weight="bold" align="center" color="gray">Value</Text>
            <Text size="1" weight="bold" align="center" color="gray">Tag</Text>

            {/* Registers */}
            {registerFile.map((reg, i) => {
                const isWaiting = reg.alias !== null

                return (
                    <>
                        <Text
                            key={`name-${i}`}
                            weight="medium"
                            color={isWaiting ? 'gray' : undefined}
                            className="whitespace-nowrap border-b border-gray-100 py-1"
                        >
                            R{i}
                        </Text>

                        <TextField.Root
                            key={`val-${i}`}
                            size="1"
                            value={reg.value ?? '-'}
                            readOnly
                            className="text-center"
                        />

                        <Text
                            key={`tag-${i}`}
                            align="center"
                            size="1"
                            color={isWaiting ? 'gray' : undefined}
                            className="whitespace-nowrap border-b border-gray-100 py-1"
                        >
                            {reg.alias !== null ? `RS${reg.alias}` : '-'}
                        </Text>
                    </>
                )
            })}
        </Grid>
    )
}
