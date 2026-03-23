"use client";
import { useState, type ChangeEvent, type FC } from "react";
import { LuSearch } from "react-icons/lu";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SearchBar = ({
  placeholder = "Search...",
  value,
  onChange,
}: SearchBarProps) => {
  const [internal, setInternal] = useState<string>("");
  const controlled = value !== undefined;
  const currentValue = controlled ? value : internal;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!controlled) setInternal(v);
    onChange?.(v);
  };

  return (
    <div className={styles.wrapper}>
      <LuSearch className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
