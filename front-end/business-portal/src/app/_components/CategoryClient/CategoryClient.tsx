"use client";
import styles from "./CategoryClient.module.css";
import { Category } from "@/app/_types/categoty.type";
import { useState } from "react";
import LittleCard from "../LittleCard/LittleCard";
import SearchBar from "../SearchBar/SearchBar";
import CategoryItem from "../CategoryItem/CategoryItem";
import DeleteDropZone from "../DeleteDropZone/DeleteDropZone";
import { toast } from "sonner";
import { del } from "@/app/api";
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';


interface CategoryClientProps {
  categories: Category[];
}

export default function CategoryClient({ categories }: CategoryClientProps) {
  const [query, setQuery] = useState<string>("");
  const [dragging, setDragging] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const filtered = categories.filter((cat) => cat.name.toLowerCase().includes(query.toLowerCase()));

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleDelete = async () => {
    if (!dragging) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      const [res] = await Promise.all([
        del(`/category/${dragging.id}`, token),
        delay(1000)
      ]);
      if (!res.ok) throw new Error("Failed to delete category");

      router.refresh();
      toast.success(`"${dragging.name}" deleted`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    } finally {
      setDragging(null);
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className={styles.middleSection}>
        <LittleCard label='New Category'/>
        {dragging || isLoading ? (
          <DeleteDropZone onDrop={handleDelete} isLoading={isLoading}/>
        ) : (
          <SearchBar 
            placeholder='Search categories...' 
            value={query}  
            onChange={setQuery}
          />
        )}
      </div>

      <div className={styles.container}>
        {filtered.length === 0 ? (
          <div className={styles.noDataMessageStyle}>
            <p>No categories found.</p>
          </div>
        ) : (
          filtered.map((category) => (
            <CategoryItem 
              key={category.name}
              category={category}
              onDragStart={setDragging}
              onDragEnd={() => setDragging(null)}
            />
          ))
        )}
      </div>
    </>
  );
}