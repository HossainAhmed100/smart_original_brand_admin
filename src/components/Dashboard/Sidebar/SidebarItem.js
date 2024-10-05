import { Link } from '@nextui-org/react'
import { usePathname } from 'next/navigation';

function SidebarItem({item}) {
    const linkPath = `${item.path}`;
    const pathname = usePathname(); 
  return (
    <Link
    href={linkPath}
    className={`flex items-center p-2 text-gray-900 rounded-lg border-1 duration-300 transition-all bg-transparent hover:bg-gray-200 ${pathname === linkPath ? "bg-gray-200 border-gray-300" : "border-transparent"} group`} end="true">
       {item?.icon && <item.icon color={"#363636"} size={20}/>}
       <span className={`flex-1 ms-3 whitespace-nowrap`}>{item.title}</span>
    </Link>
  )
}

export default SidebarItem