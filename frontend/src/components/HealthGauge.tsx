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
        <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
            < div className ="relative w-32 h-32 flex items-center justify-center">
                < svg className ="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    < circle
    cx ="50"
    cy ="50"
    r ="45"
    fill ="transparent"
    stroke ="#374151"
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
    className = { color }
    initial = {{ strokeDashoffset: 283 }
}
animate = {{ strokeDashoffset: 283 - (283 * score) / 100 }}
transition = {{
    duration: 1.5, ease: "easeOut" }}
        />
        </svg >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            < span className = {`text-4xl font-bold ${color}`
}> { score }</span >
    <span className="text-xs text-gray-400 font-medium">/ 100</span>
        </div >
      </div >
    <p className="mt-4 text-gray-300 font-semibold">Health Score</p>
    </div >
  );
}
