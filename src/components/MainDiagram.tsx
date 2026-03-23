import { Section } from './Section'
import { RegisterFile } from './RegisterFile'
import { ReservationStations } from './ReservationStations'
import { useSimulation } from '../hooks/useSimulation'
import { Simulation } from '../simulation/Simulation'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { useRef, useState } from 'react'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Slider, type SliderChangeEvent } from 'primereact/slider'
import { InputNumber, type InputNumberValueChangeEvent } from 'primereact/inputnumber'

export const MainDiagram = () => {


    const [visible, setVisible] = useState(false);
    const op = useRef(null);

    const getClockRateText = () => {
        return clockRate + " ticks/sec"
    }

    const show = () => {
        setVisible(true);
    };


    const clockRate = useSimulation((data) => data.clockRate)

    const simulation = Simulation.getSimulation()

    return (
        <div className='h-full p-4'>
            <div className='grid grid-cols-12 gap-4 auto-rows-fr'>

                {/* Controls */}
                <div className='col-span-12 flex justify-between items-center'>
                    <Button
                        icon="pi pi-cog"
                        onClick={() => show()}
                    />

                    <Dialog header="Instruction Durations" visible={visible} position={'bottom'} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }} resizable={false}>
                        <p className="m-0">
                            [list instructions here]
                        </p>
                    </Dialog>

                    <h2 className='text-xl font-semibold'>
                        Tomasulo Simulator
                    </h2>

                    <div className='flex gap-2 items-center'>
                        <Button
                            label="Start"
                            icon="pi pi-play"
                            onClick={simulation.startClock}
                        />
                        <Button
                            label="Stop"
                            icon="pi pi-stop"
                            severity="danger"
                            onClick={simulation.stopClock}
                        />
                        <Button
                            type="button"
                            icon="pi pi-clock"
                            label={getClockRateText()}
                            onClick={(e) => {
                                op.current!.toggle(e)
                            }}
                        />
                        <OverlayPanel ref={op}>
                            <div
                                className='p-2 grid grid-cols-2 items-center'
                            >
                                <Slider
                                    value={clockRate}
                                    min={1}
                                    max={10}
                                    onChange={(e: SliderChangeEvent) => {
                                        simulation.setClockRate(e.value)
                                    }}
                                />
                                <InputNumber
                                    value={clockRate}
                                    onValueChange={(e: InputNumberValueChangeEvent) => {
                                        simulation.setClockRate(e.value)
                                        console.log(clockRate)
                                    }}
                                    mode="decimal"
                                    showButtons
                                    min={1}
                                    max={10}
                                />
                            </div>
                        </OverlayPanel>
                    </div>
                </div>

                {/* Instruction Queue (placeholder for now) */}
                <div className='col-span-12'>
                    <Section title='Instruction Queue'>
                        <div className='text-sm'>
                            (TODO)
                        </div>
                    </Section>
                </div>

                {/* Register File */}
                <div className='col-span-3'>
                    <Section title='Register File'>
                        <RegisterFile />
                    </Section>
                </div>

                {/* Reservation Stations */}
                <div className='col-span-6'>
                    <Section title='Reservation Stations'>
                        <ReservationStations />
                    </Section>
                </div>

                {/* Load / Store Buffers (placeholder) */}
                <div className='col-span-3'>
                    <Section title='Load / Store Buffers'>
                        <div className='text-sm'>
                            (TODO)
                        </div>
                    </Section>
                </div>

                {/* Functional Units (placeholder) */}
                <div className='col-span-6 col-start-4'>
                    <Section title='Functional Units'>
                        <div className='text-sm'>
                            (TODO)
                        </div>
                    </Section>
                </div>

                {/* Common Data Bus */}
                <div className='col-span-12'>
                    <div className='text-center py-2 font-medium'>
                        Common Data Bus (TODO)
                    </div>
                </div>

            </div>
        </div>
    )
}
