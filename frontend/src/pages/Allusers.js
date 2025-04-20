import React, { useEffect, useState } from "react";
import summaryapi from "../common";
import EditIcon from "@mui/icons-material/Edit";
import EditUserDialog from "../components/Changerole";

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
      console.log("Fetched Users:", data.data);

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

  // Fetch users on component mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Open Dialog with selected user data
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Users</h2>

      {/* Loading & Error Handling */}
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* User Table */}
      {!loading && !error && users.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ background: "#007bff", color: "white" }}>
              <th style={tableHeaderStyle}>S. No</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Role</th>
              <th style={tableHeaderStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tableCellStyle}>{index + 1}</td>
                <td style={tableCellStyle}>{user.name}</td>
                <td style={tableCellStyle}>{user.email}</td>
                <td style={tableCellStyle}>{user.role}</td>
                <td style={tableCellStyle}>
                  <EditIcon
                    style={{ cursor: "pointer", color: "#007bff" }}
                    onClick={() => handleEditClick(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No users found.</p>
      )}

      
      {selectedUser && (
        <EditUserDialog
          open={open}
          handleClose={handleClose}
          user={selectedUser}
          fetchAllUsers={fetchAllUsers} 
        />
      )}
    </div>
  );
};
const tableHeaderStyle = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "2px solid #ddd",
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

export default AllUsers;
