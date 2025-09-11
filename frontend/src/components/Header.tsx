import { Link } from "react-router-dom";

function Header() {
    return (
        <div>
            <Link to={"/"}>Home</Link>
            <Link to={"/students"}>Students</Link>
            <Link to={"/programs"}>Programs</Link>
            <Link to={"colleges"}>Colleges</Link>
        </div>
    );
}

export default Header;
