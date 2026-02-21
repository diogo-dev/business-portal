"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { get, post } from "../api"
import { useRouter } from "next/navigation";
import { User } from "../_types/user.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, passwordHash: string) => Promise<void>;
  register: (userName: string, email: string, phone: string, passwordHash: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const isAuthenticated = !!user;
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        fetchUserData(token);
    }, []);

    async function fetchUserData(token: string) {
        try {
            setLoading(true);

            const res = await get("/auth/me", token);
            if (!res.ok) throw new Error("Error fetching user data");
            const data = await res.json();

            setUser(data);
        } catch (err) {
            console.error("Error fetching user data:", err);
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, passwordHash: string) {
        const res = await post("auth/login", { email, passwordHash });
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('Login failed:', errorData);
            throw new Error(errorData.message || "Invalid credentials");
        }

        const data = await res.json();
        const token = data.access_token;

        localStorage.setItem("token", token);

        await fetchUserData(token);
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
        router.push('/')
    }

    async function register(userName: string, email: string, phone: string, passwordHash: string) {
        const res = await post("auth/register", { userName, email, phone, passwordHash });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Erro ao fazer registro");
        }

        const data = await res.json();
        const token = data.access_token;
        localStorage.setItem("token", token);
        await fetchUserData(token);
    }

    async function refreshUser() {
        const token = localStorage.getItem("token");
        if (token) {
            await fetchUserData(token);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
  return useContext(AuthContext);
}