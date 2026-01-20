"use client";

import React, { useState } from 'react';
import styles from './AuthForm.module.css';

interface FormField {
  placeholder: string;
  type?: string;
  name: string;
}

interface FormProps {
  title: string;
  fields: FormField[];
  buttonText: string;
  bottomText: string;
  bottomLinkText: string;
  onSubmit: (data: Record<string, string>) => void;
  onBottomLinkClick: () => void;
  disabled?: boolean;
}

export function AuthForm({
  title,
  fields,
  buttonText,
  bottomText,
  bottomLinkText,
  onSubmit,
  onBottomLinkClick,
  disabled
}: FormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  function formatPhone(value: string): string {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Limit to 11 digits (2 for area code + 9 for number)
    const limited = digits.slice(0, 11);
    
    // Apply formatting based on length
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }
  }

  function removePhoneMask(value: string): string {
    return value.replace(/\D/g, '');
  }

  function handleChange(name: string, value: string ) {
    if (name === 'phone') {
      value = formatPhone(value);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFormSubmit(e: React.FormEvent) {
    console.log('AuthForm handleFormSubmit called');
    console.log('Form data:', formData);
    e.preventDefault();
    const processedData = { ...formData };
    
    if (processedData.phone) {
      processedData.phone = removePhoneMask(processedData.phone);
    }

    console.log('Processed data:', processedData);
    console.log('Calling onSubmit prop');
    onSubmit(processedData);
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>{title}</h1>

      <form 
        onSubmit={handleFormSubmit} 
        className={styles.form}
      >
        {fields.map((field, index) => (
          <input
            key={index}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={styles.input}
            required
          />
        ))}

        <button type="submit" className={styles.button} disabled={disabled}>
          {buttonText}
        </button>

      </form>

      <p className={styles.bottomText}>
        {bottomText}{' '}
        <a onClick={onBottomLinkClick} className={styles.link}>
          {bottomLinkText}
        </a>
      </p>
      
    </div>
  );
}

