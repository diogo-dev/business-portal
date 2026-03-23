"use client";
import { post } from '@/app/api';
import styles from './LittleCard.module.css';
import { useState } from 'react';
import { LuCheck, LuPlus } from 'react-icons/lu';
import { toast } from 'sonner';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';

interface LittleCardProps {
  label: string;
}

export default function LittleCard({ label }: LittleCardProps) {
  const router = useRouter();
  const [isPlus, setIsPlus] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSumit = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      const [res] = await Promise.all([
        post('/category', { name: inputValue }, token),
        delay(1000) 
      ]);
      if (!res.ok) {
        throw new Error('Failed to create category');
      }

      router.refresh();
      toast.success('Category created successfully!');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
      setInputValue('');
      setIsPlus(false);
    }
  }

  const handleOnClick = () => {
    if (isPlus) {
      handleSumit();
      return;
    } 
    setIsPlus(true);
  }

  return (
    <div className={styles.fieldCard}>
      <div className={styles.fieldContent}>
        <p className={isPlus ? styles.fieldLabel : `${styles.fieldLabel} ${styles.withMargin}`}>{label}</p>
        {isPlus ? (
          <input 
            type="text" 
            className={styles.fieldInput} 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
        ) : (
          <></>
        )}
      </div>
      <button 
        className={styles.editButton} 
        onClick={handleOnClick} 
        disabled={isLoading || (inputValue.trim() === '' && isPlus)}
      >
        {isPlus ? 
          (isLoading ? 
            <CircularProgress 
              size={18}
              sx={{ color: 'hsl(150, 60%, 54%)' }}
            /> 
          : 
            <LuCheck className={styles.icon} /> 
          )
        : 
          <LuPlus className={styles.icon} />
        }
      </button>
    </div>
  )
}

