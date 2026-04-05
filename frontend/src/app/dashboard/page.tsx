"use client";

import React, { useEffect, useState } from "react";
import HealthGauge from "@/components/HealthGauge";
import RadarChart from "@/components/RadarChart";
import AdditiveCard from "@/components/AdditiveCard";
import { ShieldAlert, CheckCircle, ArrowLeft, Info, AlertOctagon, Activity } from "lucide-react";
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

  if (!result) return null;

  const dataSources = result.data_sources || ["ocr"];
  const hasOffData = dataSources.includes("barcode");
  const hasOcrData = dataSources.includes("ocr");

  // Format Additives safely: combine OFF and OCR, deduplicate by code
  const combinedAdditives = Array.from(new Map(
    [...(result.detected_additives || []), ...(result.off_additives_tags || [])].map(item => {
      // normalize codes for deduplication
      const code = item.code || (typeof item === 'string' ? item : JSON.stringify(item));
      const formattedCode = code.replace(/^en:/i, '').toUpperCase();
      const obj = typeof item === 'object' && item.code ? item : { code: formattedCode, risk: 'Moderate', note: 'Detected from barcode database.' };
      return [formattedCode, obj];
    })
  ).values());

  // Format Nutri-Score Color
  let nutriColor = "bg-gray-500 text-white";
  if (result.nutri_grade) {
    const grade = result.nutri_grade.toUpperCase();
    if (grade === 'A') nutriColor = "bg-green-700 text-white";
    if (grade === 'B') nutriColor = "bg-[#4ade80] text-green-900";
    if (grade === 'C') nutriColor = "bg-yellow-400 text-yellow-900";
    if (grade === 'D') nutriColor = "bg-orange-500 text-white";
    if (grade === 'E') nutriColor = "bg-red-600 text-white";
  }

  // Format NOVA Color
  let novaColor = "bg-gray-500 text-white";
  let novaLabel = "Unknown";
  if (result.nova_group) {
    if (result.nova_group === 1) { novaColor = "bg-green-600 text-white"; novaLabel = "Unprocessed"; }
    if (result.nova_group === 2) { novaColor = "bg-yellow-400 text-yellow-900"; novaLabel = "Processed"; }
    if (result.nova_group === 3) { novaColor = "bg-orange-500 text-white"; novaLabel = "Ultra Mix"; }
    if (result.nova_group === 4) { novaColor = "bg-red-600 text-white"; novaLabel = "Ultra-Processed"; }
  }

  return (
    <main className="min-h-screen bg-transparent text-nv-t1 p-4 sm:p-6 md:p-12 font-dm overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
        
        <header className="flex flex-wrap gap-4 items-center justify-between border-b border-[rgba(34,197,94,0.15)] pb-6 mb-8 mt-4">
          <Link href="/" className="inline-flex items-center text-sm font-bold bg-nv-bg-700 hover:bg-nv-bg-600 text-nv-t1 py-2 px-4 rounded-[16px] transition-colors border border-nv-b1">
            <ArrowLeft className="w-4 h-4 mr-2 text-nv-green" />
            Back to Scanner
          </Link>
          <div className="flex gap-2">
            {hasOffData && (
              <span className="inline-flex items-center px-3 py-1 bg-nv-green/20 border border-nv-green/40 text-nv-green-light font-dm rounded-full text-sm font-bold shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                ⚡ Barcode
              </span>
            )}
            {hasOcrData && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 border border-blue-500/40 text-blue-400 font-dm rounded-full text-sm font-bold">
                🔍 OCR
              </span>
            )}
          </div>
        </header>

        <div className="bg-[#0f1e0e] rounded-[16px] p-6 md:p-10 shadow-2xl border border-[rgba(34,197,94,0.15)] relative z-10 overflow-hidden space-y-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-nv-green/10 rounded-full blur-[80px] -z-10"></div>
          
          {/* SECTION 1 — Product Identity */}
          {(result.product_name || result.brand) && (
            <div className="flex flex-col border-b border-nv-b1 pb-8">
              <h1 className="text-4xl md:text-5xl font-syne font-extrabold text-nv-t1">{result.product_name || "Unknown Product"}</h1>
              {result.brand && <p className="text-xl text-nv-t2 mt-2 font-syne">{result.brand} {result.quantity && `• ${result.quantity}`}</p>}
            </div>
          )}

          {/* SECTION 2 — Health Scores */}
          <div>
            <h2 className="text-2xl font-syne font-bold mb-6 text-nv-green-light flex items-center"><Activity className="mr-2" /> Global Health Scoring</h2>
            <div className="flex flex-wrap gap-8 items-center">
              <HealthGauge score={result.health_score || 0} />
              
              {result.nutri_grade && typeof result.nutri_grade === 'string' && result.nutri_grade.trim() !== '' && result.nutri_grade.toLowerCase() !== 'unknown' && (
                <div className="flex flex-col justify-center items-center bg-nv-bg-800 p-6 rounded-2xl border border-nv-b1 h-32 w-32 shadow-inner">
                  <span className="text-sm text-nv-t3 font-medium mb-2 uppercase tracking-wide">Nutri-Score</span>
                  <div className={`text-4xl font-black rounded-lg px-4 py-1 uppercase ${nutriColor}`}>
                    {result.nutri_grade}
                  </div>
                </div>
              )}
              
              {[1, 2, 3, 4].includes(result.nova_group) && (
                <div className="flex flex-col justify-center items-center bg-nv-bg-800 p-6 rounded-2xl border border-nv-b1 h-32 w-48 shadow-inner">
                  <span className="text-sm text-nv-t3 font-medium mb-2 uppercase tracking-wide">NOVA GROUP {result.nova_group}</span>
                  <div className={`text-sm font-bold rounded-full px-4 py-1.5 uppercase tracking-wider ${novaColor}`}>
                    {novaLabel}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 7 — Personalized Insight */}
          {result.personalized_insight && (
            <div className="w-full">
              {result.personalized_insight !== "Product matches your health profile well." && !result.personalized_insight.includes("matches") ? (
                <div className="p-6 bg-[rgba(251,191,36,0.12)] border border-[rgba(251,191,36,0.2)] rounded-[16px] text-[#fbbf24] shadow-inner flex items-start">
                  <ShieldAlert className="w-8 h-8 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg font-syne mb-1">AI Health Warning</h4>
                    <p className="text-base font-dm font-medium">{result.personalized_insight}</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.28)] rounded-[16px] text-[#4ade80] shadow-inner flex items-start">
                  <CheckCircle className="w-8 h-8 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg font-syne mb-1">AI Assessed</h4>
                    <p className="text-base font-dm font-medium">Matches your health profile ({userProfile}).</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3 — Nutrition Facts */}
          {result.official_nutriments && Object.keys(result.official_nutriments).length > 0 && (
            <div>
              <h2 className="text-2xl font-syne font-bold mb-6 text-nv-green-light flex items-center"><Info className="mr-2" /> Nutrition Facts (100g)</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['energy_kcal', 'fat', 'saturated_fat', 'carbohydrates', 'sugars', 'fiber', 'protein', 'salt'].map((n) => {
                  const val = result.official_nutriments[n];
                  if (val === undefined || val === null) return null;
                  return (
                    <div key={n} className="bg-nv-bg-800 border border-nv-b1 p-4 rounded-xl flex flex-col shadow-inner">
                      <span className="text-nv-t3 text-xs uppercase tracking-wider mb-1">{n.replace('_', ' ')}</span>
                      <span className="text-nv-t1 text-xl font-bold font-syne">{val}{n === 'energy_kcal' ? ' kcal' : 'g'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 4 — Ingredients */}
          {(result.off_ingredients_text || result.ingredients?.length > 0) && (
            <div className="grid lg:grid-cols-2 gap-8">
              {result.off_ingredients_text && (
                <div className="bg-[#0f1e0e] p-6 rounded-[16px] border border-[rgba(34,197,94,0.15)] flex flex-col">
                  <h3 className="text-xl font-syne font-bold mb-4 text-nv-green-light">Official Ingredients</h3>
                  <p className="text-nv-t2 text-sm leading-relaxed whitespace-pre-wrap flex-1 bg-nv-bg-800 border border-nv-b1 p-4 rounded-[12px] shadow-inner">{result.off_ingredients_text}</p>
                </div>
              )}
              {result.ingredients?.length > 0 && (
                <div className="bg-[#0f1e0e] p-6 rounded-[16px] border border-[rgba(34,197,94,0.15)] flex flex-col">
                  <h3 className="text-xl font-syne font-bold mb-4 text-blue-400">OCR-Detected Ingredients</h3>
                  <div className="flex-1 bg-nv-bg-800 border border-[rgba(34,197,94,0.15)] p-5 rounded-[12px] flex flex-wrap content-start gap-2 text-sm text-nv-t2 shadow-inner">
                    {result.ingredients.map((ing: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-nv-bg-600 border border-nv-b1 shadow-sm rounded-lg">{ing}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 5 — Allergens */}
          {result.allergens && (
            <div>
              <h2 className="text-2xl font-syne font-bold mb-6 text-nv-t1 flex items-center"><AlertOctagon className="mr-2 text-orange-400" /> Declared Allergens</h2>
              {result.allergens.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {result.allergens.map((alg: string, i: number) => (
                    <span key={i} className="inline-flex items-center px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-bold uppercase tracking-wide text-sm shadow-md">
                      {alg.replace(/^en:/i, '')}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="inline-flex items-center px-4 py-2 bg-nv-green/10 border border-nv-green/30 text-nv-green-light rounded-xl font-medium">
                  <CheckCircle className="w-5 h-5 mr-2" /> No specific allergens explicitly requested or declared in DB.
                </div>
              )}
            </div>
          )}

          {/* SECTION 6 — Additives */}
          {combinedAdditives.length > 0 && (
            <div>
              <h3 className="text-2xl font-syne font-bold mb-6 flex items-center text-nv-t1">
                <ShieldAlert className="w-6 h-6 mr-3 text-[#f87171]" />
                Detected Additives & E-Numbers
              </h3>
              <div className="grid md:grid-cols-2 gap-4 bg-nv-bg-800/50 p-6 rounded-[16px] border border-[rgba(34,197,94,0.15)]">
                {combinedAdditives.map((addy: any, i: number) => (
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
