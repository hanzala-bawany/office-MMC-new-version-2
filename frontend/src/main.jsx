import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import { persistor, store } from './reduxToolKit/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import ErrorFallback from './utills/ErrorFallback.jsx'
import { ErrorBoundary } from "react-error-boundary";


createRoot(document.getElementById('root')).render(
  <BrowserRouter>


    <Provider store={store}>

      <PersistGate loading={null} persistor={persistor}>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <App />
        </ErrorBoundary>

      </PersistGate>

    </Provider>


    <ToastContainer position="top-right" autoClose={3000} />

  </BrowserRouter>
)
