import DashbaordSidebar from '@/components/Dashboard/DashbaordSidebar/DashbaordSidebar'
import React from 'react'

function CommonLayout({children}) {
  return (
    <DashbaordSidebar>{children}</DashbaordSidebar>
  )
}

export default CommonLayout