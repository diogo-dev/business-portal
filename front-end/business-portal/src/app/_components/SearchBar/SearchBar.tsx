'use client';

import { useState, useRef, useCallback } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
}

export default function SearchBar({
  placeholder = '> search posts...',
  onSearch,
  onChange,
}: SearchBarProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onChange?.(e.target.value);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(value);
      }
      if (e.key === 'Escape') {
        setValue('');
        inputRef.current?.blur();
      }
    },
    [onSearch, value]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* scan line */}
        <span className={styles.scanLine} />

        {/* search icon */}
        <span className={styles.iconWrapper}>
          <SearchIcon />
        </span>

        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          spellCheck={false}
          autoComplete="off"
        />

      </div>

      {/* status bar */}
      <div className={`${styles.statusBar} ${isFocused ? styles.active : ''}`}>
        <span className={styles.statusDot} />
        <span className={styles.statusText}>ready</span>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="6.5"
        cy="6.5"
        r="4.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <line
        x1="10"
        y1="10"
        x2="13.5"
        y2="13.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}