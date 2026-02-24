import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface Additive {
  code: string;
  risk: string;
  note: string;
}

export default function AdditiveCard({ additive }: { additive: Additive }) {
  let riskColor = "bg-green-500/20 text-green-400 border-green-500/30";
  let Icon = CheckCircle;
  const risk = additive.risk.toLowerCase();

  if (risk.includes("high") || risk.includes("danger")) {
    riskColor = "bg-red-500/20 text-red-400 border-red-500/30";
    Icon = AlertCircle;
  } else if (risk.includes("moderate")) {
    riskColor = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    Icon = Info;
  }

  return (
    <div className={`flex items-start p-4 rounded-xl border ${riskColor}`}>
      <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
      <div>
        <div className="flex items-center space-x-2">
          <h4 className="font-bold">{additive.code}</h4>
          <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-black/20">
            {additive.risk}
          </span>
        </div >
        <p className="text-sm mt-1 opacity-90">{additive.note}</p>
      </div >
    </div >
  );
}
