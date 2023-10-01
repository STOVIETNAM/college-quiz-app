import { useEffect } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import DasboardLayout from './layouts/DasboardLayout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import './App.css'
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    errorElement: <NotFound />,
    children: [
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <Login />
          }
        ]
      },
      {
        path: '/',
        element: <DasboardLayout />,
        children: [
          {
            index: true,
            // path: '/',
            element: <Home />
          }
        ]
      }
    ]
  }
])
function App() {
  useEffect(() => {
    document.querySelectorAll('.loading, .pre-load').forEach(node => {
      node.remove()
    })
  })
  return (
    <RouterProvider router={router} />
  )
}

export default App
