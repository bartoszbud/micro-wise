import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface PrivateRouteProps {
  children: JSX.Element;
  rolesAllowed?: string[]; // dopuszczalne role
}

// Funkcja do parsowania payload z JWT
const parseJwt = (token: string) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, rolesAllowed }) => {
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setValid(false);
        return;
      }

      try {
        // 1️⃣ walidacja tokena po stronie backendu
        await axios.get("/auth/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (rolesAllowed && rolesAllowed.length > 0) {
          // 2️⃣ sprawdzamy role w tokenie
          const payload = parseJwt(token);
          const userRoles: string[] = payload?.roles || [];
          const hasRole = rolesAllowed.some(role => userRoles.includes(role));
          setValid(hasRole);
        } else {
          setValid(true); // token ważny, brak ograniczeń co do roli
        }
      } catch {
        setValid(false);
      }
    };

    checkToken();
  }, [rolesAllowed]);

  if (valid === null) return <div>Loading...</div>;

  return valid ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;