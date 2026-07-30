import React, { useEffect, useState } from "react";
import { X, Trophy, Crown, Zap, Swords, User, Users, Loader2 } from "lucide-react";
import { numberFmt } from "../api";

function BrawlerImg({ src, alt }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return <div className="flex h-full w-full items-center justify-center font-lilita text-[13px] text-[#5b6485]">{alt}</div>;
  }
  return <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" onError={() => setOk(false)} />;
}

function Content({ profile }) {
  const s = profile.stats;
  const statItems = [
    { icon: <Trophy size={18} className="text-[#ffcf3f]" fill="#ffcf3f" />, value: numberFmt(s.trophies), label: "КУБКИ" },
    { icon: <Crown size={18} className="text-[#e8368f]" fill="#e8368f" />, value: numberFmt(s.record), label: "РЕКОРД" },
    { icon: <Zap size={18} className="text-[#5fd0ff]" fill="#5fd0ff" />, value: numberFmt(s.expLevel), label: "УР. ОПЫТА" },
    { icon: <Swords size={18} className="text-[#7ee081]" />, value: numberFmt(s.wins3v3), label: "ПОБЕДЫ 3х3" },
    { icon: <User size={18} className="text-[#b06cf5]" />, value: numberFmt(s.soloWins), label: "СОЛО ПОБЕДЫ" },
    { icon: <Users size={18} className="text-[#b06cf5]" />, value: numberFmt(s.duoWins), label: "ДУО ПОБЕДЫ" },
  ];

  return (
    <>
      <div className="flex items-center gap-3 rounded-2xl border border-[#2a3050] bg-[#1a2038] px-4 py-3.5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0e1224] ring-2 ring-white/10">
          <BrawlerImg src={profile.icon} alt={profile.name} />
        </div>
        <div className="min-w-0">
          <div className="truncate font-lilita text-[22px] leading-tight" style={{ color: profile.color }}>{profile.name}</div>
          <div className="mt-0.5 text-[13px] font-semibold text-[#8b93b3]">{profile.tag}</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {statItems.map((it, i) => (
          <div key={i} className="flex flex-col items-center rounded-2xl border border-[#2a3050] bg-[#1a2038] px-2 py-3">
            {it.icon}
            <div className="mt-1.5 font-lilita text-[17px] leading-none text-white">{it.value}</div>
            <div className="mt-1 text-[9.5px] font-bold uppercase tracking-wide text-[#8b93b3]">{it.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-3 mt-5 flex items-center justify-between px-1">
        <h4 className="font-lilita text-[18px] text-white">
          БРАВЛЕРЫ <span className="text-[#ffcf3f]">{profile.brawlersCount}</span>
        </h4>
        <span className="rounded-lg bg-[#2b7a3f] px-2.5 py-1 text-[11px] font-bold text-[#c7f9d3]">{profile.maxedInfo}</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {profile.brawlers.map((b, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl border border-[#2a3050] bg-[#1a2038]">
            <span className="absolute left-1.5 top-1.5 z-10 rounded-md bg-gradient-to-b from-[#ffd23f] to-[#f4a521] px-1.5 py-[1px] font-lilita text-[12px] text-[#3a2600]">{b.level}</span>
            <div className="aspect-square w-full overflow-hidden bg-gradient-to-b from-[#232a48] to-[#171c33]">
              <BrawlerImg src={b.img} alt={b.name} />
            </div>
            <div className="px-1 pb-2 pt-1.5 text-center">
              <div className="truncate text-[11px] font-bold uppercase tracking-wide text-white">{b.name}</div>
              <div className="mt-1 flex items-center justify-center gap-1 font-lilita text-[13px] text-[#ffcf3f]">
                <Trophy size={11} fill="#ffcf3f" className="text-[#ffcf3f]" />
                {numberFmt(b.trophies)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function PlayerModal({ profile, loading, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const hasError = profile && profile.error;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="animate-modalIn relative flex max-h-full w-full max-w-[460px] flex-col overflow-hidden bg-[#12162a] shadow-2xl sm:my-4 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#242a45] px-4 py-3.5">
          <h3 className="font-lilita text-[17px] tracking-wide text-white">ПРОФИЛЬ ИГРОКА</h3>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8368f] text-white transition-transform hover:scale-105 active:scale-95">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4">
          {loading && (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-[#9fb0c8]">
              <Loader2 size={30} className="animate-spin text-[#39c0f0]" />
              <span className="font-lilita text-[15px]">ЗАГРУЗКА ПРОФИЛЯ...</span>
            </div>
          )}
          {!loading && hasError && (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-[#9fb0c8]">
              <span className="font-lilita text-[17px] text-[#e8368f]">{profile.name}</span>
              <span className="text-[13px]">Не удалось загрузить профиль игрока.</span>
            </div>
          )}
          {!loading && !hasError && profile && <Content profile={profile} />}
        </div>
      </div>
    </div>
  );
}
