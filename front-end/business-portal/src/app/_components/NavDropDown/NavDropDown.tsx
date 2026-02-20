"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './NavDropDown.module.css';
import { FiChevronUp } from 'react-icons/fi';
import DropDown from '../DropDown/DropDown';

interface NavDropDownProps {
  label: string;
  href: string;
  dropdownList: { label: string; href: string }[];
}

export function NavDropDown({ label, href, dropdownList }: NavDropDownProps) {

  const [open, setOpen] = useState(false);

  return (
    <div
      className={styles.dropdownWrapper}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link href={href} className={styles.link}>
        {label}
        <FiChevronUp className={`${styles.chevron} ${open ? styles.chevronDown : ''}`}/>
      </Link>

      {open && (
       <DropDown dropdownList={dropdownList} />
      )}
    </div>
  );
}