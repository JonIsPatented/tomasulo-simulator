import { MainDiagram } from './components/MainDiagram'

export const App = () => {
    return (
        <main className='flex justify-center min-h-screen items-start pt-6'>
            <div className='w-full max-w-8xl'>
                <MainDiagram />
            </div>
        </main>
    )
}
