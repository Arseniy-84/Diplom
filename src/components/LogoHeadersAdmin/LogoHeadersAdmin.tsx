import styles from "./LogoHeadersAdmin.module.css";

export function LogoHeadersAdmin() {
    return (
        <div>
            <div className={styles.head}>
                идём<span>в</span>кино
            </div>
            <div className={styles.text}>администраторская</div>
        </div>
    );
}

export default LogoHeadersAdmin;
