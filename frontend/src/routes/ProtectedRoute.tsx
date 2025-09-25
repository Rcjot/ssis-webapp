import { useAuth } from "../ context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoute() {
    const { auth } = useAuth()!;

    return auth.status === "authenticated" ? (
        <Outlet />
    ) : (
        <Navigate to="login" replace />
    );
}

export default ProtectedRoute;
