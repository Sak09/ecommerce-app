import React, { useEffect, useState } from "react";
import summaryapi from "../common";
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

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchAllUsers = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access-token="))
        ?.split("=")[1];

      const response = await fetch(summaryapi.Allusers.url, {
        method: summaryapi.Allusers.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await response.json();
      if (data?.data) {
        setUsers(data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
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

      {!loading && !error && users.length > 0 ? (
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
              {users.map((user, index) => (
                <TableRow
                  key={user.id || index}
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
          fetchAllUsers={fetchAllUsers}
        />
      )}
    </Box>
  );
};

export default AllUsers;
