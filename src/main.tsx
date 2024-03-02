import { StrictMode } from 'react'
import { Provider } from 'react-redux'

import { createRoot } from 'react-dom/client'

import './styles/index.scss'

import { App } from './app'
import { store } from './store/store'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
