import React, { useEffect, useState } from "react";
import { Snackbar } from "@material-ui/core";
let openSnackbarFn;
export default function CustomSnackbar() {
  interface snack {
    open: boolean;
    message: string;
    timeout: number;
    src?: string;
    onhide?: (param?) => any;
  }
  const [snack, setSnack] = useState<snack>({
    open: false,
    message: "",
    timeout: 0
  });

  const openSnackbar = ({ message, timeout, onhide, src }) => {
    setSnack({
      timeout: timeout,
      open: true,
      message: message,
      onhide: onhide,
      src: src
    });
  };

  useEffect(() => {
    openSnackbarFn = openSnackbar;
  }, []);
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={snack.open}
      autoHideDuration={snack.timeout}
      onClose={() => {
        setSnack({
          open: false,
          timeout: 0,
          message: ""
        });
        var t = snack.onhide;
      }}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={<span id="message-id">{snack.message}</span>}
    />
  );
}

export function openSnackbar(val) {
  openSnackbarFn({ ...val });
}
