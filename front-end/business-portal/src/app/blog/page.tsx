import { Suspense } from 'react';
import FilterCategory from '../_components/FilterCategory/FilterCategory';
import { PublicPostGridWrapper } from '../_components/PublicPostGridWrapper/PublicPostGridWrapper';
import { fetchCategories } from '../_components/CategoryWrapper/CategoryWrapper';
import styles from './page.module.css';

type PublicPostSearchParams = {
  page?: string;
  limit?: string;
  sort?: 'asc' | 'desc';
  categories?: string | string[];
}

export default async function Blog({ searchParams }: { searchParams: Promise<PublicPostSearchParams> }) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = parseInt(params.limit || '9');
  const sort = params.sort || 'desc';
  const selectedCategories = Array.isArray(params.categories)
    ? params.categories
    : params.categories
      ? [params.categories]
      : [];
  const categories = await fetchCategories();

   return (
    <div className={styles.pageContainer}>
      
      <h1 className={styles.pageTitle}>Blog Section</h1>

      <div className={styles.container}>

        <div className={styles.filtersContainer}>
          <FilterCategory
            categories={categories}
            selectedCategories={selectedCategories}
          />
        </div>

        <div className={styles.contentContainer}>
          <div>
            <Suspense fallback={<LoadingState />}>
              <PublicPostGridWrapper 
                page={page}
                limit={limit}
                sort={sort}
                categories={selectedCategories}
              />
            </Suspense>
          </div>
        </div>
      </div>
     </div>
   );
}

function LoadingState() {
  return (
    <div className={styles.noDataMessageStyle}>
      <p>Loading posts...</p>
    </div>
  );
}
