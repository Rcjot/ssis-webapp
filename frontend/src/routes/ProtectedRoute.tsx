import { useAuth } from "../ context/AuthContext";
import { Outlet, Navigate, useLocation } from "react-router-dom";

function ProtectedRoute() {
    const { auth } = useAuth()!;
    const location = useLocation();
    console.log(location.pathname);
    if (auth.status === "loading") return <div>loading..</div>;

    return auth.status === "authenticated" ? (
        <Outlet />
    ) : (
        <Navigate to="login" replace />
    );
}

export default ProtectedRoute;
