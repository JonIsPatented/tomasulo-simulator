import { Card, Flex, Text } from '@radix-ui/themes'
import type { Ref } from 'react'

type SectionProps = {
    title: string
    ref?: Ref<HTMLDivElement>
    children?: React.ReactNode
    maxHeight?: string
}

// made sure the panels don't shrink/grow -- made the UI look a bit messy
export const Section = ({ title, ref, children, maxHeight = 'max-h-48' }: SectionProps) => {
    return (
        <Card ref={ref} className="h-full">
            <Flex direction="column" gap="3" className="h-full">
                <Text size="2" weight="bold" className="shrink-0">
                    {title}
                </Text>

                <div className="border-t border-gray-200 shrink-0" />

                <div className={`overflow-y-auto ${maxHeight}`}>
                    {children}
                </div>
            </Flex>
        </Card>
    )
}