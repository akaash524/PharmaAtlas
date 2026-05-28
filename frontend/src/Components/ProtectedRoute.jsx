import React,{useState} from 'react'
import { Navigate } from 'react-router'
function ProtectedRoute({children,allowedRoles}) {
  return children
}

export default ProtectedRoute