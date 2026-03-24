import { Card, Flex, Text } from '@radix-ui/themes'

type SectionProps = {
    title: string
    children?: React.ReactNode
}

export const Section = ({ title, children }: SectionProps) => {
    return (
        <Card>
            <Flex direction="column" gap="3">
                <Text size="2" weight="bold">
                    {title}
                </Text>

                <div className="border-t border-gray-200" />

                {children}
            </Flex>
        </Card>
    )
}
