"use client";
import styles from './FilterCategory.module.css';
import { Category } from '@/app/_types/categoty.type';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface FilterCategoryProps {
  categories: Category[];
  selectedCategories: string[];
}

const FilterCategory = ({ categories, selectedCategories }: FilterCategoryProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>(selectedCategories);

  const handleOnCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelected(values);
  }

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('categories');

    selected.forEach((categorySlug) => {
      params.append('categories', categorySlug);
    });

    params.set('page', '1');
    router.push(`/blog?${params.toString()}`);
  }

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('categories');
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <div className={styles.filterContainer}>
      <label className={styles.label} htmlFor='categoryFilter'>Filtrar por categoria</label>

      <select
        id='categoryFilter'
        className={styles.select}
        multiple
        value={selected}
        onChange={handleOnCategoryChange}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>

      <p className={styles.helperText}>Segure Ctrl (Windows) para selecionar mais de uma categoria.</p>

      <div className={styles.buttonsContainer}>
        <button type='button' className={styles.applyButton} onClick={handleClearFilter}>
          Clear All
        </button>
        
        <button type='button' className={styles.applyButton} onClick={handleApplyFilter}>
          Apply filters
        </button>
      </div>
    </div>
  )
}

export default FilterCategory
