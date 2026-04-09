import { Outlet } from "react-router-dom";
import LogoHeadersAdmin from "../../components/LogoHeadersAdmin/LogoHeadersAdmin";
import styles from "./AdminLayout.module.css";
import { assetPath } from "../../helpers/assetPath";

export function AdminLayout() {
    return (
        <div
            className={styles["admin-layout"]}
            style={{ ["--admin-layout-bg" as string]: `url(${assetPath("Admin/backgroun-image.png")})` }}
        >
            <div className={styles.main}>
                <div className={styles.logo}>
                    <LogoHeadersAdmin />
                </div>
                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
