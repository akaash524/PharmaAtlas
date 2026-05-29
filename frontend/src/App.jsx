import { createBrowserRouter } from 'react-router'
import './App.css'
import Home from './Components/Home.jsx'
import RootLayout from './Components/RootLayout.jsx'
import ErrorBoundary from './Components/ErrorBoundary.jsx'
import Register from './Components/Register.jsx'
import Login from './Components/Login.jsx'
import ProtectedRoute from './Components/ProtectedRoute.jsx'
import UserProfile from './Components/UserProfile.jsx'
import AdminProfile from './Components/AdminProfile.jsx'
import MyReports from './Components/MyReports.jsx'
import AdminStats from './Components/AdminStats.jsx'
import ManageMedicines from './Components/ManageMedicines.jsx'
import ManagePharmacies from './Components/ManagePharmacies.jsx'
import ManageReports from './Components/ManageReports.jsx'
import ManageUsers from './Components/ManageUsers.jsx'
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
