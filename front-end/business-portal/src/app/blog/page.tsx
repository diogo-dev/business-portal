import { PublicPostGridWrapper } from '../_components/PublicPostGridWrapper/PublicPostGridWrapper';
import SearchBar  from '../_components/SearchBar/SearchBar';
import styles from './page.module.css';

type PublicPostSearchParams = {
  page?: string;
  limit?: string;
}

export default async function Blog({ searchParams }: { searchParams: Promise<PublicPostSearchParams> }) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = parseInt(params.limit || '9');

   return (
    <div className={styles.container}>
      <div className={styles.filtersContainer}>
        {/* Filter options with categories */}
      </div>

      <div className={styles.contentContainer}>
        <div>
          <SearchBar />
        </div>
        <div>
          <PublicPostGridWrapper 
            page={page}
            limit={limit}
          />
        </div>
      </div>
    </div>
   );
}
