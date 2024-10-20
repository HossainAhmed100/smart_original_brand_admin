import { FaChartPie, FaBloggerB } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { MdAddBusiness, MdOutlineManageSearch, MdAllInbox, MdPermMedia } from "react-icons/md";
import { FiPackage } from "react-icons/fi";
import { USER_ROLE } from "@/constants/role";
import { TbCategoryPlus } from "react-icons/tb";

export const drawerItems = (role) => {
   const roleMenus = [];

   // const defaultMenus = [
   //    {
   //       title: 'My Account',
   //       path: `${role}/profile`,
   //       icon: FaUser,
   //    },
   // ];

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
               title: 'Manage Layout',
               path: `/manage-layout`,
               icon: TbCategoryPlus,
            },
            {
               title: 'Manage Blogs',
               path: `/manage-blogs`,
               icon: FaBloggerB,
            },
            {
               title: 'Manage Users',
               path: `/manage-users`,
               icon: FaUsers,
            },
            {
               title: 'Support Mail',
               path: `/manage-layout/manage-support-mail`,
               icon: MdAllInbox,
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

   return [...roleMenus];
};