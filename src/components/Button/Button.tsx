import styles from './Button.module.css';
import type { ButtonProps } from './Button.props';
import cn from 'classnames';

function Button({ children, className, appereance = 'small', ...props }: ButtonProps) {

	return (
		<button  className={cn(styles.button, styles.accent, className, {
			[styles.small]: appereance === 'small',
			[styles.big]: appereance === 'big',
            [styles.admin]: appereance === 'admin',
			[styles.cancel]: appereance === 'cancel'
		})} {...props}>{children}</button>  
	);
}

export default Button;