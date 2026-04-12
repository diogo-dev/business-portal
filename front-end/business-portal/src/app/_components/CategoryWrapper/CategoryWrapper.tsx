import { get } from '@/app/api'
import CategoryClient from '../CategoryClient/CategoryClient';

const getCategories = async () => {
  try {
    const response = await get('/category');
    if (!response.ok) {
      throw new Error(`Failed to fetch categories`);
    }

    return await response.json();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch categories';
    console.error('Failed to fetch categories:', message);
    return [];
  }
}

export default async function CategoryWrapper() {
  const data = await getCategories();

  return <CategoryClient categories={data} />
}