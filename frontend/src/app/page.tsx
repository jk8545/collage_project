"use client";

import React, { useState } from "react";
import UploadZone from "@/components/UploadZone";
import HealthGauge from "@/components/HealthGauge";
import RadarChart from "@/components/RadarChart";
import AdditiveCard from "@/components/AdditiveCard";
import { Activity, ShieldAlert, FileText, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/components/AuthProvider";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getApiUrl } from "@/lib/api-config";

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState("General");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </main>
    );
  }

  const handleUploadSuccess = async (url: string) => {
    setLoading(true);
    setError("");
    setLoadingText("Scanning for additives...");

    try {
      setTimeout(() => setLoadingText("Checking FSSAI compliance..."), 1500);
      setTimeout(() => setLoadingText("Personalizing health score..."), 3000);

      const response = await fetch(`${getApiUrl()}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image_url: url,
          user_profile: userProfile,
          metadata: {
            device: "Web",
            user_id: user?.id || null
          }
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Analysis failed");

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 md:p-12 font-sans">
      < div className="max-w-5xl mx-auto">
        < header className="mb-10 flex flex-col items-center text-center space-y-4 relative">
          <div className="absolute right-0 top-0 flex items-center gap-4">
            <Link href="/history" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              History
            </Link>
            {user ? (
              <button onClick={signOut} className="text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full hover:bg-red-500/20 transition-colors">
                Logout
              </button>
            ) : (
              <Link href="/login" className="text-sm font-medium bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                Login
              </Link>
            )}
          </div>
          < h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 pt-8 sm:pt-0">
            NutriVision AI
          </h1 >
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Upload a food label and get an instant, personalized health breakdown powered by AI and FSSAI standards.
          </p >
        </header >

        <div className="grid lg:grid-cols-2 gap-8">
          < div className="space-y-6">
            < div className="bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800">
              < h2 className="text-xl font-bold mb-4 flex items-center">
                < Activity className="w-5 h-5 mr-2 text-indigo-400" />
                Your Health Profile
              </h2 >
              <select
                value={userProfile}
                onChange={(e) => setUserProfile(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
              >
                {
                  ['General', 'Diabetic', 'Hypertension', 'Vegan', 'Keto'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))
                }
              </select >
            </div >

            <div className="bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800">
              < h2 className="text-xl font-bold mb-4 flex items-center">
                < FileText className="w-5 h-5 mr-2 text-blue-400" />
                Analyze Label
              </h2 >
              <UploadZone onUploadSuccess={handleUploadSuccess} onError={setError} />

              {
                error && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                    {error}
                  </div >
                )
              }
            </div >
          </div >

          <div className="bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800 relative overflow-hidden">
            {
              loading ? (
                <div className="absolute inset-0 z-10 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  < div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
                  < h3 className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 animate-pulse">
                    {loadingText}
                  </h3 >
                </div >
              ) : result ? (
                <div className="space-y-6 animate-fade-in-up">
                  < h2 className="text-2xl font-bold flex items-center border-b border-gray-800 pb-4">
                    Analysis Complete
                    < span className="ml-auto text-sm font-normal text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                      Confidence: {(result.confidence_score * 100).toFixed(0)}%
                    </span >
                  </h2 >

                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    < HealthGauge score={result.health_score} />
                    <div className="flex-1">
                      {
                        result.personalized_insight && result.personalized_insight !== "Product matches your health profile well." ? (
                          < div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-200">
                            < ShieldAlert className="w-6 h-6 mb-2 text-orange-400" />
                            < p className="text-sm font-medium">{result.personalized_insight}</p>
                          </div >
                        ) : (
                          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-200">
                            < CheckCircle className="w-6 h-6 mb-2 text-green-400" />
                            < p className="text-sm font-medium">Matches your health profile ({userProfile}).</p>
                          </div >
                        )
                      }
                    </div >
                  </div >

                  <div className="pt-4">
                    < h3 className="text-lg font-bold mb-4">Nutrition Radar</h3>
                    < RadarChart data={result.nutrition_data} />
                  </div >

                  <div className="pt-4">
                    < h3 className="text-lg font-bold mb-4">Extracted Ingredients</h3>
                    <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl flex flex-wrap gap-2 text-sm text-gray-300">
                      {result.ingredients && result.ingredients.length > 0 ? (
                        result.ingredients.map((ing: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-gray-900 border border-gray-700 shadow-sm rounded-lg">{ing}</span>
                        ))
                      ) : (
                        <span className="opacity-50 italic">No ingredients extracted.</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    < h3 className="text-lg font-bold mb-4">Raw OCR Data</h3>
                    <div className="bg-black/40 border border-gray-800 p-4 rounded-xl text-xs sm:text-sm font-mono text-green-400/80 overflow-x-auto shadow-inner h-48 overflow-y-auto">
                      <pre>
                        {JSON.stringify({
                          nutrition: result.nutrition_data,
                          ingredients: result.ingredients || [],
                          additives: result.detected_additives || []
                        }, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {
                    result.detected_additives && result.detected_additives.length > 0 && (
                      <div className="pt-4">
                        <h3 className="text-lg font-bold mb-4">Detected Additives</h3>
                        <div className="space-y-3">
                          {
                            result.detected_additives.map((addy: any, i: number) => (
                              <AdditiveCard key={i} additive={addy} />
                            ))
                          }
                        </div>
                      </div >
                    )
                  }
                </div >
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                  < Activity className="w-24 h-24 text-gray-700 mb-6" />
                  < h3 className="text-xl font-bold text-gray-500">Ready to Analyze</h3>
                  < p className="text-sm text-gray-600 mt-2 max-w-xs">
                    Upload a food product label to reveal hidden ingredients and health scores.
                  </p >
                </div >
              )
            }
          </div >
        </div >
      </div >
    </main >
  );
}
