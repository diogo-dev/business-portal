"use client";

import { useState } from "react"; 
import { AuthForm } from "../_components/AuthForm/AuthForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../_context/AuthContext";

export default function Register() {

  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const fields = [
    { placeholder: "Name", type: "text", name: "name" },
    { placeholder: "Email", type: "email", name: "email" },
    { placeholder: "Phone", type: "text", name: "phone" },
    { placeholder: "Password", type: "password", name: "password" },
  ];

  async function handleSubmit(data: Record<string, string>) {
    try {
      setLoading(true)
      await register(data.name, data.email, data.phone, data.password);
      toast.success("Account created successfully!", {duration: 2000});
      setTimeout(() => router.push('/'), 1000);
    } catch (error: any) {
      toast.error(error.message || "Error registering", {duration: 2000});
    } finally {
      setLoading(false);
    }
  }

  function handleBottomLinkClick() {
    router.push('/login');
  }

  return (
    <AuthForm
      title="Register"
      fields={fields}
      buttonText="Register"
      bottomText="Already have an account?"
      bottomLinkText="Login"
      onSubmit={handleSubmit}
      onBottomLinkClick={handleBottomLinkClick}
      disabled={loading}
    />
  );
}
