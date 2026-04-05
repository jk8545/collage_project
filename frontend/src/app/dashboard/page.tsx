"use client";

import React, { useEffect, useState } from "react";
import HealthGauge from "@/components/HealthGauge";
import RadarChart from "@/components/RadarChart";
import AdditiveCard from "@/components/AdditiveCard";
import { ShieldAlert, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<string>("General");

  useEffect(() => {
    const storedResult = localStorage.getItem('nutrivision_result');
    const storedProfile = localStorage.getItem('nutrivision_profile');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      router.push("/");
    }
    if (storedProfile) {
      setUserProfile(storedProfile);
    }
  }, [router]);

  if (!result) return null; // Avoid hydration mismatch or rendering empty data

  return (
    <main className="min-h-screen bg-transparent text-nv-t1 p-4 sm:p-6 md:p-12 font-dm overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
        
        <header className="flex flex-wrap gap-4 items-center justify-between border-b border-[rgba(34,197,94,0.15)] pb-6 mb-8 mt-4">
          <Link href="/" className="inline-flex items-center text-sm font-bold bg-nv-bg-700 hover:bg-nv-bg-600 text-nv-t1 py-2 px-4 rounded-[16px] transition-colors border border-nv-b1">
            <ArrowLeft className="w-4 h-4 mr-2 text-nv-green" />
            Back to Scanner
          </Link>
          <div className="text-right">
            <span className="text-sm font-medium text-nv-t3 bg-nv-bg-700 border border-[rgba(34,197,94,0.15)] px-4 py-2 rounded-full shadow-inner">
              Confidence Score: {(result.confidence_score * 100).toFixed(0)}%
            </span>
          </div>
        </header>

        <div className="bg-[#0f1e0e] rounded-[16px] p-6 md:p-10 shadow-2xl border border-[rgba(34,197,94,0.15)] relative z-10 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-nv-green/10 rounded-full blur-[80px] -z-10"></div>
          
          <h2 className="text-3xl md:text-4xl font-syne font-extrabold tracking-tight mb-8 text-nv-green-light">Analysis Summary</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
            <HealthGauge score={result.health_score} />
            <div className="flex-1 w-full">
              {result.personalized_insight && result.personalized_insight !== "Product matches your health profile well." ? (
                <div className="p-6 bg-[rgba(251,191,36,0.12)] border border-[rgba(251,191,36,0.2)] rounded-[16px] text-[#fbbf24] shadow-inner">
                  <ShieldAlert className="w-8 h-8 mb-3" />
                  <p className="text-lg font-dm font-medium">{result.personalized_insight}</p>
                </div>
              ) : (
                <div className="p-6 bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.28)] rounded-[16px] text-[#4ade80] shadow-inner">
                  <CheckCircle className="w-8 h-8 mb-3" />
                  <p className="text-lg font-dm font-medium">Matches your health profile ({userProfile}).</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 pt-8 border-t border-[rgba(34,197,94,0.15)]">
            <div className="bg-[#0f1e0e] p-6 rounded-[16px] border border-[rgba(34,197,94,0.15)]">
              <h3 className="text-xl font-syne font-bold mb-6 text-nv-green">Nutrition Radar</h3>
              <RadarChart data={result.nutrition_data} />
            </div>

            <div className="bg-[#0f1e0e] p-6 rounded-[16px] border border-[rgba(34,197,94,0.15)] flex flex-col">
              <h3 className="text-xl font-syne font-bold mb-6 text-nv-green-light">Extracted Ingredients</h3>
              <div className="flex-1 bg-nv-bg-800 border border-[rgba(34,197,94,0.15)] p-5 rounded-[16px] flex flex-wrap content-start gap-2 text-sm text-nv-t2 shadow-inner overflow-y-auto max-h-[300px]">
                {result.ingredients && result.ingredients.length > 0 ? (
                  result.ingredients.map((ing: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-nv-bg-600 border border-nv-b1 shadow-sm rounded-lg">{ing}</span>
                  ))
                ) : (
                  <span className="opacity-50 italic">No ingredients extracted.</span>
                )}
              </div>
            </div>
          </div>

          {result.detected_additives && result.detected_additives.length > 0 && (
            <div className="pt-10 mt-10 border-t border-[rgba(34,197,94,0.15)]">
              <h3 className="text-2xl font-syne font-bold mb-6 flex items-center text-nv-t1">
                <ShieldAlert className="w-6 h-6 mr-3 text-[#f87171]" />
                Detected Additives
              </h3>
              <div className="space-y-4 bg-nv-bg-800/50 p-6 rounded-[16px] border border-[rgba(34,197,94,0.15)]">
                {result.detected_additives.map((addy: any, i: number) => (
                  <AdditiveCard key={i} additive={addy} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
