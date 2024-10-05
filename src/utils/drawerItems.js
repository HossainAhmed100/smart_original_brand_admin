import { FaChartPie } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { MdAddBusiness, MdOutlineManageSearch } from "react-icons/md";
import { PiResize } from "react-icons/pi";
import { FiPackage, FiLayout } from "react-icons/fi";
import { USER_ROLE } from "@/constants/role";
import { TbCategoryPlus } from "react-icons/tb";

export const drawerItems = (role) => {
   const roleMenus = [];

   const defaultMenus = [
      {
         title: 'My Account',
         path: `${role}/profile`,
         icon: FaUser,
      },
   ];

   switch (role) {
      case USER_ROLE.ADMIN:
         roleMenus.push(
            {
               title: 'Dashboard',
               path: `/`,
               icon: FaChartPie,
            },
            {
               title: 'Manage Orders',
               path: `/manage-orders`,
               icon: FiPackage,
            },
            {
               title: 'Add New Product',
               path: `/add-new-product`,
               icon: MdAddBusiness,
            },
            {
               title: 'Manage Product',
               path: `/manage-products`,
               icon: MdOutlineManageSearch,
            },
            {
               title: 'Manage Size Guide',
               path: `/manage-sizeguide`,
               icon: PiResize,
            },
            {
               title: 'Manage Category',
               path: `/manage-category`,
               icon: TbCategoryPlus,
            },
            {
               title: 'Manage Layout',
               path: `/manage-layout`,
               icon: FiLayout,
            }
         );
         break;

      case USER_ROLE.USER:
         roleMenus.push(
            {
               title: 'My Orders',
               path: `${role}/my-orders`,
               icon: FiPackage,
            }
         );
         break;
         
      default:
         break;
   }

   return [...roleMenus, ...defaultMenus];
};