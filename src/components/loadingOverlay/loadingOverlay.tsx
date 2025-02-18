import React from "react";
import clx from "classnames";
import CircularProgress from "@mui/material/CircularProgress";

import "./loadingOverlay.scss";

const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => (
  <div className={clx({
    "loading-overlay": true,
    "transparent": !isLoading,
  })}>
    <CircularProgress disableShrink sx={{ color: "#b81111" }} />
  </div>
);

export default LoadingOverlay;
