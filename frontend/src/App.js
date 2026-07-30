import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Zap, Loader2 } from "lucide-react";
import ClubHeader from "./components/ClubHeader";
import MemberList from "./components/MemberList";
import PlayerModal from "./components/PlayerModal";
import { getClub, getPlayer } from "./api";

function App() {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadClub = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getClub();
      setClub(data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClub();
  }, [loadClub]);

  const handleSelect = async (member) => {
    setProfile(null);
    setProfileLoading(true);
    try {
      const p = await getPlayer(member.tag);
      setProfile(p);
    } catch (e) {
      setProfile({ error: true, name: member.name, tag: member.tag });
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d1020] text-white">
        <Zap size={44} className="animate-pulse text-[#ffcf3f]" fill="#ffcf3f" />
        <div className="mt-4 flex items-center gap-2 font-lilita text-[18px] tracking-wide text-[#9fb0c8]">
          <Loader2 size={18} className="animate-spin" /> ЗАГРУЗКА КЛУБА...
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d1020] px-6 text-center text-white">
        <div className="font-lilita text-[20px] text-[#e8368f]">Ошибка загрузки</div>
        <p className="mt-2 max-w-xs text-[14px] text-[#9fb0c8]">Не удалось получить данные клуба. Попробуйте позже.</p>
        <button onClick={loadClub} className="mt-4 rounded-xl bg-[#39c0f0] px-5 py-2 font-lilita text-[#06263a]">Обновить</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1020] text-white">
      <div className="mx-auto w-full max-w-[460px] px-3 pb-10 pt-4">
        <ClubHeader club={club} />
        <MemberList members={club.membersList} onSelect={handleSelect} onRefresh={loadClub} />
      </div>

      {(profile || profileLoading) && (
        <PlayerModal
          profile={profile}
          loading={profileLoading}
          onClose={() => { setProfile(null); setProfileLoading(false); }}
        />
      )}
    </div>
  );
}

export default App;
