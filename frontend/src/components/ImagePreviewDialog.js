import React from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ImagePreviewDialog = ({ open, onClose, imageUrl }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <IconButton
        onClick={onClose}
        style={{ position: "absolute", top: 10, right: 10, color: "#fff", backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <img
          src={imageUrl}
          alt="Preview"
          style={{ width: "100%", height: "auto", borderRadius: "10px" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
