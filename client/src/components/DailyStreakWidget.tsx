import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Flame, Coins, Trophy, Calendar } from "lucide-react";
import RewardAnimation from "./RewardAnimation";

interface DailyStreakWidgetProps {
  language: "en" | "es";
}

export default function DailyStreakWidget({ language }: DailyStreakWidgetProps) {
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  const { data: streak, refetch } = trpc.streak.getMyStreak.useQuery();
  const checkIn = trpc.streak.checkIn.useMutation({
    onSuccess: (data) => {
      if (data && !data.alreadyCheckedIn) {
        setRewardAmount(data.reward || 0);
        setShowReward(true);
        refetch();
      }
    },
  });

  const translations = {
    en: {
      title: "Daily Streak",
      currentStreak: "Current Streak",
      longestStreak: "Longest Streak",
      totalCheckIns: "Total Check-ins",
      checkInToday: "Check In Today",
      alreadyCheckedIn: "Checked In!",
      days: "days",
      rewardMessage: `You earned ${rewardAmount} coins!`,
    },
    es: {
      title: "Racha Diaria",
      currentStreak: "Racha Actual",
      longestStreak: "Racha Más Larga",
      totalCheckIns: "Registros Totales",
      checkInToday: "Registrarse Hoy",
      alreadyCheckedIn: "¡Registrado!",
      days: "días",
      rewardMessage: `¡Ganaste ${rewardAmount} monedas!`,
    },
  };

  const t = translations[language];

  const isCheckedInToday = () => {
    if (!streak?.lastCheckIn) return false;
    const lastCheckIn = new Date(streak.lastCheckIn);
    const today = new Date();
    return (
      lastCheckIn.getDate() === today.getDate() &&
      lastCheckIn.getMonth() === today.getMonth() &&
      lastCheckIn.getFullYear() === today.getFullYear()
    );
  };

  const checkedIn = isCheckedInToday();

  return (
    <>
      <Card
        style={{
          background: 'linear-gradient(135deg, #FF660020 0%, #FF660010 100%)',
          borderColor: '#FF6600',
          boxShadow: '0 0 20px #FF660040, inset 0 0 20px #FF660010',
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl" style={{ color: '#FF6600' }}>
            <Flame className="w-8 h-8" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6" style={{ color: '#FF6600' }} />
              <span style={{ color: '#B026FF' }}>{t.currentStreak}</span>
            </div>
            <span className="text-3xl font-bold" style={{ color: '#FF6600' }}>
              {streak?.currentStreak || 0} {t.days}
            </span>
          </div>

          {/* Longest Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6" style={{ color: '#FFD700' }} />
              <span style={{ color: '#B026FF' }}>{t.longestStreak}</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#FFD700' }}>
              {streak?.longestStreak || 0} {t.days}
            </span>
          </div>

          {/* Total Check-ins */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6" style={{ color: '#00D9FF' }} />
              <span style={{ color: '#B026FF' }}>{t.totalCheckIns}</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#00D9FF' }}>
              {streak?.totalCheckIns || 0}
            </span>
          </div>

          {/* Check-in Button */}
          <Button
            className="w-full"
            disabled={checkedIn || checkIn.isPending}
            onClick={() => checkIn.mutate()}
            style={{
              background: checkedIn ? '#666' : '#FF6600',
              color: '#0a0a1a',
              boxShadow: checkedIn ? 'none' : '0 0 15px #FF6600',
            }}
          >
            {checkedIn ? (
              <>
                <Flame className="w-4 h-4 mr-2" />
                {t.alreadyCheckedIn}
              </>
            ) : (
              <>
                <Coins className="w-4 h-4 mr-2" />
                {t.checkInToday}
              </>
            )}
          </Button>

          {/* Streak Rewards Info */}
          <div
            className="text-sm text-center p-2 rounded"
            style={{
              background: '#FF660010',
              borderColor: '#FF6600',
              color: '#B026FF',
            }}
          >
            {language === 'en' 
              ? `Keep your streak alive! Earn ${Math.min(10 + (streak?.currentStreak || 0) * 2, 50)} coins tomorrow.`
              : `¡Mantén tu racha! Gana ${Math.min(10 + (streak?.currentStreak || 0) * 2, 50)} monedas mañana.`
            }
          </div>
        </CardContent>
      </Card>

      {/* Reward Animation */}
      <RewardAnimation
        type="coins"
        amount={rewardAmount}
        show={showReward}
        message={t.rewardMessage}
        onComplete={() => setShowReward(false)}
        neonColor="#FF6600"
      />
    </>
  );
}
