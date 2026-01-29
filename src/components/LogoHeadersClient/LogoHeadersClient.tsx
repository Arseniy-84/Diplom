import { useNavigate } from 'react-router-dom';
import styles from './LogoHeadersClient.module.css';
import { useNavigation } from '../../hooks/useNavigation';


function LogoHeadersClient() {
	const { navigationData} = useNavigation();
	const navigate = useNavigate();

	return (
		<div className={styles.head} onClick={() => navigate(`/?seance=${navigationData.date}`)}>идём<span>в</span>кино</div>
	);
};

export default LogoHeadersClient;