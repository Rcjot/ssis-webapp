import { useAuth } from "../ context/AuthContext";
import styles from "./styles/Pages.module.css";

function Home() {
    const { auth } = useAuth()!;

    return (
        <div className={styles.pageContent}>
            <p>hello {auth.user?.username}</p>
        </div>
    );
}

export default Home;
