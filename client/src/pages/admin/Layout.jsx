import React from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
        <div className="flex">
            <AdminSidebar/>
            <div className="flex-1 h-[100vh] overflow-y-auto">
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Layout
