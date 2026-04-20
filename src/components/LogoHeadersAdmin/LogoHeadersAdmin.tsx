import styles from "./LogoHeadersAdmin.module.css";

export function LogoHeadersAdmin() {
    return (
        <div className={styles.logo}>
            <div className={styles.head}>
                Идём<span>в</span>кино
            </div>
            <div className={styles.text}>Администраторррская</div>
        </div>
    );
}

export default LogoHeadersAdmin;
