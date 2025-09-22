import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from "@mui/material";
import AvatarNameEmail from "../../../components/common/AvatarNameEmail";
import RoleAndSpecialities from "../../../components/common/RoleAndSpecialities";
import NodataFoundCard from "../../../provider_portal/provider_components/NodataFoundCard";
import SkeletonRow from "../../../components/SkeletonRow";

const ClientsProviderTable = ({
  searchTerm,
  providersData,
  getProviders,
  pagination,
  setPagination,
  rowsPerPage,
  setRowsPerPage,
  isLoading,
  filters,
}) => {
  const [page, setPage] = useState(0);
  const [filteredProviders, setFilteredProviders] = useState(providersData);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage + 1,
    }));

    // Call parent's getProviders with updated page
    getProviders({
      ...(filters[0] || {}),
      currentPage: newPage + 1,
      rowsPerPage,
    });
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    sessionStorage.setItem("per_page", newRowsPerPage);

    // Call parent's getProviders with updated rows per page
    getProviders({
      ...(filters[0] || {}),
      currentPage: 1,
      rowsPerPage: newRowsPerPage,
    });
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = providersData?.filter(
        (prov) =>
          prov?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          prov?.id?.toString()?.includes(searchTerm)
      );
      setFilteredProviders(filtered);
      setPage(0);
    } else {
      setFilteredProviders(providersData);
    }
  }, [searchTerm, providersData]);

  const columns = [
    { label: "Full Name" },
    { label: "Role & Speciality" },
    { label: "Facility Location" },
    { label: "Department" },
    { label: "Credentialing Issues" },
  ];

  const headerCellStyle = {
    backgroundColor: "rgba(231, 234, 243, .4)",
    fontSize: "11.9px",
    textTransform: "uppercase",
  };

  if (isLoading) {
    return (
      <Box>
        <SkeletonRow column={9} />
        <SkeletonRow column={9} />
        <SkeletonRow column={9} />
        <SkeletonRow column={9} />
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        {!filteredProviders?.length ? (
          <NodataFoundCard />
        ) : (
          <>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.label}
                      sx={{
                        ...headerCellStyle,
                        minWidth: column.minWidth || "auto",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProviders?.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <AvatarNameEmail
                        username={provider?.name}
                        email={provider?.email}
                      />
                    </TableCell>
                    <TableCell>
                      <RoleAndSpecialities
                        role={provider?.role?.name}
                        specialities={provider?.specialities}
                      />
                    </TableCell>
                    <TableCell>{provider?.location || "NA"}</TableCell>
                    <TableCell>
                      {provider?.credetiling_issues || "NA"}
                    </TableCell>
                    <TableCell>
                      {provider?.credetiling_issues || "NA"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={pagination.total || 0}
              page={pagination.currentPage - 1}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20, 25, 50]}
            />
          </>
        )}
      </TableContainer>
    </>
  );
};

export default ClientsProviderTable;
