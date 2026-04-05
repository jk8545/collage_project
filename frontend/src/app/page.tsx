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
import { readBarcodeFromFile } from "@/lib/barcodeReader";
import { fetchByBarcode } from "@/lib/openfoodfacts";
import { supabase } from "@/lib/supabaseClient";

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
    // Always clear memory cache when returning to the Scanner to prep for a New Scan
    localStorage.removeItem('nutrivision_result');
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </main>
    );
  }

  const handleUploadSuccess = async (url: string, file: File) => {
    setLoading(true);
    setError("");
    setLoadingText("Analyzing label + scanning barcode...");

    try {
      const [ocrResult, barcodeStringResult] = await Promise.allSettled([
        fetch(`${getApiUrl()}/analyze`, {
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
        }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.detail || "Analysis failed");
          return data;
        }),
        readBarcodeFromFile(file)
      ]);

      let offData = null;
      if (barcodeStringResult.status === 'fulfilled' && barcodeStringResult.value) {
        offData = await fetchByBarcode(barcodeStringResult.value);
      }

      const ocrSuccess = ocrResult.status === 'fulfilled' && !!ocrResult.value;
      const offSuccess = !!offData;

      if (!ocrSuccess && !offSuccess) {
        throw new Error("Could not analyze this image, please try a clearer photo");
      }

      const dataSources = [];
      if (ocrSuccess) dataSources.push("ocr");
      if (offSuccess) dataSources.push("barcode");

      const mergedResult = {
        ...(ocrSuccess ? ocrResult.value : {}),
        data_sources: dataSources,
      };

      if (offData) {
        mergedResult.product_name = offData.product_name || mergedResult.product_name;
        mergedResult.brand = offData.brand;
        mergedResult.quantity = offData.quantity;
        mergedResult.nutri_grade = offData.nutri_grade;
        mergedResult.nova_group = offData.nova_group;
        mergedResult.allergens = offData.allergens;
        mergedResult.off_ingredients_text = offData.ingredients_text;
        mergedResult.official_nutriments = offData.nutriments;
        mergedResult.off_additives_tags = offData.additives || [];
      }

      // Automatically set deterministic Confidence Score to 100% for pristine barcode scans
      if (offData && !mergedResult.confidence_score) {
         mergedResult.confidence_score = 1.0;
      }

      // Save History directly from the frontend securely to include all sources
      if (user && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://mock.supabase.co') {
         const { error: dbErr } = await supabase.from("scan_history").insert({
            user_id: user.id,
            image_url: url,
            nutrition_json: mergedResult,
            additives_json: mergedResult.detected_additives || [],
            health_score: mergedResult.health_score || 50,
            personalized_score: mergedResult.health_score || 50,
         });
         if (dbErr) console.log('History insert failed quietly:', dbErr);
      }

      localStorage.setItem('nutrivision_result', JSON.stringify(mergedResult));
      localStorage.setItem('nutrivision_profile', userProfile);
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-nv-t1 p-4 sm:p-6 md:p-12 font-dm overflow-x-hidden">
      < div className="max-w-5xl mx-auto">
        < header className="mb-8 md:mb-12 flex flex-col items-center text-center space-y-3 relative pt-10">
          < h1 className="text-5xl md:text-6xl font-syne font-extrabold tracking-[-0.02em] text-nv-t1">
            Analyze Label
          </h1 >
          <p className="text-nv-t2 text-lg max-w-2xl mx-auto font-medium">
            Upload a food label and get an instant, personalized health breakdown powered by AI and FSSAI standards.
          </p >
        </header >

        <div className="max-w-3xl mx-auto">
          < div className="space-y-6">
            < div className="bg-nv-bg-700 rounded-2xl p-6 shadow-2xl border border-nv-b1">
              < h2 className="text-xl font-syne font-bold mb-4 flex items-center text-nv-green-light">
                < Activity className="w-5 h-5 mr-2" />
                Your Health Profile
              </h2 >
              <select
                value={userProfile}
                onChange={(e) => setUserProfile(e.target.value)}
                className="w-full bg-nv-bg-600 border border-nv-b2 text-nv-t1 text-base rounded-xl focus:ring-1 focus:ring-nv-green focus:border-nv-green block p-3 outline-none"
              >
                {
                  ['General', 'Diabetic', 'Hypertension', 'Vegan', 'Keto'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))
                }
              </select >
            </div >

            <div className="bg-nv-bg-700 rounded-2xl p-6 shadow-2xl border border-nv-b1">
              < h2 className="text-xl font-syne font-bold mb-5 flex items-center text-nv-green-light">
                < FileText className="w-5 h-5 mr-2" />
                Scan Product
              </h2 >
              <UploadZone onUploadSuccess={handleUploadSuccess} onError={setError} />

              {
                error && (
                  <div className="mt-4 p-3 bg-nv-red/10 border border-nv-red/30 rounded-lg text-nv-red text-sm font-medium">
                    {error}
                  </div >
                )
              }
            </div >
          </div >

          {
            loading && (
              <div className="mt-8 bg-nv-bg-700 rounded-2xl p-6 shadow-2xl border border-nv-b1 h-64 relative overflow-hidden">
                <div className="absolute inset-0 z-10 bg-nv-bg-800/80 backdrop-blur-md flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 rounded-full border-[3px] border-nv-b1"></div>
                    <div className="absolute inset-0 rounded-full border-[3px] border-nv-green border-t-transparent animate-spin"></div>
                  </div>
                  < h3 className="text-xl font-syne font-bold text-center text-nv-green-light animate-pulse">
                    {loadingText}
                  </h3 >
                </div >
              </div>
            )
          }
        </div >
      </div >
    </main >
  );
}
