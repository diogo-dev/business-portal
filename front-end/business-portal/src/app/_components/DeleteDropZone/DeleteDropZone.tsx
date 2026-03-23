"use client";
import { useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import styles from "./DeleteDropZone.module.css";
import CircularProgress from "@mui/material/CircularProgress";

interface DeleteDropZoneProps {
  onDrop: () => void;
  isLoading?: boolean;
}

export default function DeleteDropZone({ onDrop, isLoading }: DeleteDropZoneProps) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={`${styles.dropZone} ${isOver ? styles.over : ""}`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={() => { setIsOver(false); onDrop(); }}
    >
      {isLoading ? (
        <CircularProgress 
          size={18}
          sx={{ color: 'hsl(150, 60%, 54%)' }}
        /> 
      ) : (
        <>
          <LuTrash2 className={styles.trashIcon} />
          <span className={styles.dropText}>Drop to delete</span>
        </>
      )}
    </div>
  );
}