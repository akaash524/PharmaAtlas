import { createBrowserRouter } from 'react-router'
import './App.css'
import Home from './components/Home.jsx'
import RootLayout from './components/RootLayout.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import UserProfile from './components/UserProfile.jsx'
import AdminProfile from './components/AdminProfile.jsx'
import MyReports from './components/MyReports.jsx'
import AdminStats from './components/AdminStats.jsx'
import ManageMedicines from './components/ManageMedicines.jsx'
import ManagePharmacies from './components/ManagePharmacies.jsx'
import ManageReports from './components/ManageReports.jsx'
import ManageUsers from './components/ManageUsers.jsx'
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
