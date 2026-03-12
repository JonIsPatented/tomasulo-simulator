import './App.css'
import { CollapsibleContainer } from './components/CollapsibleContainer'
import { Navbar } from './components/Navbar'

export const App = () => {
    return (
        <div className='app-wrapper'>
            <Navbar title={"Test"}>Test</Navbar>
            <h1>Tomasulo's Algorithm Simulator</h1>
            <CollapsibleContainer title={<h3>Example Container</h3>}>
                <h3>Example of a Container</h3>
                <p>This is an example of a collapsible container.</p>
            </CollapsibleContainer>
        </div>
    )
}
