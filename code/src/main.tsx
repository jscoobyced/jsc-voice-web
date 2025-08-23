import React from 'react'
import ReactDOM from 'react-dom/client'
import Title from './components/title'
import './style.css'

const app = document.getElementById('app')
if (app) {
  const root = ReactDOM.createRoot(app)
  root.render(
    <React.StrictMode>
      <Title title="Hello, World!" />
    </React.StrictMode>,
  )
}
