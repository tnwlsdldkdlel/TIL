import { Alert, Box, Snackbar } from "@mui/material";
import { memo, useEffect, useState } from "react";

function SnackBar({ result, message }) {
  const [open, setOpen] = useState(result);

  useEffect(() => {
    setOpen(result);
  }, [result]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen("");
  };

  return open === "fail" ? (
    <Box sx={{ width: 500 }}>
      <Snackbar
        spacing={2}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open === "fail"}
        onClose={handleClose}
        message={message}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  ) : (
    <Box sx={{ width: 500 }}>
      <Snackbar
        spacing={2}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open === "success"}
        onClose={handleClose}
        message={message}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default memo(SnackBar);
