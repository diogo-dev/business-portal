import { get } from '@/app/api'
import { toast } from 'sonner';
import CategoryClient from '../CategoryClient/CategoryClient';

const getCategories = async () => {
  try {
    // Para usar com token em localStorage, o componente precisa ser client-side
    // Devo mudar para cookies depois
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   throw new Error('User is not authenticated');
    // }

    const response = await get('/category');
    if (!response.ok) {
      throw new Error(`Failed to fetch categories`);
    }

    return await response.json();
  } catch (err: any) {
    toast.error(err.message || 'Failed to fetch categories');
  }
}

export default async function CategoryWrapper() {
  const data = await getCategories();

  return <CategoryClient categories={data} />
}