import './App.css'
import { CollapsibleContainer } from './components/CollapsibleContainer'
import { Navbar } from './components/Navbar'

export const App = () => {
    return (
        <div className='app-wrapper'>
            <Navbar title={"Tomasulo's Algorithm Simulator"}>Test</Navbar>
            <CollapsibleContainer title={<h3>Example Container</h3>}>
                <h3>Example of a Container</h3>
                <p>This is an example of a collapsible container.</p>
            </CollapsibleContainer>
        </div>
    )
}
