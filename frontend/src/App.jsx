import { createBrowserRouter } from 'react-router'
import './App.css'
import Home from './Components/Home'
import RootLayout from './Components/RootLayout'
import ErrorBoundary from './Components/ErrorBoundary'
import Register from './Components/Register'
import Login from './Components/Login'
import ProtectedRoute from './Components/ProtectedRoute'
import UserProfile from './Components/UserProfile'
import AdminProfile from './Components/AdminProfile'
import MyReports from './Components/MyReports'
import AdminStats from './Components/AdminStats'
import ManageMedicines from './Components/ManageMedicines'
import ManagePharmacies from './Components/ManagePharmacies'
import ManageReports from './Components/ManageReports'
import ManageUsers from './Components/ManageUsers'
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
