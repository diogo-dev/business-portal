"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import styles from './Header.module.css';
import { useAuth } from '../../_context/AuthContext';
import { FiLogOut } from "react-icons/fi";

export function Header() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show header at top of page
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide header
        setIsVisible(false);
      } else {
        // Scrolling up - show header
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <header className={`${styles.header} ${!isVisible ? styles.hidden : ''}`}>
        <nav className={styles.nav}>
            <div className={styles.leftSection}>
              <Link href="/" className={styles.logoLink}>
                <h1 className={styles.logo}>Business Portal</h1>
              </Link>
            </div>

            {isAuthenticated ? (
                <>
                  <div className={styles.middleSection}>
                    <a href="#home" className={styles.link}>Home</a>
                    <a href="#events" className={styles.link}>Events</a>
                    <a href="#blog" className={styles.link}>Blog</a>
                    <a href="#about" className={styles.link}>About</a>
                    <a href="#contact" className={styles.link}>Contact</a>
                  </div>
                
                  <div className={styles.rightSection}>
                    <span className={styles.userName}>Hello, {user?.userName}</span>
                    <button 
                      className={styles.logoutButton} 
                      onClick={logout}
                      > 
                        <FiLogOut /> 
                        Log out
                    </button>
                  </div>  
          
                </>
            ) : (
              <>
                <div className={styles.middleSection}>
                  <a href="#home" className={styles.link}>Home</a>
                  <a href="#events" className={styles.link}>Events</a>
                  <a href="#blog" className={styles.link}>Blog</a>
                  <a href="#about" className={styles.link}>About</a>
                  <a href="#contact" className={styles.link}>Contact</a>
                </div>
              
                <div className={styles.rightSection}>
                  <button className={styles.button} onClick={() => router.push('/login')}>Sign In</button>
                </div>
              </>
            )}
        </nav>
      </header>
    </>
  );
}


