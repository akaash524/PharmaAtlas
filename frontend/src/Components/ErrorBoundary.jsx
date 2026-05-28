import React from 'react'
import { useRouteError } from 'react-router'

function ErrorBoundary() {
    const {data,status,statusText}=useRouteError()
  return (
    <div className='text-center'>
        <p className='text-red-400 text-5xl'>{data}</p>
        <p className='text-4xl'>{status}-{statusText}</p>
    </div>
  )
}

export default ErrorBoundary