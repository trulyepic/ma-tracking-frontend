import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useFixTrailingSlash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (location.pathname.endsWith("/") && location.pathname !== "/") {
      setIsRedirecting(true);
      navigate(location.pathname.slice(0, -1), { replace: true });
    } else {
      setIsRedirecting(false);
    }
  }, [location, navigate]);

  return isRedirecting;
};

export default useFixTrailingSlash;
