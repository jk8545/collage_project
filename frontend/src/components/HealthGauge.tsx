"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    score: number;
}

export default function HealthGauge({ score }: Props) {
    let color = 'text-green-500';
    if (score < 40) color = 'text-red-500';
    else if (score < 70) color = 'text-yellow-500';

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-nv-bg-700 rounded-2xl shadow-lg border border-nv-b1">
            < div className ="relative w-32 h-32 flex items-center justify-center">
                < svg className ="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    < circle
                        cx ="50"
                        cy ="50"
                        r ="45"
                        fill ="transparent"
                        stroke ="rgba(34,197,94,0.15)"
                        strokeWidth ="10"
                    />
                    <motion.circle
                        cx="50"
                        cy ="50"
                        r ="45"
                        fill ="transparent"
                        stroke ="currentColor"
                        strokeWidth ="10"
                        strokeDasharray ="283"
                        strokeDashoffset = { 283 - (283 * score) / 100 }
                        className="text-nv-green"
                        initial = {{ strokeDashoffset: 283 }}
                        animate = {{ strokeDashoffset: 283 - (283 * score) / 100 }}
                        transition = {{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    < span className="text-4xl font-syne font-[800] text-nv-green">{ score }</span >
                    <span className="text-xs text-nv-t3 font-medium font-dm">/ 100</span>
                </div >
            </div >
            <p className="mt-4 text-nv-t2 font-semibold font-syne tracking-wide">Health Score</p>
        </div >
  );
}
