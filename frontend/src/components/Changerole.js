import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import summaryapi from "../common";

const EditUserDialog = ({ open, handleClose, user, fetchAllUsers }) => {
  const [updatedUser, setUpdatedUser] = useState(user);

  // Handle input change
  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Handle user update
  const handleUpdate = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access-token="))
        ?.split("=")[1];

      const response = await fetch(`${summaryapi.updateuser.url}/${user._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();
      if (data.success) {
        alert("User updated successfully!");
        fetchAllUsers(); // Refresh user list
        handleClose(); // Close dialog
      } else {
        alert("Failed to update user!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          name="name"
          type="text"
          fullWidth
          value={updatedUser.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Email"
          name="email"
          type="email"
          fullWidth
          value={updatedUser.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Role"
          name="role"
          type="text"
          fullWidth
          value={updatedUser.role}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
