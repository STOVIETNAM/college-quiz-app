import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Suspense, lazy } from 'react'
import 'react-datetime/css/react-datetime.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import SuspenseLoading from './components/SuspenseLoading'
import AuthLayout from './layouts/AuthLayout'
import DasboardLayout from './layouts/DasboardLayout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Users = lazy(() => import('./pages/Users'))
const Profile = lazy(() => import('./pages/Profile'))
// const ViewUser = lazy(() => import('./components/ViewUser'))

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
            element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>,
          },
          {
            path: 'subjects',
            element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>
          },
          {
            path: 'profile',
            element: <Suspense fallback={<SuspenseLoading />}><Profile /></Suspense>
          },
          {
            path: 'courses',
            element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>
          },
          {
            path: 'profile',
            element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>
          },
          {
            path: 'exams',
            element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>
          },
          {
            path: 'questions',
            element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>
          },
          {
            path: 'teachers',
            element: <Suspense fallback={<SuspenseLoading />}><Users role='teacher' /></Suspense>
          },
          {
            path: 'students',
            element: <Suspense fallback={<SuspenseLoading />}><Users role='student' /></Suspense>
            // children: [
            //   {
            //     index: true,
            //     element: <Suspense fallback={<SuspenseLoading />}><Users role='student' /></Suspense>
            //   },
            //   {
            //     path: '*',
            //     element: <Suspense fallback={<SuspenseLoading />}><ViewUser /></Suspense>
            //   }
            // ]
          },
        ]
      }
    ]
  }
])
const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
