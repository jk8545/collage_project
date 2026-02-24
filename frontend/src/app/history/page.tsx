"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import HealthGauge from "@/components/HealthGauge";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) return; // Wait for auth to initialize

        async function fetchHistory() {
            // Mock Fallback
            if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock.supabase.co' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
                setHistory([{
                    id: 1,
                    timestamp: Date.now(),
                    health_score: 85,
                    personalized_score: true,
                    additives_json: [{ code: "E300" }, { code: "E330" }],
                    image_url: null
                }]);
                setLoading(false);
                return;
            }

            if (!user) {
                setHistory([]);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from("scan_history")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("timestamp", { ascending: false });

                if (error) throw error;
                setHistory(data || []);
            } catch (err: any) {
                console.error("Error fetching history:", err.message);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, [user, authLoading]);

    return (
        <main className="min-h-screen bg-gray-950 text-white p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 flex items-center gap-4">
                    <Link href="/">
                        <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    </Link>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                        Scan History
                    </h1>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : !user ? (
                    <div className="text-center py-20 text-gray-500">
                        <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="mb-4">You must be logged in to view and save scan history.</p>
                        <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">
                            Login Now
                        </Link>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No scans found. Upload a label to get started!</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {history.map((scan) => (
                            <div key={scan.id} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 shadow-xl flex flex-col group hover:border-blue-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs text-gray-400">
                                        {new Date(scan.timestamp || Date.now()).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                                        {scan.personalized_score ? "Personalized" : "General"}
                                    </span>
                                </div>

                                <div className="flex gap-4 items-center mb-6">
                                    {scan.image_url ? (
                                        <img src={scan.image_url} alt="Scanned label" className="w-20 h-20 rounded-lg object-cover border border-gray-700" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                                            <span className="text-gray-500 text-xs">No img</span>
                                        </div>
                                    )}
                                    <div className="transform scale-75 origin-left">
                                        <HealthGauge score={scan.health_score || 0} />
                                    </div>
                                </div>

                                <div className="mt-auto space-y-2">
                                    <p className="text-sm font-medium text-gray-300">Target Adds: {scan.additives_json?.length || 0}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
