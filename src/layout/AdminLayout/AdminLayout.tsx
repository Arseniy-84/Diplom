import { Outlet } from "react-router-dom";
import LogoHeadersAdmin from "../../components/LogoHeadersAdmin/LogoHeadersAdmin";
import styles from './AdminLayout.module.css';

export function AdminLayout() {

    return <div className={styles['admin-layout']}>
                <div className={styles.main}>
                    <div className={styles.logo}>
                        <LogoHeadersAdmin />                       
                    </div>
                    <div className={styles['content']}>
                        <Outlet />          
                    </div>
                </div>
            </div> 
}