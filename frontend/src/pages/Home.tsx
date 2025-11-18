import { useAuth } from "../ context/AuthContext";
import styles from "./styles/Pages.module.css";
import SetProfile from "../components/profilepic/SetProfile";

function Home() {
    const { auth } = useAuth()!;

    return (
        <div className={styles.pageContent}>
            <h1>hello {auth.user?.username} !</h1>
            <SetProfile />
        </div>
    );
}

export default Home;
