"use client"
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Tooltip,
  Link,
  Image
} from "@nextui-org/react";
import {SearchIcon} from "./SearchIcon";
import {ChevronDownIcon} from "./ChevronDownIcon";
import {capitalize} from "./utils";
import { useQuery } from "@tanstack/react-query";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBinLine,RiEdit2Fill } from "react-icons/ri";
import { LuEye } from "react-icons/lu";
import Swal from "sweetalert2";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import toast from "react-hot-toast";
import { storage } from "@/firebase/firebase.config";
import { ref, deleteObject } from "firebase/storage";
import { useRouter } from "next/navigation";


const columns = [
  {name: "Photo", uid: "thumbImage"},
  {name: "Name", uid: "name"},
  {name: "Original Price", uid: "originPrice", sortable: true},
  {name: "Selling Price", uid: "price", sortable: true},
  {name: "Quantity", uid: "quantity", sortable: true},
  {name: "Category", uid: "category"},
  {name: "Brand", uid: "brand"},
  {name: "STATUS", uid: "instock"},
  {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
  {name: "In Stock", uid: "instock"},
  {name: "Out Stock", uid: "outstock"},
  {name: "Up Comming", uid: "comming"}
];

const INITIAL_VISIBLE_COLUMNS = ["thumbImage", "name", "originPrice", "price", "category", "brand", "quantity", "actions"];

export default function ManageProductsPage() {
  useEffect(() => {
    document.title = 'Manage Products | Admin Dashbaord | Smart Original Brand Online Shop';
  }, []);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "price",
    direction: "ascending",
  });
  
  const {data: productData = [], isLoading: isReportLoading, refetch} = useQuery({
    queryKey: ["productData"],
    queryFn: async()=>{
      const res = await axiosPublic.get("/products/");
      return res.data;
    }
  })
  
  const handleDeleteProduct = useCallback((productData) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Function to delete a single image from Firebase
          const deleteImage = async (imageUrl) => {
            console.log(`deleting ${imageUrl}`)
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          };

          // Delete all images in the morePhotos array
          for (const photo of productData.images) {
            await deleteImage(photo);
          }

          // Delete all variation color images
          for (const variation of productData.variation) {
            await deleteImage(variation.colorImage);
          }

          const res = await axiosPublic.delete(`/products/${productData._id}`);
          if (res.data._id === productData._id) {
            refetch();
            toast.success("Item Deleted Successfully")
          }
        } catch (error) {
          console.error('Error deleting report:', error);
          Swal.fire({
            icon: "error",
            title: "Error deleting report",
            text: error.message,
            showConfirmButton: true
          });
        }
      }
    });
  }, [axiosPublic, refetch]);

  const handleUpdateProduct = (_id) => {
    console.log("🚀 ~ handleUpdateProduct ~ _id:", _id)
    router.push(`/manage-products/${_id}`);
    // toast.error("This Function is under construction!")
  }
  
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredproductData = [...productData];

    if (hasSearchFilter) {
      filteredproductData = filteredproductData.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredproductData = filteredproductData.filter((item) =>
        Array.from(statusFilter).includes(item.status),
      );
    }

    return filteredproductData;
  }, [hasSearchFilter, filterValue, statusFilter, productData]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "thumbImage":
        return (
          <div className="flex flex-col">
             <Image className="w-12" src={cellValue[0]} alt="Product Photo" /> 
          </div>
        );
      case "name":
        return (
          <div className="flex flex-col">
            <span className="text-bold text-small capitalize">{cellValue}</span>
          </div>
        );
      case "originPrice":
        return (
          <div className="flex flex-col">
            <span className="text-bold text-base font-medium capitalize">Tk.{cellValue}</span>
          </div>
        );
      case "price":
        return (
          <div className="flex flex-col">
            <span className="text-bold text-base font-medium capitalize">Tk.{cellValue}</span>
          </div>
        );
      case "category":
        return (
          <div className="flex flex-col">
            <span className="text-bold text-small capitalize">{cellValue}</span>
          </div>
        );
      case "brand":
        return (
          <div className="flex flex-col">
            <span className="text-bold text-small capitalize">{cellValue}</span>
          </div>
        );
      case "quantity":
        return (
          <div>
            <Chip className="capitalize" size="sm" variant="flat">
            {cellValue}
            </Chip>
          </div>
        );
      case "actions":
        return (
          <div className="flex justify-center gap-2 items-center">
          <Tooltip color="default" content="Update">
            <span onClick={() => handleUpdateProduct(item._id)} className="text-lg text-black cursor-pointer active:opacity-50">
              <RiEdit2Fill />
            </span>
          </Tooltip>
          <Tooltip color="default" content="View Product">
            <Link isExternal href={`https://smartoriginalbrand.com/product/default?id=${item._id}`} className="text-lg text-black cursor-pointer active:opacity-50">
              <LuEye />
            </Link>
          </Tooltip>
          <Tooltip color="danger" content="Delete">
            <span onClick={() => handleDeleteProduct(item)} className="text-lg text-danger cursor-pointer active:opacity-50">
              <RiDeleteBinLine />
            </span>
          </Tooltip>
        </div>
        );
      default:
        return cellValue;
    }
  }, [handleDeleteProduct]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by Style name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button as={Link} color="primary" href="add-new-product" endContent={<FiPlus />}>
                Add New Product
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {productData.length} Project</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    onSearchChange,
    onClear,
    productData
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [page, onPreviousPage, onNextPage, pages]);

  return (
    <>
    <Table
    radius="sm"
    aria-label="Example table with custom cells, pagination and sorting"
    isHeaderSticky
    bottomContent={bottomContent}
    bottomContentPlacement="outside"
    sortDescriptor={sortDescriptor}
    topContent={topContent}
    topContentPlacement="outside"
    onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody isLoading={isReportLoading} emptyContent={"No Product found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    </>
  );
}
