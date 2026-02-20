import styles from './InputCard.module.css';

interface InputCardProps {
	title: string;
	inputType: string;
	placeholder?: string;
	value?: string;
	required?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputCard( props: InputCardProps ) {

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<h2 className={styles.title}>
					{props.title}
				</h2>

				<input
					className={styles.cardInput}
					type={props.inputType}
					placeholder={props.placeholder}
					value={props.value}
					onChange={props.onChange}
					required={props.required}
				/>
			</div>
		</div>
	);
}