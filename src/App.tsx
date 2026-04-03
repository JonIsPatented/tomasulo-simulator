import { MainDiagram } from './components/MainDiagram'

export const App = () => {
    return (
        <main className='flex justify-center min-h-screen items-start pt-6 bg-stone-200'>
            <div className='w-full max-w-6xl'>
                <MainDiagram />
            </div>
        </main>
    )
}
