"use client";

import { useState } from "react";
import { AuthForm } from "../_components/AuthForm/AuthForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../_context/AuthContext";

export default function Login() {

  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const fields = [
    { placeholder: "Email", type: "email", name: "email" },
    { placeholder: "Password", type: "password", name: "passwordHash" },
  ];

  async function handleSubmit(data: Record<string, string>) {
    
    try {
      setLoading(true)
      await login(data.email, data.passwordHash);
      toast.success("Login successful!", {duration: 2000});
      setTimeout(() => router.push('/'), 1000);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Email or password invalid", {duration: 2000});
    } finally {
      setLoading(false);
    }

  }

  function handleBottomLinkClick() {
    router.push('/register');
  }

  return (
    <AuthForm
      title="Login"
      fields={fields}
      buttonText="Enter"
      bottomText="Don't have an account?"
      bottomLinkText="Register"
      onSubmit={handleSubmit}
      onBottomLinkClick={handleBottomLinkClick}
      disabled={loading}
    />
  );

}
