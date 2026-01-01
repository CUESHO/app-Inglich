import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getLoginUrl } from "@/const";
import { WORLDS } from "@shared/worlds";
import { Link } from "wouter";
import { Sparkles, Trophy, Zap, Globe, Lock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [language, setLanguage] = useState<"en" | "es">("en");

  const translations = {
    en: {
      title: "Inglich 1, 2 x 3",
      subtitle: "Transform Your English Learning Into An Epic Adventure!",
      description: "Embark on a gamified journey through 8 magical worlds. Master English from A1 to C2 with interactive missions, minigames, and boss battles!",
      selectWorld: "Select Your World",
      chooseAdventure: "Choose your adventure and start mastering English through epic quests and challenges!",
      login: "Start Your Adventure",
      yourProgress: "Your Progress",
      level: "Level",
      xp: "XP",
      coins: "Coins",
      achievements: "Achievements",
      worlds: "Worlds",
      missions: "Missions",
      locked: "Locked",
      unlocked: "Unlocked",
      comingSoon: "Coming Soon",
      welcomeBack: "Welcome back",
      progressToLevel: "Progress to Level",
    },
    es: {
      title: "Inglich 1, 2 x 3",
      subtitle: "¡Transforma tu Aprendizaje de Inglés en una Aventura Épica!",
      description: "Embárcate en un viaje gamificado a través de 8 mundos mágicos. Domina el inglés desde A1 hasta C2 con misiones interactivas, minijuegos y jefes finales!",
      selectWorld: "Selecciona Tu Mundo",
      chooseAdventure: "¡Elige tu aventura y comienza a dominar el inglés a través de misiones épicas y desafíos!",
      login: "Comienza Tu Aventura",
      yourProgress: "Tu Progreso",
      level: "Nivel",
      xp: "XP",
      coins: "Monedas",
      achievements: "Logros",
      worlds: "Mundos",
      missions: "Misiones",
      locked: "Bloqueado",
      unlocked: "Desbloqueado",
      comingSoon: "Próximamente",
      welcomeBack: "Bienvenido de nuevo",
      progressToLevel: "Progreso al Nivel",
    },
  };

  const t = translations[language];

  // Load user progress from database
  const { data: progressData, isLoading: progressLoading } = trpc.progress.getMyProgress.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const unlockWorld = trpc.progress.unlockWorld.useMutation();

  // Auto-unlock Foundation Realm on first login
  useEffect(() => {
    if (isAuthenticated && progressData && !progressData.unlockedWorlds.includes('foundation-realm')) {
      unlockWorld.mutate({ worldId: 'foundation-realm' });
    }
  }, [isAuthenticated, progressData]);

  const userLevel = progressData?.level || 1;
  const userXP = progressData?.totalXp || 0;
  const userCoins = progressData?.coins || 0;
  const userAchievements = progressData?.achievements || 0;
  const xpToNextLevel = 1000;
  const xpProgress = (userXP / xpToNextLevel) * 100;
  const unlockedWorlds = progressData?.unlockedWorlds || ['foundation-realm'];

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center cyber-grid" 
        style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)' }}
      >
        <div 
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4" 
          style={{ borderColor: '#00D9FF', boxShadow: '0 0 20px #00D9FF' }}
        ></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center cyber-grid p-4" 
        style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)' }}
      >
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-float">
          <div className="space-y-4">
            <h1 
              className="text-6xl md:text-7xl font-black neon-text" 
              style={{ color: '#00D9FF', textShadow: '0 0 20px #00D9FF, 0 0 40px #00D9FF' }}
            >
              {t.title}
            </h1>
            <p 
              className="text-2xl md:text-3xl font-bold" 
              style={{ color: '#FF0080', textShadow: '0 0 10px #FF0080' }}
            >
              {t.subtitle}
            </p>
            <p 
              className="text-lg md:text-xl max-w-2xl mx-auto" 
              style={{ color: '#B026FF' }}
            >
              {t.description}
            </p>
          </div>

          <div className="flex gap-4 items-center justify-center">
            <Sparkles 
              className="w-12 h-12 animate-pulse" 
              style={{ color: '#FFD700', filter: 'drop-shadow(0 0 10px #FFD700)' }} 
            />
            <Trophy 
              className="w-12 h-12 animate-pulse" 
              style={{ color: '#B026FF', filter: 'drop-shadow(0 0 10px #B026FF)' }} 
            />
            <Zap 
              className="w-12 h-12 animate-pulse" 
              style={{ color: '#00D9FF', filter: 'drop-shadow(0 0 10px #00D9FF)' }} 
            />
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="game-button text-xl px-8 py-6 font-bold"
              style={{ 
                background: 'linear-gradient(135deg, #00D9FF 0%, #B026FF 100%)', 
                color: '#0a0a1a', 
                boxShadow: '0 0 20px #00D9FF, 0 0 40px #B026FF' 
              }}
              onClick={() => window.location.href = getLoginUrl()}
            >
              <Sparkles className="mr-2 h-6 w-6" />
              {t.login}
            </Button>

            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage("en")}
                style={{
                  background: language === "en" ? '#00D9FF' : 'transparent',
                  color: language === "en" ? '#0a0a1a' : '#00D9FF',
                  borderColor: '#00D9FF',
                  boxShadow: language === "en" ? '0 0 15px #00D9FF' : 'none'
                }}
              >
                🇺🇸 English
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage("es")}
                style={{
                  background: language === "es" ? '#FF0080' : 'transparent',
                  color: language === "es" ? '#0a0a1a' : '#FF0080',
                  borderColor: '#FF0080',
                  boxShadow: language === "es" ? '0 0 15px #FF0080' : 'none'
                }}
              >
                🇲🇽 Español
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: Globe, value: "8", label: t.worlds, color: '#00D9FF' },
              { icon: Trophy, value: "80", label: t.missions, color: '#FF0080' },
              { icon: Sparkles, value: "∞", label: "Minigames", color: '#FFD700' },
              { icon: Zap, value: "AI", label: "Tutor", color: '#B026FF' },
            ].map((stat, index) => (
              <div 
                key={index}
                className="backdrop-blur-sm rounded-lg p-4 shadow-md" 
                style={{ 
                  background: `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.1)`, 
                  border: `1px solid ${stat.color}`, 
                  boxShadow: `0 0 15px ${stat.color}40` 
                }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2" style={{ color: stat.color }} />
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-sm" style={{ color: `${stat.color}CC` }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen cyber-grid" 
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)' }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-lg border-b" 
        style={{ 
          background: 'rgba(10, 10, 26, 0.9)', 
          borderColor: '#00D9FF40',
          boxShadow: '0 0 20px rgba(0, 217, 255, 0.2)'
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 
              className="text-3xl font-black neon-text" 
              style={{ color: '#00D9FF', textShadow: '0 0 10px #00D9FF' }}
            >
              {t.title}
            </h1>
            <div className="flex items-center gap-4">
              <span style={{ color: '#B026FF' }}>
                {t.welcomeBack}, <strong style={{ color: '#00D9FF' }}>{user?.name}</strong>
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage("en")}
                  style={{
                    background: language === "en" ? '#00D9FF20' : 'transparent',
                    color: language === "en" ? '#00D9FF' : '#666',
                    border: language === "en" ? '1px solid #00D9FF' : 'none'
                  }}
                >
                  🇺🇸
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage("es")}
                  style={{
                    background: language === "es" ? '#FF008020' : 'transparent',
                    color: language === "es" ? '#FF0080' : '#666',
                    border: language === "es" ? '1px solid #FF0080' : 'none'
                  }}
                >
                  🇲🇽
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Zap, label: t.level, value: userLevel, color: '#00D9FF' },
            { icon: Sparkles, label: t.xp, value: userXP, color: '#B026FF' },
            { icon: Trophy, label: t.coins, value: userCoins, color: '#FFD700' },
            { icon: Globe, label: t.achievements, value: userAchievements, color: '#FF0080' },
          ].map((stat, index) => (
            <Card 
              key={index}
              style={{ 
                background: 'rgba(26, 10, 46, 0.6)', 
                borderColor: stat.color,
                boxShadow: `0 0 20px ${stat.color}30`
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <stat.icon className="w-10 h-10" style={{ color: stat.color, filter: `drop-shadow(0 0 8px ${stat.color})` }} />
                  <div>
                    <p className="text-sm" style={{ color: `${stat.color}CC` }}>{stat.label}</p>
                    <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* XP Progress Bar */}
        <div 
          className="rounded-lg p-6 mb-8" 
          style={{ 
            background: 'rgba(26, 10, 46, 0.6)', 
            border: '1px solid #00FF9F',
            boxShadow: '0 0 20px rgba(0, 255, 159, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: '#00FF9F' }}>{t.progressToLevel} {userLevel + 1}</span>
            <span style={{ color: '#00FF9F' }}>{userXP} / {xpToNextLevel} XP</span>
          </div>
          <div 
            className="h-4 rounded-full overflow-hidden" 
            style={{ background: 'rgba(0, 255, 159, 0.2)' }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${xpProgress}%`,
                background: 'linear-gradient(90deg, #00FF9F 0%, #00D9FF 100%)',
                boxShadow: '0 0 10px #00FF9F'
              }}
            />
          </div>
        </div>

        {/* World Selection */}
        <div className="mb-8">
          <h2 
            className="text-4xl font-black text-center mb-4 neon-text" 
            style={{ color: '#00D9FF', textShadow: '0 0 20px #00D9FF' }}
          >
            {t.selectWorld}
          </h2>
          <p 
            className="text-center text-lg mb-8" 
            style={{ color: '#B026FF' }}
          >
            {t.chooseAdventure}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORLDS.map((world, index) => {
              const isUnlocked = unlockedWorlds.includes(world.id);

              return (
                <Link key={world.id} href={isUnlocked ? `/world/${world.id}` : "#"}>
                  <Card
                    className="world-card cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden"
                    style={{
                      background: isUnlocked 
                        ? `linear-gradient(135deg, ${world.color}20 0%, ${world.secondaryColor}10 100%)`
                        : 'rgba(50, 50, 50, 0.3)',
                      borderColor: isUnlocked ? world.color : '#444',
                      boxShadow: isUnlocked 
                        ? `0 0 20px ${world.color}40, inset 0 0 20px ${world.color}10`
                        : 'none',
                      opacity: isUnlocked ? 1 : 0.6,
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-5xl">{world.emoji}</span>
                        <Badge
                          style={{
                            background: isUnlocked ? world.color : '#666',
                            color: '#0a0a1a',
                            boxShadow: isUnlocked ? `0 0 10px ${world.color}` : 'none'
                          }}
                        >
                          {isUnlocked ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {t.unlocked}
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              {t.locked}
                            </>
                          )}
                        </Badge>
                      </div>
                      <CardTitle 
                        className="text-xl font-bold" 
                        style={{ color: isUnlocked ? world.color : '#888' }}
                      >
                        {world.name}
                      </CardTitle>
                      <CardDescription 
                        style={{ color: isUnlocked ? world.secondaryColor : '#666' }}
                      >
                        {world.cefrLevel} • {world.difficulty}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p 
                        className="text-sm line-clamp-3" 
                        style={{ color: isUnlocked ? `${world.color}DD` : '#666' }}
                      >
                        {world.description}
                      </p>
                    </CardContent>

                    {!isUnlocked && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
                        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                      >
                        <Lock className="w-16 h-16" style={{ color: '#666' }} />
                      </div>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
