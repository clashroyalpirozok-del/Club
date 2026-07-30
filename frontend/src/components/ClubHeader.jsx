import React, { useState } from "react";
import { Copy, Trophy, Users, Check } from "lucide-react";
import { numberFmt } from "../api";

export default function ClubHeader({ club }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(club.tag).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="club-card relative overflow-hidden rounded-[22px] p-[3px] shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      <div className="relative rounded-[20px] bg-gradient-to-br from-[#3cc0f0] to-[#1f8ed6] px-4 pt-4 pb-4">
        <div className="pointer-events-none absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/25 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center">
            <img src={club.badge} alt={club.name} className="h-full w-full object-contain drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)]" />
          </div>

          <div className="min-w-0">
            <h1 className="font-lilita text-[26px] leading-none text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.35)]">
              {club.name}
            </h1>
            <button
              onClick={handleCopy}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-black/25 px-2.5 py-1 text-[13px] font-semibold text-white/90 transition-colors hover:bg-black/35"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {club.tag}
            </button>
          </div>
        </div>

        <div className="relative mt-3 rounded-xl border border-black/20 bg-[#0f1526]/85 px-3 py-2.5 text-center text-[13.5px] leading-snug text-[#dfe6f2]">
          {club.description}
        </div>

        <div className="relative mt-3 grid grid-cols-3 gap-2">
          <StatBox icon={<Trophy size={13} className="text-[#ffcf3f]" />} label="КУБКИ" value={numberFmt(club.trophies)} valueClass="text-[#ffcf3f]" />
          <StatBox icon={<Users size={13} className="text-[#7ee081]" />} label="СОСТАВ" value={`${club.members}/${club.maxMembers}`} valueClass="text-[#7ee081]" />
          <StatBox label="ТИП" value={club.type} valueClass="text-[#5fd0ff]" />
        </div>

        <div className="relative mt-2 flex items-center justify-between rounded-xl border border-black/20 bg-[#0f1526]/85 px-3.5 py-2.5">
          <span className="text-[12px] font-bold uppercase tracking-wide text-[#9fb0c8]">Порог входа</span>
          <span className="flex items-center gap-1.5 font-lilita text-[18px] text-[#ffcf3f]">
            <Trophy size={16} className="text-[#ffcf3f]" fill="#ffcf3f" />
            {numberFmt(club.requiredTrophies)}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, valueClass }) {
  return (
    <div className="rounded-xl border border-black/20 bg-[#0f1526]/85 px-2.5 py-2">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[10.5px] font-bold uppercase tracking-wide text-[#9fb0c8]">{label}</span>
      </div>
      <div className={`mt-0.5 font-lilita text-[17px] leading-tight ${valueClass}`}>{value}</div>
    </div>
  );
}
