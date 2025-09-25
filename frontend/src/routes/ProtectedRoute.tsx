import { useAuth } from "../ context/AuthContext";
import { Outlet, Navigate, useLocation } from "react-router-dom";

function ProtectedRoute() {
    const { auth } = useAuth()!;
    console.log("protected");
    const location = useLocation();
    console.log(location.pathname);
    return auth.status === "authenticated" ? (
        <Outlet />
    ) : (
        <Navigate to="login" replace />
    );
}

export default ProtectedRoute;
