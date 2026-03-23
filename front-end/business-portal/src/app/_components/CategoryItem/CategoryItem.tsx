"use client";
import styles from "./CategoryItem.module.css";
import { Category } from "@/app/_types/categoty.type";

interface CategoryItemProps {
  category: Category;
  onDragStart: (category: Category) => void;
  onDragEnd: () => void;
}

export default function CategoryItem({ category, onDragStart, onDragEnd }: CategoryItemProps) {
  return (
    <div
      className={styles.categoryItem}
      draggable
      onDragStart={() => onDragStart(category)}
      onDragEnd={onDragEnd}
    >
      <h3>{category.name}</h3>
    </div>
  );
}