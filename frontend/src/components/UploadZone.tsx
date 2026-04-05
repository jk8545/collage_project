"use client";

import React, { useCallback, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { UploadCloud } from "lucide-react";

interface UploadZoneProps {
    onUploadSuccess: (url: string) => void;
    onError: (msg: string) => void;
}

export default function UploadZone({ onUploadSuccess, onError }: UploadZoneProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        // Fallback for when Supabase is not configured
        if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock.supabase.co' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
            setTimeout(() => {
                onUploadSuccess(URL.createObjectURL(file));
                setIsUploading(false);
            }, 1000);
            return;
        }

        const fileName = `${Date.now()}-${file.name}`;
        try {
            const { data, error } = await supabase.storage
                .from("food-labels")
                .upload(fileName, file);

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from("food-labels")
                .getPublicUrl(fileName);

            onUploadSuccess(urlData.publicUrl);
        } catch (err: any) {
            onError(err.message || "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 w-full relative">
            {/* Camera Option */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-[rgba(34,197,94,0.35)] rounded-xl bg-[#0f1e0e] hover:border-[rgba(34,197,94,0.6)] hover:bg-[#162615] transition-all cursor-pointer relative group">
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isUploading}
                    aria-label="Take Photo"
                />
                <div className="w-14 h-14 rounded-full bg-nv-green/10 border border-nv-green/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-nv-green-light transition-transform relative">
                    <div className="absolute inset-0 rounded-full border border-nv-green animate-ping opacity-25"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nv-green"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                </div>
                <p className="text-gray-300 font-medium text-center">Use Camera</p>
                <p className="text-xs text-gray-500 mt-1 text-center">Take a live photo</p>
            </div>

            {/* Gallery Option */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-[rgba(34,197,94,0.35)] rounded-xl bg-[#0f1e0e] hover:border-[rgba(34,197,94,0.6)] hover:bg-[#162615] transition-all cursor-pointer relative group">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isUploading}
                    aria-label="Upload Image"
                />
                <div className="w-14 h-14 rounded-full bg-nv-green/10 border border-nv-green/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-nv-green-light transition-transform relative">
                    <div className="absolute inset-0 rounded-full border border-nv-green animate-ping opacity-25"></div>
                    <UploadCloud className="w-6 h-6 text-nv-green" />
                </div>
                <p className="text-gray-300 font-medium text-center">Upload Image</p>
                <p className="text-xs text-gray-500 mt-1 text-center">Choose from gallery</p>
            </div>

            {/* Absolute loading overlay if needed */}
            {isUploading && (
                <div className="absolute inset-0 bg-nv-bg-900/80 rounded-xl flex items-center justify-center z-20 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-nv-green mx-auto mb-2"></div>
                        <p className="text-nv-green-light font-medium text-sm">Uploading securely...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
