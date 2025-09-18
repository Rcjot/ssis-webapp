import Layout from "../Layouts/Layout";
import Home from "../pages/Home";
import Students from "../pages/Students";
import Programs from "../pages/Programs";
import Colleges from "../pages/Colleges";

function getRoutes() {
    return [
        {
            element: <Layout />,
            children: [
                { path: "/", element: <Home /> },
                {
                    path: "/students",
                    element: <Students />,
                },
                { path: "/programs", element: <Programs /> },
                { path: "/colleges", element: <Colleges /> },
            ],
        },
    ];
}

export default getRoutes;
