import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@radix-ui/themes/styles.css'
import { App } from './App.tsx'
import { Theme } from '@radix-ui/themes'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Theme
            accentColor='crimson'
            radius='small'
            style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #f5f7fa 50%, #eef1f5 100%)', minHeight: '100vh'}}
        >
            <App />
        </Theme>
    </StrictMode>,
)
