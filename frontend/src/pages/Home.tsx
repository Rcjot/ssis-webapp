import { useAuth } from "../ context/AuthContext";
import styles from "./styles/Pages.module.css";

function Home() {
    const { auth } = useAuth()!;

    return (
        <div className={styles.pageContent}>
            <h1>hello {auth.user?.username} !</h1>
        </div>
    );
}

export default Home;
