'use client'
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { BiSolidCollection, BiSolidChalkboard, BiLogoInstagram, BiSolidOffer } from "react-icons/bi";
import { FaAngleRight, FaMoneyBillWave, FaTag } from "react-icons/fa6";
import { TbResize } from "react-icons/tb";
import { MdCategory } from "react-icons/md";
import { useEffect } from "react";

const pathList = [
  {
    label: "Popup Promo Offers",
    path: "/manage-layout/manage-web-promo-offers",
    contect: "Manage Website Banner Popup Promo Offers",
    icon: BiSolidOffer,
    iconSize: 40,
    iconColor: "gray-600",
  },
  {
    label: "Product Size Guide",
    path: "/manage-layout/manage-product-sizeguide",
    contect: "Manage Your Size Guide",
    icon: TbResize,
    iconSize: 40,
    iconColor: "gray-600",
  },
  {
    label: "Product Category",
    path: "/manage-layout/manage-product-category",
    contect: "Mnage your product category",
    icon: MdCategory,
    iconSize: 40,
    iconColor: "gray-600",
  },
  {
    label: "Product Collection",
    path: "/manage-layout/manage-product-collection",
    contect: "Manage your product collections",
    icon: BiSolidCollection,
    iconSize: 40,
    iconColor: "gray-600",
  },
  {
    label: "Product Type",
    path: "/manage-layout/manage-product-types",
    contect: "Manage your product types",
    icon: FaTag,
    iconSize: 40,
    iconColor: "gray-600",
  },
  {
    label: "Delivery Charge",
    path: "/manage-layout/manage-deliveryCharge",
    contect: "Manage delivery charge for users",
    icon: FaMoneyBillWave,
    iconSize: 40,
    iconColor: "gray-600",
  },
  {
    label: "Social Instragram Images",
    path: "/manage-layout/manage-socialmedia-images",
    contect: "Manage Social Media Images",
    icon: BiLogoInstagram,
    iconSize: 40,
    iconColor: "gray-600",
  }
]

function ManageLayout() {
  useEffect(() => {
    document.title = 'Manage Website Layout | Admin Dashboard | Smart Original Brand Online Shop';
  }, []);
  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
      {pathList.map((item, index) => (
        <div key={index} className="rounded-md p-4 border-1 space-y-2">
          <div className="border-1 border-gray-200 bg-gray-100 rounded-lg p-10 flex items-center justify-center">
          {item?.icon && <item.icon color={"#363636"} size={item.iconSize}/>}
          </div>
          <p className="text-base font-medium text-gray-600">{item.label}</p>
          <span className="text-sm text-gray-400 font-light">{item.contect}</span>
          <Button as={Link} href={item.path} variant="bordered" color="default" className="w-full" size="md" endContent={<FaAngleRight />}>
            Manage
          </Button>
        </div>
      ))}
    </div>
  )
}

export default ManageLayout