import { get } from '@/app/api'
import { Category } from '@/app/_types/categoty.type';
import CategoryClient from '../CategoryClient/CategoryClient';

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await get('/category');
    if (!response.ok) {
      throw new Error(`Failed to fetch categories`);
    }

    return (await response.json()) as Category[];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch categories';
    console.error('Failed to fetch categories:', message);
    return [];
  }
}

export default async function CategoryWrapper() {
  const data = await fetchCategories();

  return <CategoryClient categories={data} />
}