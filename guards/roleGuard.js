import { useNavigate, useOutlet } from "react-router-dom";
import { useEffect, useState } from "react";
import tokenManager from "../services/tokenManager";
import { getUserData, isTokenExpired} from "../store/authToken";

export default function RoleGuard({ allowedRoles }) {
  const navigate = useNavigate();
  const outlet = useOutlet();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const validate = async () => {
      const token = tokenManager.getToken();
      

      if (!token || isTokenExpired(token)) {
        navigate("/Screens/auth/login", { replace: true });
        return;
      }
      

      try {
        // Refresh BEFORE deciding authorization
        await tokenManager.refreshIfNeeded();

        const user = getUserData();
        if (!user) {
          navigate("/Screens/auth/login", { replace: true });
          return;
        }

        if (!allowedRoles.includes(user.role)) {
          navigate("/Screens/roleError", { replace: true });
          return;
        }

        // Done
        setChecking(false);

      } catch  {
        navigate("/Screens/auth/login", { replace: true });
      }
    };

    validate();
  }, [allowedRoles, navigate]);

  if (checking) return null;
  return outlet;
}
