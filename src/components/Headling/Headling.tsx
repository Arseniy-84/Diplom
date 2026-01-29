import styles from './Headling.module.css';
import cn from 'classnames';
import type { HeadlingProps } from './Headling.props';

function Headling({ children, className, appearence,  ...props }: HeadlingProps) {

	return (
		<div className={cn(className, styles['head'], {
			[styles.client] : appearence === 'client',
			[styles.admin] : appearence === 'admin'
		})} {...props}> {children}
		</div>
	);
};

export default Headling;