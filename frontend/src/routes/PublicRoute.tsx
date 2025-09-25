import { useAuth } from "../ context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

function PublicRoute() {
    const { auth } = useAuth()!;

    return auth.status === "unauthenticated" ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace />
    );
}
export default PublicRoute;
