"use client";

import React from 'react';
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface Props {
    data: {
        protein_g: number;
        sugar_g: number;
        fat_g: number;
        sodium_mg: number;
    };
}

export default function RadarChart({ data }: Props) {
    const chartData = [
        { subject: 'Protein', A: data.protein_g, fullMark: 50 },
        { subject: 'Sugar', A: data.sugar_g, fullMark: 50 },
        { subject: 'Fat', A: data.fat_g, fullMark: 50 },
        { subject: 'Sodium (x10)', A: data.sodium_mg / 10, fullMark: 100 },
    ];

    return (
        <div className="w-full h-[300px] bg-gray-900 rounded-xl p-4">
            < ResponsiveContainer width ="100%" height="100%">
                < RechartsRadarChart cx ="50%" cy="50%" outerRadius="80%" data={chartData}>
                    < PolarGrid stroke ="#374151" />
                        < PolarAngleAxis dataKey ="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            < PolarRadiusAxis angle = { 30} domain = { [0, 'dataMax']} tick = {{ fill: '#4B5563' }
} />
    < Radar name ="Nutrition" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
        </RechartsRadarChart >
      </ResponsiveContainer >
    </div >
  );
}
