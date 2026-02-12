import styles from './TextareaCard.module.css';

interface TextareaCardProps {
  title: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TextareaCard(props: TextareaCardProps) {
  return (
    <div className={styles.container}>
			<div className={styles.content}>
				<h2 className={styles.title}>
					{props.title}
				</h2>

				<textarea
          className={styles.cardTextarea}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
        />
			</div>
		</div>
  );
}