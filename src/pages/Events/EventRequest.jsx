import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Add PropTypes import
import { styled } from '@mui/system';
import {
  Box,
  Button,
  Pagination,
  TableSortLabel,
  Tooltip,
  tooltipClasses,
  Typography,
  PaginationItem,
  TableRow,
  TableCell,
  TableHead,
  Table,
  Select,
  MenuItem
} from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { deleteEvent, getEvents } from '../../Api/event';

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 11,
    minWidth: 110,
  },
}));

function EventRequest() {
  return (
    <div>
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: "bold", fontSize: "20px", textDecoration: "underline" }}>
          Event Request
        </Typography>
      </Box>
      <TableCustomized />
    </div>
  );
}

export default EventRequest;

function IconComponents({ order }) {
  return order === 'desc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
}

IconComponents.propTypes = {
  order: PropTypes.string.isRequired,
};

function TablePaginationAction({ count, page, onPageChange }) {
  return (
    <CustomPagination count={count} page={page} onPageChange={onPageChange} />
  );
}

TablePaginationAction.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export const CustomPagination = ({ count, page = 1, onPageChange }) => {
  const renderItem = (item) => (
    <PaginationItem {...item} sx={{
      backgroundColor: item.page === page ? "white !important" : "transparent",
      borderColor: item.page === page ? "white" : "#E3E4EB",
      color: item.page === page ? "black" : "blue",
      borderRadius: "5px",
      padding: "10px",
      m: 0.5,
    }} />
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right', width: "100%" }}>
      <CustomButton
        disabled={page === 1}
        onClick={() => onPageChange(null, page - 1)}
      >
        <KeyboardDoubleArrowLeftIcon />Previous
      </CustomButton>
      <Pagination
        count={count}
        page={page}
        renderItem={renderItem}
        variant='outlined'
        shape="rounded"
        onChange={onPageChange}
        hidePrevButton
        hideNextButton
        sx={{ mx: 2, backgroundColor: "#E3E4EB" }}
      />
      <CustomButton
        disabled={page === count}
        onClick={() => onPageChange(null, page + 1)}
      >
        Next<KeyboardDoubleArrowRightIcon />
      </CustomButton>
    </div>
  );
};

CustomPagination.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

function TableCustomized() {
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('epicNo');
  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const getData = async (page = 1) => {
    await getEvents(page).then((res) => {
      setTotalItems(res.data.pagination.totalItems);
      setRows(res.data.data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getData(newPage);
  };

  const removeEvent = async (id) => {
    await deleteEvent(id);
    await getData();
  };

  const handleStatusChange = (id, value) => {
    console.log(id, value);
    // Optionally, update the backend or trigger any other action here
  };

  return (
    <Box>
      <Root>
        <Table aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Tooltip title="Sort by EPIC No." arrow>
                  <TableSortLabel
                    active={orderBy === 'epicNo'}
                    direction={orderBy === 'epicNo' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'epicNo')}
                    IconComponent={() => <IconComponents order={orderBy === 'epicNo' ? order : 'asc'} />}
                  >
                    Token ID
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              {/* Other TableCells */}
            </TableRow>
          </TableHead>
          <tbody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.epicId}</TableCell>
                <TableCell>{`${row.date.slice(0, 10)} ${row.date.slice(11, 16)}`}</TableCell>
                <TableCell>{row.mobileNumber}</TableCell>
                <TableCell>{row?.constituency || "constituency not found"}</TableCell>
                <TableCell>{row.boothNumber}</TableCell>
                <TableCell>
                  <Select
                    value={row.status || ''}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select Status
                    </MenuItem>
                    <MenuItem value="0">Accepted</MenuItem>
                    <MenuItem value="1">Processing</MenuItem>
                    <MenuItem value="2">Completed</MenuItem>
                    <MenuItem value="3">Rejected</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <LightTooltip
                    placement='bottom-end'
                    title={
                      <Box>
                        <Box sx={{ padding: "4px 5px", display: "flex", alignItems: "center", cursor: "pointer" }}>
                          <Typography sx={{ padding: "0 5px", fontSize: "12px", cursor: "pointer", color: "#2F4CDD" }}>
                            View Details
                          </Typography>
                        </Box>
                        <Box sx={{ padding: "4px 5px", display: "flex", alignItems: "center", cursor: "pointer" }}>
                          <Typography
                            sx={{ padding: "0 5px", fontSize: "12px", cursor: "pointer", color: "#FF0000" }}
                            onClick={() => removeEvent(row.id)}
                          >
                            Remove
                          </Typography>
                        </Box>
                      </Box>
                    }
                  >
                    <Button
                      sx={{
                        color: "#3E4954",
                        textTransform: "none",
                        borderRadius: "8px",
                        height: "37px",
                        p: 1,
                        "&:hover": {
                          backgroundColor: "rgba(242, 244, 248, 0.25)",
                          borderColor: "#2F4CDD",
                        }
                      }}
                    >
                      <MoreHorizIcon />
                    </Button>
                  </LightTooltip>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
          <tfoot>
            <TableRow>
              <TableCell colSpan={7}>
                <CustomTablePagination
                  count={Math.ceil(totalItems / rowsPerPage)}
                  page={page}
                  onPageChange={handleChangePage}
                />
              </TableCell>
            </TableRow>
          </tfoot>
        </Table>
      </Root>
    </Box>
  );
}

function CustomTablePagination({ count, page, onPageChange }) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" m={2}>
      <TablePaginationAction
        count={count}
        page={page}
        onPageChange={onPageChange}
      />
    </Box>
  );
}

CustomTablePagination.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

const CustomButton = styled(Button)({
  backgroundColor: "#2F4CDD",
  color: "white",
  width: '120px',
  margin: '0 4px',
  textAlign: 'center',
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: "#2F4CDD",
  },
});

const Root = styled('div')(({ theme }) => ({
  '& .MuiTableHead-root': {
    backgroundColor: theme.palette.background.default,
  },
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiTableSortLabel-root': {
    color: theme.palette.text.primary,
  },
}));
