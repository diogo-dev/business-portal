"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { get, post } from "../api"
import { useRouter } from "next/navigation";
import { User } from "../_types/user.types";
import { toast } from "sonner";
import { hasSessionCookie } from "../_utils/cookies";

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

function getErrorMessage(err: unknown, fallback: string) {
    return err instanceof Error ? err.message : fallback;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const isAuthenticated = !!user;
    
    useEffect(() => {
        if (hasSessionCookie()) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, []);

    async function fetchUserData() {
        try {
            setLoading(true);
            const res = await get("/auth/me");

            if (res.status === 401) {
                setUser(null);
                return;
            }

            if (!res.ok) throw new Error("Error fetching user data");
            const data = await res.json();
            setUser(data);
        } catch (err: unknown) {
            toast.error(getErrorMessage(err, "Error fetching user data"));
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, passwordHash: string) {
        try {
            const res = await post("auth/login", { email, passwordHash });
        
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Invalid credentials");
            }
            await fetchUserData();
        } catch (err: unknown) {
            toast.error(getErrorMessage(err, "Error logging in"));
        }
    }

    async function logout() {
        await post("auth/logout");
        setUser(null);
        router.push("/login");
    }

    async function register(userName: string, email: string, phone: string, passwordHash: string) {
        try {
            const res = await post("auth/register", { email, passwordHash, userName,  profile: { phone } });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Erro ao fazer registro");
            }

            await fetchUserData();
        } catch (err: unknown) {
            toast.error(getErrorMessage(err, "Error logging in"));
        }
    }

    async function refreshUser() {
        await fetchUserData();
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