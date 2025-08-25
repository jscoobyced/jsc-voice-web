import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import MyContext, { defaultContext } from './context/AppContext'
import './styles/montserrat.css'
import './styles/style.css'

const app = document.getElementById('app')
if (app) {
  const root = ReactDOM.createRoot(app)
  root.render(
    <React.StrictMode>
      <MyContext.Provider value={defaultContext}>
        <App />
      </MyContext.Provider>
    </React.StrictMode>,
  )
}
