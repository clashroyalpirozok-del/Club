import React, { useState } from "react";
import { RefreshCw, ChevronRight, Trophy } from "lucide-react";
import { numberFmt } from "../api";

const ROLE_LABELS = {
  president: "ПРЕЗИДЕНТ",
  vicePresident: "ВИЦЕ-ПРЕЗ.",
  senior: "СТАРЕЙШИНА",
  member: "УЧАСТНИК",
};

const ROLE_STYLES = {
  president: "bg-gradient-to-r from-[#f7b733] to-[#e6902a] text-[#3a2600]",
  vicePresident: "bg-[#e8368f] text-white",
  senior: "bg-[#39c0f0] text-[#06263a]",
  member: "bg-[#3a3f5c] text-[#c7cde0]",
};

function rankColor(rank) {
  if (rank === 1) return "text-[#ffcf3f]";
  if (rank === 2) return "text-[#cfd8e8]";
  if (rank === 3) return "text-[#f0a24a]";
  return "text-[#6f7896]";
}

function Avatar({ src, alt }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0e1224] ring-1 ring-white/10">
      {ok ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" onError={() => setOk(false)} />
      ) : (
        <span className="font-lilita text-[15px] text-[#5b6485]">{(alt || "?").slice(0, 1)}</span>
      )}
    </div>
  );
}

export default function MemberList({ members, onSelect, onRefresh }) {
  const [spin, setSpin] = useState(false);

  const handleRefresh = () => {
    setSpin(true);
    onRefresh && onRefresh();
    setTimeout(() => setSpin(false), 800);
  };

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="font-lilita text-[19px] text-white">
          СОСТАВ <span className="text-[#ffcf3f]">{members.length}</span>
        </h2>
        <button onClick={handleRefresh} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1c2138] text-[#8b93b3] transition-colors hover:text-white">
          <RefreshCw size={16} className={spin ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {members.map((m) => (
          <button
            key={m.tag}
            onClick={() => onSelect(m)}
            className="group flex items-center gap-3 rounded-2xl border border-[#262c47] bg-[#171b30] px-3 py-2.5 text-left transition-colors hover:border-[#39c0f0]/60 hover:bg-[#1b2138]"
          >
            <span className={`w-6 shrink-0 text-center font-lilita text-[18px] ${rankColor(m.rank)}`}>{m.rank}</span>

            <Avatar src={m.icon} alt={m.name} />

            <div className="min-w-0 flex-1">
              <div className="truncate font-lilita text-[16px] leading-tight" style={{ color: m.color }}>{m.name}</div>
              <span className={`mt-1 inline-block rounded-md px-2 py-[2px] text-[10px] font-bold uppercase tracking-wide ${ROLE_STYLES[m.role]}`}>
                {ROLE_LABELS[m.role]}
              </span>
            </div>

            <span className="flex shrink-0 items-center gap-1 rounded-lg bg-gradient-to-b from-[#ffd23f] to-[#f4a521] px-2.5 py-1.5 font-lilita text-[14px] text-[#3a2600]">
              <Trophy size={13} className="text-[#3a2600]" fill="#3a2600" />
              {numberFmt(m.trophies)}
            </span>

            <ChevronRight size={18} className="shrink-0 text-[#5b6485] transition-colors group-hover:text-[#39c0f0]" />
          </button>
        ))}
      </div>
    </div>
  );
}
