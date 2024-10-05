"use client"
import { Button, Link } from "@nextui-org/react";
import { useSignOut } from "react-firebase-hooks/auth";
import Swal from "sweetalert2";
import { useState } from "react";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { auth } from "@/firebase/firebase.config";
import { useRouter } from "next/navigation";
import ThreeLineIcon from "@/assets/SVGIcons/ThreeLineIcon";
import Image from "next/image";
import Sidebar from "../Sidebar/Sidebar";

function DashbaordSidebar({children}) {
  // State to track the open/close status of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hook for navigation
  const router = useRouter();
  // Hook to sign out user
  const [signOut] = useSignOut(auth);
  
  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <Button onClick={() => setIsMenuOpen(!isMenuOpen)} data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100">
                  <span className="sr-only">Open sidebar</span>
                  <ThreeLineIcon />
              </Button>
              <Link href="/" color="foreground" className="flex items-center gap-2 justify-center">
                <Image src={"/images/logoline.png"} width={170} height={25} priority={true} alt='brand logo'/>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <aside id="logo-sidebar" className={`fixed flex flex-col top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${!isMenuOpen && "-translate-x-full"} lg:translate-x-0 bg-white border-r border-gray-200`} aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <div>
            <Sidebar />
          </div>
        </div>
        <div className="mt-auto p-4 flex flex-col">
        <Button size="sm" onClick={async () => {
            const success = await signOut();
            if (success) {
               router.push("/login")
              Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Logout Successfull",
                  showConfirmButton: false,
                  timer: 1500
                });
            }
          }}  
          className="bg-gray-900 text-white shadow-lg" 
          startContent={<FaArrowRightFromBracket />}>
          Sign Out
        </Button> 
        </div>
      </aside>
          
      <div className="p-4 lg:ml-64">
        <div className="p-4 mt-14">
            {children}
        </div>
      </div>
    </div>
  )
}


export default DashbaordSidebar