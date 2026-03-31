export type Position = {
    x: number,
    y: number,
    width: number
    height: number,
}

interface WiringOverlayProps {
    registerFile?: Position
    functionUnits?: Position
    reservationStations?: Position
    loadStoreBuffers?: Position
    instructionQueue?: Position
    commonDataBus?: Position
}

export const WiringOverlay = ({
    registerFile,
    functionUnits,
    reservationStations,
    loadStoreBuffers,
    instructionQueue,
    commonDataBus,
}: WiringOverlayProps) => {

    const right = (pos: Position) => ({
        x: pos.x + pos.width,
        y: pos.y + pos.height / 2
    })

    const left = (pos: Position) => ({
        x: pos.x,
        y: pos.y + pos.height / 2
    })

    const top = (pos: Position) => ({
        x: pos.x + pos.width / 2,
        y: pos.y
    })

    const bottom = (pos: Position) => ({
        x: pos.x + pos.width / 2,
        y: pos.y + pos.height
    })

    if (!registerFile) return <></>
    if (!functionUnits) return <></>
    if (!reservationStations) return <></>
    if (!loadStoreBuffers) return <></>
    if (!instructionQueue) return <></>
    if (!commonDataBus) return <></>

    return (
        <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="6"
                    markerHeight="6"
                    refX="5"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path
                        d="M 0 0 L 6 3 L 0 6 Z"
                        fill="#888"
                    />
                </marker>
                <marker
                    id="arrowhead-active"
                    markerWidth="6"
                    markerHeight="6"
                    refX="5"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path
                        d="M 0 0 L 6 3 L 0 6 Z"
                        fill="#ff637e"
                    />
                </marker>
            </defs>

            <Wire
                from={left(reservationStations)}
                to={right(registerFile)}
                orthogonalDirection="horizontal"
            />

            <Wire
                from={right(reservationStations)}
                to={left(loadStoreBuffers)}
                orthogonalDirection="horizontal"
            />

            <Wire
                from={bottom(reservationStations)}
                to={top(functionUnits)}
                orthogonalDirection="vertical"
            />

            <Wire
                from={bottom(instructionQueue)}
                to={top(reservationStations)}
                orthogonalDirection="vertical"
            />

            <Wire
                from={bottom(functionUnits)}
                to={top(commonDataBus)}
                orthogonalDirection="vertical"
            />

            <Wire
                from={{
                    ...top(commonDataBus),
                    x: bottom(registerFile).x
                }}
                to={bottom(registerFile)}
                orthogonalDirection="vertical"
            />

            <Wire
                from={{
                    ...top(commonDataBus),
                    x: bottom(loadStoreBuffers).x
                }}
                to={bottom(loadStoreBuffers)}
                orthogonalDirection="vertical"
                active
            />
        </svg>
    )
}

const Wire = ({
    from,
    to,
    orthogonalDirection,
    active = false,
    thickness = 2
}: {
    from: { x: number, y: number }
    to: { x: number, y: number }
    orthogonalDirection?: 'horizontal' | 'vertical'
    active?: boolean
    thickness?: number
}) => {

    if (!orthogonalDirection) {
        return (
            <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={active ? '#ff637e' : '#888'}
                strokeWidth={thickness}
                strokeLinecap="round"
                markerEnd={active ? "url(#arrowhead-active)" : "url(#arrowhead)"}
            />
        )

    }

    let adjustedFrom = from
    let adjustedTo = to

    const deltaX = adjustedTo.x - adjustedFrom.x
    const deltaY = adjustedTo.y - adjustedFrom.y

    switch (orthogonalDirection) {
        case "horizontal":
            adjustedFrom = {
                ...from,
                y: from.y + deltaY / 2
            }
            adjustedTo = {
                ...to,
                y: to.y - deltaY / 2
            }
            break
        case "vertical":
            adjustedFrom = {
                ...from,
                x: from.x + deltaX / 2
            }
            adjustedTo = {
                ...to,
                x: to.x - deltaX / 2
            }
    }

    return (
        <line
            x1={adjustedFrom.x}
            y1={adjustedFrom.y}
            x2={adjustedTo.x}
            y2={adjustedTo.y}
            stroke={active ? '#ff637e' : '#888'}
            strokeWidth={thickness}
            strokeLinecap="round"
            markerEnd={active ? "url(#arrowhead-active)" : "url(#arrowhead)"}
        />
    )
}
