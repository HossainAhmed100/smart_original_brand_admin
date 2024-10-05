import { Button, Chip, Link } from "@nextui-org/react";
import Image from "next/image";
import { FaCalendar } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { BsCopy } from "react-icons/bs";
import DateConverter from "@/utils/dateConverter";

function UserOrdersCard({item}) {
  const myCart = item.myCart;
  return (
    <div className="border-1 overflow-hidden border-gray-200 shadow-lg rounded-lg">
      <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center justify-between w-full">
        <Button color="default" variant="light" startContent={<FaCalendar />}>{<DateConverter createdAt={item.createdAt}/>}</Button>
        <OrderStatusChip statusKey={item.status} />
        </div>
      </div>
      <div className="p-4 space-y-2">
        {
          myCart.map(item => {
            return (
              <div className="flex border-1 rounded-lg border-gray-200 items-center justify-start" key={item.itemKey}>
                <div className="px-4  border-r-1">
                <Image src={item.thumbnail} alt={item.title} width={80} height={80}/>
                </div>
                <div className="px-4">
                  <h1>{item.title}</h1>
                  <strong>Tk.{item.sellingPrice}</strong>
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="px-4 border-t-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
        <Button color="default" variant="flat" endContent={<BsCopy />}>Order ID #44324564</Button>
        <Button as={Link} href={`manage-orders/${item?._id}`} color="default" variant="flat" endContent={<FaArrowRight />}>View Details</Button>
      </div>
    </div>
  )
}

const OrderStatusChip = ({ statusKey }) => {
  const orderStatus = [
    {label: "New Order", key: "newOrder", colors: "danger"},
    {label: "Shipped", key: "shipped", colors: "success"},
    {label: "Delivered", key: "delivered", colors: "primary"},
    {label: "Cancelled", key: "cancelled", colors: "danger"},
    {label: "Refunded", key: "refunded", colors: "warning"},
    {label: "Returned", key: "returned", colors: "secondary"},
  ]

  // Find the matching status
  const status = orderStatus.find(s => s.key === statusKey);

  // Fallback if statusKey is not found
  if (!status) {
    return <Chip color="secondary" radius="sm" variant="flat">Unknown Status</Chip>;
  }

  return (
    <Chip color={status.colors} radius="sm" variant="flat">
      {status.label}
    </Chip>
  );
};

export default UserOrdersCard