import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useFixTrailingSlash = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.endsWith("/") && location.pathname !== "/") {
      navigate(location.pathname.slice(0, -1), { replace: true });
    }
  }, [location, navigate]);
};

export default useFixTrailingSlash;
