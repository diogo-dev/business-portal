"use client";

import styles from "./ProfilePicture.module.css";
import { useState } from "react";
import { Avatar } from "@mui/material";
import { LuCamera } from "react-icons/lu";

interface ProfilePictureProps {
  firstName: string;
  occupation: string;
  avatarUrl?: string;
  onFileSelect: (file: File) => void;
}

export function ProfilePicture({ firstName, occupation, avatarUrl, onFileSelect }: ProfilePictureProps) {

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const displaySrc = preview || avatarUrl || undefined;

  return (
    <div className={styles.avatarWrapper}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatarInner}>
          <Avatar
            src={displaySrc}
            sx={{
              width: 110,
              height: 110,
              fontSize: 40,
              fontWeight: 700,
              bgcolor: "hsl(220, 25%, 18%)",
              color: "hsl(150, 60%, 54%)",
            }}
          >
            {/* use user's initials */}
            {!displaySrc && "JD"}
          </Avatar>
        </div>
        <label className={styles.avatarOverlay}>
          <LuCamera className={styles.cameraIcon} />
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className={styles.hiddenInput}
            onChange={handleFileSelect}
          />
        </label>
      </div>

      <p className={styles.avatarName}>{firstName}</p>
      <p className={styles.avatarRole}>{occupation}</p>
    </div>
  );
}