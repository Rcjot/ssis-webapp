import { useAuth } from "../ context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

function PublicRoute() {
    const { auth } = useAuth()!;

    if (auth.status === "loading") return <div>loading..</div>;

    return auth.status === "unauthenticated" ? (
        <Outlet />
    ) : (
        <Navigate to="/home" replace />
    );
}
export default PublicRoute;
