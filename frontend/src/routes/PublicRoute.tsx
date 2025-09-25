import { useAuth } from "../ context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

function PublicRoute() {
    const { auth } = useAuth()!;
    return auth.status === "unauthenticated" || auth.status === "loading" ? (
        <Outlet />
    ) : (
        <Navigate to="/home" replace />
    );
}
export default PublicRoute;
