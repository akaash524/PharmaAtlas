import { createBrowserRouter } from 'react-router'
import './App.css'
import Home from './components/Home'
import RootLayout from './components/RootLayout'
import ErrorBoundary from './components/ErrorBoundary'
import Register from './components/Register'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import UserProfile from './components/UserProfile'
import AdminProfile from './components/AdminProfile'
import MyReports from './components/MyReports'
import AdminStats from './components/AdminStats'
import ManageMedicines from './components/ManageMedicines'
import ManagePharmacies from './components/ManagePharmacies'
import ManageReports from './components/ManageReports'
import ManageUsers from './components/ManageUsers'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router'
function App() {

const routingObj=createBrowserRouter([
  {
    path:"/",
    element:<RootLayout />,
    errorElement:<ErrorBoundary />,
    children:[
      {
        path:"",
        element:<Home />
      },{
        path:"signup",
        element:<Register />
      },{
        path:"login",
        element:<Login />
      },{
        path:"user-profile",
        element:<ProtectedRoute allowedRoles={['user']}>
                      <UserProfile />
                </ProtectedRoute>,
        children: [
          { path: '', element: <MyReports /> },          // default tab
          { path: 'my-reports', element: <MyReports /> }
        ]
        
      },{
        path:"admin-profile",
        element:
          <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
          </ProtectedRoute>,
        children:[
          { path: '', element: <AdminStats /> },                        // default tab
          { path: 'stats', element: <AdminStats /> },
          { path: 'users', element: <ManageUsers /> },
          { path: 'medicines', element: <ManageMedicines /> },
          { path: 'pharmacies', element: <ManagePharmacies /> },
          { path: 'reports', element: <ManageReports /> }
        ]
      }
    ]
  }
])

  return (
    <>
    <Toaster position='top-center' reverseOrder={false} />
    <RouterProvider  router={routingObj}/>
    </>
  )
}

export default App
