import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useFixTrailingSlash = (setReady) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (location.pathname.endsWith("/") && location.pathname !== "/") {
      navigate(location.pathname.slice(0, -1), { replace: true });
    } else {
      setIsRedirecting(false); // Only allow rendering after fixing the URL
      setReady(true);
    }
  }, [location, navigate, setReady]);

  return isRedirecting;
};

export default useFixTrailingSlash;
