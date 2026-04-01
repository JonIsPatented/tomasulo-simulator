import { Card, Flex, Text } from '@radix-ui/themes'
import type { Ref } from 'react'

type SectionProps = {
    title: string
    ref?: Ref<HTMLDivElement>
    children?: React.ReactNode
}

export const Section = ({ title, ref, children }: SectionProps) => {
    return (
        <Card ref={ref}>
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
