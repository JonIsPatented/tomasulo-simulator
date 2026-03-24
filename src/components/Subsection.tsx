import { Flex, Text } from '@radix-ui/themes'

type SubsectionProps = {
    title: string
    children?: React.ReactNode
}

export const Subsection = ({ title, children }: SubsectionProps) => {
    return (
        <Flex direction="column" gap="1">
            <Text size="2" weight="medium">
                {title}
            </Text>
            {children}
        </Flex>
    )
}
