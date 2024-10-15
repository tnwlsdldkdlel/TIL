import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function BackDrop({ isLoading }) {
  const [open, setOpen] = useState(isLoading);

  useEffect(() => {
    setOpen(isLoading);
  }, [isLoading]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
