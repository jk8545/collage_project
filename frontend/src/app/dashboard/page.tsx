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
    <main className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 md:p-12 font-sans overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
        
        <header className="flex flex-wrap gap-4 items-center justify-between border-b border-gray-800 pb-6 mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-bold bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 px-4 rounded-xl transition-colors shadow-lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scanner
          </Link>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-400 bg-gray-900 border border-gray-700 px-4 py-2 rounded-full shadow-inner">
              Confidence Score: {(result.confidence_score * 100).toFixed(0)}%
            </span>
          </div>
        </header>

        <div className="bg-gray-900 rounded-3xl p-6 md:p-10 shadow-2xl border border-gray-800 relative z-10 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10"></div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">Analysis Summary</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
            <HealthGauge score={result.health_score} />
            <div className="flex-1 w-full">
              {result.personalized_insight && result.personalized_insight !== "Product matches your health profile well." ? (
                <div className="p-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-orange-200 shadow-inner">
                  <ShieldAlert className="w-8 h-8 mb-3 text-orange-400" />
                  <p className="text-lg font-medium">{result.personalized_insight}</p>
                </div>
              ) : (
                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-200 shadow-inner">
                  <CheckCircle className="w-8 h-8 mb-3 text-green-400" />
                  <p className="text-lg font-medium">Matches your health profile ({userProfile}).</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 pt-8 border-t border-gray-800">
            <div className="bg-gray-950/50 p-6 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Nutrition Radar</h3>
              <RadarChart data={result.nutrition_data} />
            </div>

            <div className="bg-gray-950/50 p-6 rounded-2xl border border-gray-800 flex flex-col">
              <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Extracted Ingredients</h3>
              <div className="flex-1 bg-gray-900 border border-gray-700 p-5 rounded-xl flex flex-wrap content-start gap-2 text-sm text-gray-300 shadow-inner overflow-y-auto max-h-[300px]">
                {result.ingredients && result.ingredients.length > 0 ? (
                  result.ingredients.map((ing: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-800 border border-gray-600 shadow-sm rounded-lg">{ing}</span>
                  ))
                ) : (
                  <span className="opacity-50 italic">No ingredients extracted.</span>
                )}
              </div>
            </div>
          </div>

          {result.detected_additives && result.detected_additives.length > 0 && (
            <div className="pt-10 mt-10 border-t border-gray-800">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <ShieldAlert className="w-6 h-6 mr-3 text-red-500" />
                Detected Additives
              </h3>
              <div className="space-y-4 bg-gray-950/30 p-6 rounded-2xl border border-gray-800">
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
