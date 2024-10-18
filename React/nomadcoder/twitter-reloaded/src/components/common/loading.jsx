import { Backdrop, CircularProgress } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";

function BackDrop({ isLoading }) {
  const [open, setOpen] = useState(isLoading);

  useEffect(() => {
    setOpen(isLoading);
  }, [isLoading]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

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

export default memo(BackDrop);
