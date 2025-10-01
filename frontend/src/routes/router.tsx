import Layout from "../Layouts/Layout";
import Home from "../pages/Home";
import Students from "../pages/Students";
import Programs from "../pages/Programs";
import Colleges from "../pages/Colleges";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function getRoutes() {
    return [
        {
            element: <Layout />,
            children: [
                {
                    element: <PublicRoute />,
                    children: [
                        {
                            path: "/login",
                            element: <Login />,
                        },
                        {
                            path: "/signup",
                            element: <Signup />,
                        },
                    ],
                },
                {
                    element: <ProtectedRoute />,
                    children: [
                        { path: "/", element: <Home /> },
                        { path: "/home", element: <Home /> },
                        {
                            path: "/students",
                            element: <Students />,
                        },
                        { path: "/programs", element: <Programs /> },
                        { path: "/colleges", element: <Colleges /> },
                    ],
                },
            ],
        },
    ];
}

export default getRoutes;
