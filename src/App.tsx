import './App.css'
import { Container } from './components/Container'
// todo: 
export const App = () => {
    return (
        <div className='app-wrapper'>
            <h1>Tomasulo's Algorithm Simulator</h1>
            <div className='body-wrapper'>
                <Container title={<h3>FP Registers</h3>}>
                    <p>TODO: make the componets to represent the floating point Registers</p>
                </Container>
                <Container title={<h3>Instruction Unit</h3>}>
                    <p>don't know if we need to put code in here or if we put code somewhere else</p>
                </Container>
                <Container title={<h3>Address Registers</h3>}>
                    <p>TODO: make componets to represent address Registers</p>
                </Container>
                <Container title={<h3>Reservation Stations</h3>}>
                    <p>TODO: make componets to represent Reservation Stations</p>
                </Container>
                <Container title={<h3>load buffers</h3>}>
                    <p>TODO: make componets to represent load buffers</p>
                </Container>
                <Container title={<h3>store buffers</h3>}>
                    <p>TODO: make componets to represent store buffers</p>
                </Container>
            </div>
        </div>
    )
}
