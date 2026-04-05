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
        <main className="min-h-screen bg-transparent text-nv-t1 p-6 md:p-12 font-dm">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 flex items-center gap-4">
                    <Link href="/">
                        <button className="p-2 bg-nv-bg-700 rounded-full hover:bg-nv-bg-600 transition-colors border border-nv-b1">
                            <ArrowLeft className="w-6 h-6 text-nv-green" />
                        </button>
                    </Link>
                    <h1 className="text-4xl font-syne font-extrabold tracking-[-0.02em] text-nv-t1">
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
                    <div className="text-center py-20 text-nv-t3">
                        <Clock className="w-16 h-16 mx-auto mb-4 opacity-50 text-nv-green" />
                        <p className="font-dm">No scans found. Upload a label to get started!</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {history.map((scan) => {
                            let badgeClass = "bg-nv-green/20 text-nv-green-light border border-nv-green/30";
                            if (scan.health_score < 40) badgeClass = "bg-[#f87171]/20 text-[#f87171] border-red-500/30";
                            else if (scan.health_score <= 70) badgeClass = "bg-[#fbbf24]/20 text-[#fbbf24] border-yellow-500/30";

                            return (
                            <div key={scan.id} className="bg-[#0f1e0e] rounded-[14px] p-5 border border-[rgba(34,197,94,0.15)] shadow-xl flex flex-col group hover:border-[rgba(34,197,94,0.3)] hover:brightness-110 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs text-[#86efac] font-dm">
                                        {new Date(scan.timestamp || Date.now()).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-nv-bg-600 text-nv-t2 border border-nv-b1 font-medium font-syne tracking-wide">
                                        {scan.personalized_score ? "Personalized" : "General"}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold font-syne ${badgeClass} inline-block ml-2`}>
                                        {scan.health_score}/100
                                    </span>
                                </div>

                                {/* Dynamic Product Identity row if available from Merged Backend/Frontend logic */}
                                {scan.nutrition_json?.product_name && (
                                    <div className="mb-3 truncate">
                                        <h3 className="font-syne font-bold text-nv-t1 text-lg truncate" title={scan.nutrition_json.product_name}>
                                            {scan.nutrition_json.product_name}
                                        </h3>
                                        <div className="flex gap-2 mt-1">
                                            {scan.nutrition_json.data_sources?.includes("barcode") && (
                                                <span className="text-[10px] bg-nv-green/20 text-nv-green-light px-2 rounded-full font-bold uppercase border border-nv-green/30">
                                                    ⚡ Barcode
                                                </span>
                                            )}
                                            {scan.nutrition_json.data_sources?.includes("ocr") && (
                                                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 rounded-full font-bold uppercase border border-blue-500/30">
                                                    🔍 OCR
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 items-center mb-6">
                                    {scan.image_url ? (
                                        <img src={scan.image_url} alt="Scanned label" className="w-20 h-20 rounded-lg object-cover border border-[rgba(34,197,94,0.2)]" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-lg bg-nv-bg-800 border border-nv-b1 flex items-center justify-center">
                                            <span className="text-nv-green-light/50 text-xs font-syne">No img</span>
                                        </div>
                                    )}
                                    <div className="scale-[0.6] origin-left -ml-4 flex-1">
                                        <HealthGauge score={scan.health_score || 0} />
                                    </div>
                                </div>

                                <div className="mt-auto space-y-2">
                                    <p className="text-sm font-medium text-nv-t2">Target Adds: <span className="text-nv-green-light">{scan.additives_json?.length || 0}</span></p>
                                </div>
                            </div>
                        )})}
                    </div>
                )}
            </div>
        </main>
    );
}
