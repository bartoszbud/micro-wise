import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setValid(false);
        return;
      }

      try {
        await axios.get("/auth/validate", {
          headers: {
            Authorization: `Bearer ${token}`, // token w nagłówku
          },
        });
        setValid(true); // token ważny
      } catch {
        setValid(false); // token nieprawidłowy
      }
    };

    checkToken();
  }, []);

  if (valid === null) return <div>Loading...</div>; // czekamy na walidację

  return valid ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
