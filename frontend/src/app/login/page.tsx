"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        // Mock Fallback
        if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock.supabase.co' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
            setTimeout(() => {
                setError("Mock Mode Active: Real Supabase URL required for authentication.");
                setLoading(false);
            }, 1000);
            return;
        }

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage("Check your email for the confirmation link!");
            } else {
                const { error, data } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                if (data.session) {
                    router.push("/");
                    router.refresh();
                }
            }
        } catch (err: any) {
            const code = err?.code || "";
            const msg = (err?.message || "").toLowerCase();
            
            if (code === "invalid_credentials" || msg.includes("invalid") || msg.includes("credential")) {
                setError("Invalid login credentials.");
            } else if (code === "email_not_confirmed" || msg.includes("confirm")) {
                setError("Please confirm your email address first.");
            } else if (code === "user_already_exists" || msg.includes("already registered") || msg.includes("already exist")) {
                setError("This user is already registered.");
            } else if (code === "weak_password" || msg.includes("weak") || msg.includes("password")) {
                setError("Your password is too weak.");
            } else {
                setError("Authentication failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-nv-bg-800 flex flex-col items-center justify-center p-6 sm:p-12 font-dm text-nv-t1 relative overflow-hidden">
            {/* Background Radial Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none flex justify-center items-center">
                <div className="absolute w-[600px] h-[600px] bg-nv-green/10 rounded-full blur-[150px]"></div>
            </div>

            <Link href="/" className="absolute top-8 left-8 text-nv-t3 hover:text-nv-neon transition-colors cursor-pointer z-10 font-bold text-xl flex items-center gap-2 font-syne">
                <span>NutriVision AI</span>
            </Link>

            <div className="w-full max-w-md bg-nv-bg-700 border border-nv-b1 rounded-[20px] p-8 shadow-2xl relative z-10">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-nv-bg-600 border border-nv-b1 mb-4 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                        <ShieldCheck className="w-8 h-8 text-nv-green" />
                    </div>
                    <h1 className="text-3xl font-syne font-bold tracking-tight text-nv-t1 mb-2">
                        {isSignUp ? "Create an Account" : "Welcome Back"}
                    </h1>
                    <p className="text-nv-t3 text-sm">
                        {isSignUp ? "Sign up to securely save your food analysis history." : "Login to access your personalized scanner."}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-nv-red/10 border border-nv-red/20 rounded-xl text-nv-red text-sm text-center font-medium">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="mb-6 p-4 bg-nv-green/10 border border-nv-green/30 rounded-xl text-nv-green-light text-sm text-center font-medium">
                        {message}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-nv-t2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-nv-green/70" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-nv-b2 rounded-xl leading-5 bg-nv-bg-600 text-nv-t1 placeholder-nv-green/40 focus:outline-none focus:ring-1 focus:ring-nv-green focus:border-nv-green sm:text-sm transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-nv-t2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-nv-green/70" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-nv-b2 rounded-xl leading-5 bg-nv-bg-600 text-nv-t1 placeholder-nv-green/40 focus:outline-none focus:ring-1 focus:ring-nv-green focus:border-nv-green sm:text-sm transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.3)] text-base font-syne font-bold text-nv-bg-900 bg-nv-green hover:bg-nv-neon transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-nv-bg-900/30 border-t-nv-bg-900 rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {isSignUp ? "Sign Up" : "Log In"}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <span className="text-nv-t3">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    </span>{" "}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="font-medium text-nv-green-light hover:text-nv-neon transition-colors focus:outline-none"
                    >
                        {isSignUp ? "Log In" : "Sign Up"}
                    </button>
                </div>
            </div>
        </main>
    );
}
