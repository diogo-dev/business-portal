import styles from './DropDown.module.css';
import Link from 'next/link';

interface DropDownProps {
  dropdownList: { label: string; href: string }[];
}

export default function DropDown({ dropdownList }: DropDownProps) {
  return (
    <div className={styles.dropdown}>
      {dropdownList.map((item, index) => (
        <Link key={index} href={item.href} className={styles.dropdownLink}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}