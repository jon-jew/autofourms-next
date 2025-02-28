import Image from 'next/image';
import clx from "classnames";
import CircularProgress from "@mui/material/CircularProgress";

import "./loadingOverlay.scss";

const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => (
  <div className={clx({
    "loading-overlay": true,
    "transparent": !isLoading,
  })}>
    {/* <CircularProgress disableShrink sx={{ color: "#b81111" }} /> */}
    <Image className="wheel" src="/wheel-icon-red.png" width={60} height={60} alt="Loading Icon" />
  </div>
);

export default LoadingOverlay;
