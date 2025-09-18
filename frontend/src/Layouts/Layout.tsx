import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function Layout() {
    return (
        <main>
            <Header />
            <div id="outlet">
                <Outlet />
            </div>
        </main>
    );
}

export default Layout;
