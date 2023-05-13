import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home'

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    }
  ])
  return <RouterProvider router={router} />
}
