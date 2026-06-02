import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from "@mui/icons-material/Edit";
import EditUserDialog from "../components/Changerole";
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { fetchAllUsers } from "../redux/userSlice";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { allUsers, loading, error } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleRefresh = () => {
    dispatch(fetchAllUsers());
  };

  return (
    <Box sx={{ py: 3, px: { xs: 1, sm: 2, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        All Users
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && allUsers && allUsers.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            overflowX: 'auto',
            boxShadow: 3,
            borderRadius: 3,
            bgcolor: 'background.paper',
            p: 1,
          }}
        >
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>S. No</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allUsers.map((user, index) => (
                <TableRow
                  key={user._id || index}
                  hover
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditClick(user)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !loading && (
          <Typography variant="body1" sx={{ mt: 3 }}>
            No users found.
          </Typography>
        )
      )}

      {selectedUser && (
        <EditUserDialog
          open={open}
          handleClose={handleClose}
          user={selectedUser}
          onUpdate={handleRefresh}
        />
      )}
    </Box>
  );
};

export default AllUsers;
