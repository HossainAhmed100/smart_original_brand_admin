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
  Pagination,
  Tooltip,
  Link
} from "@nextui-org/react";
import {SearchIcon} from "./SearchIcon";
import { useQuery } from "@tanstack/react-query";
import { LuEye } from "react-icons/lu";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useRouter } from "next/navigation";
import DateConverter from "@/utils/dateConverter";

const columns = [
  {name: "Full Name", uid: "fullName"},
  {name: "Date", uid: "createdAt"},
  {name: "Phone Number", uid: "phone"},
  {name: "Address", uid: "address"},
];

const statusOptions = [
  {name: "In Stock", uid: "instock"},
  {name: "Out Stock", uid: "outstock"},
  {name: "Up Comming", uid: "comming"}
];

const INITIAL_VISIBLE_COLUMNS = ["fullName", "createdAt", "phone", "address"];

export default function ManageUsers() {
  useEffect(() => {
    document.title = 'Manage Users | Admin Dashbaord | Smart Original Brand Online Shop';
  }, []);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const axiosPublic = useAxiosPublic();
  
  const {data: manageUsers = [], isLoading} = useQuery({
    queryKey: ["manageUsers"],
    queryFn: async () => {
      const res = await axiosPublic.get('/users');
      return res.data;
    },
  })
  
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredproductData = [...manageUsers];

    if (hasSearchFilter) {
      filteredproductData = filteredproductData.filter((item) =>
        item.phone.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredproductData = filteredproductData.filter((item) =>
        Array.from(statusFilter).includes(item.status),
      );
    }

    return filteredproductData;
  }, [hasSearchFilter, filterValue, statusFilter, manageUsers]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items];
  }, [items]);

  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "fullName":
        return (
          <div className="flex flex-col">
            <span className="text-bold text-small capitalize">{cellValue}</span>
          </div>
        );
      case "date":
        return (
          <div className="flex flex-col">
            <span className="text-bold text-base font-medium capitalize">{<DateConverter createdAt={cellValue}/>}</span>
          </div>
        );
      case "phone":
        return (
          <div className="flex flex-col">
            <span className="text-bold text-base font-medium capitalize">{cellValue}</span>
          </div>
        );
      case "address":
        return (
          <div className="flex flex-col">
            <span className="text-bold text-small capitalize">{cellValue ? cellValue : "N/A"}</span>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

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
            placeholder="Search by Phone Number..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {manageUsers.length} Users</span>
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
    onRowsPerPageChange,
    onSearchChange,
    onClear,
    manageUsers
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
    topContent={topContent}
    topContentPlacement="outside"
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
      <TableBody isLoading={isLoading} emptyContent={"No User found"} items={sortedItems}>
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
