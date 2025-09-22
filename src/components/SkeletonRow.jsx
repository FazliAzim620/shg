import {
  Skeleton,
  TableCell,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

const SkeletonRow = ({ column = 6 }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("xl"));

  return (
    <TableRow>
      {Array.from(Array(matches ? 12 : column).keys())?.map((item, index) => (
        <TableCell key={index}>
          <Skeleton variant="text" width={100} height={24} />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default SkeletonRow;
