import { RouterProvider, createBrowserRouter } from "react-router-dom";
import getRoutes from "./routes/router";
import AuthProvider from "./routes/AuthProvider";
import { ToastContainer } from "react-toastify";

function App() {
    const router = createBrowserRouter(getRoutes());

    return (
        <>
            <AuthProvider>
                <ToastContainer stacked />
                <RouterProvider router={router} />
            </AuthProvider>
        </>
    );
}

export default App;
