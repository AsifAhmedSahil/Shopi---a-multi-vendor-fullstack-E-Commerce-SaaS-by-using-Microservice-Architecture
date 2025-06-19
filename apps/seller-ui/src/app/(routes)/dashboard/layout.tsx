import SidebarWrapper from 'apps/seller-ui/src/shared/components/sidebar/Sidebar'
import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {

  return (
    <div className='w-full bg-black flex min-h-screen'>
        <aside className='w-[280px] min-w-[250px] max-w-[300px] border-r border-r-slate-800 p-4 text-white'>
            <div className='sticky top-0'>
                <SidebarWrapper/>

            </div>

        </aside>
        {children}</div>
  )
}

export default Layout