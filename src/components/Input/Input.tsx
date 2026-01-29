
import styles from './Input.module.css';
import cn from 'classnames';
import type { InputProps } from './Input.props';

function Input({ className, isValid = true,  ...props }: InputProps) {

	return (
		<input {...props} className={cn(styles['input'], className, {
			[styles['invalid']]: !isValid
		})} {...props}/>
	);
};

export default Input;