import { drawerItems } from '@/utils/drawerItems'
import SidebarItem from './SidebarItem'
import { getUserInfo } from '@/services/auth.services'
import { useEffect, useState } from 'react';

function Sidebar() {
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const {role} = getUserInfo();
    setUserRole("admin");
  }, []);
  return (
    <div className="space-y-2 font-medium">
      {drawerItems("admin").map((item, index) => (
        <SidebarItem key={index} item={item}/>
      ))}
    </div>
  )
}

export default Sidebar