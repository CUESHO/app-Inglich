import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getLoginUrl } from "@/const";
import { WORLDS } from "@shared/worlds";
import { Link } from "wouter";
import { Sparkles, Trophy, Zap, Globe } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [language, setLanguage] = useState<"en" | "es">("en");

  const translations = {
    en: {
      title: "Inglich 1, 2 x 3",
      subtitle: "Transform Your English Learning Into An Epic Adventure!",
      description: "Embark on a gamified journey through 8 magical worlds. Master English from A1 to C2 with interactive missions, minigames, and boss battles!",
      selectWorld: "Select Your World",
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
    },
    es: {
      title: "Inglich 1, 2 x 3",
      subtitle: "¡Transforma tu Aprendizaje de Inglés en una Aventura Épica!",
      description: "Embárcate en un viaje gamificado a través de 8 mundos mágicos. Domina el inglés desde A1 hasta C2 con misiones interactivas, minijuegos y jefes finales!",
      selectWorld: "Selecciona Tu Mundo",
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
    },
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-float">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-gray-700">
              {t.subtitle}
            </p>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {t.description}
            </p>
          </div>

          <div className="flex gap-4 items-center justify-center">
            <Sparkles className="w-12 h-12 text-yellow-500 animate-pulse" />
            <Trophy className="w-12 h-12 text-purple-500 animate-pulse" />
            <Zap className="w-12 h-12 text-blue-500 animate-pulse" />
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="game-button bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl px-8 py-6"
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
                className={language === "en" ? "bg-primary text-primary-foreground" : ""}
              >
                🇬🇧 English
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage("es")}
                className={language === "es" ? "bg-primary text-primary-foreground" : ""}
              >
                🇪🇸 Español
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <Globe className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-800">8</p>
              <p className="text-sm text-gray-600">{t.worlds}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <Zap className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-gray-800">80</p>
              <p className="text-sm text-gray-600">{t.missions}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold text-gray-800">50+</p>
              <p className="text-sm text-gray-600">{t.achievements}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-pink-600" />
              <p className="text-2xl font-bold text-gray-800">A1-C2</p>
              <p className="text-sm text-gray-600">CEFR</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header with User Stats */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}! 🎮</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage("en")}
                className={language === "en" ? "bg-primary text-primary-foreground" : ""}
              >
                🇬🇧
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage("es")}
                className={language === "es" ? "bg-primary text-primary-foreground" : ""}
              >
                🇪🇸
              </Button>
            </div>
          </div>

          {/* User Progress Bar */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-100 to-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">{t.level}</p>
                    <p className="text-2xl font-bold text-gray-800">{user?.level || 1}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-100 to-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">{t.xp}</p>
                    <p className="text-2xl font-bold text-gray-800">{user?.totalXp || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">{t.coins}</p>
                    <p className="text-2xl font-bold text-gray-800">{user?.coins || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-100 to-pink-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-pink-600" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">{t.achievements}</p>
                    <p className="text-2xl font-bold text-gray-800">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* XP Progress to Next Level */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Progress to Level {(user?.level || 1) + 1}</p>
              <p className="text-sm font-bold text-gray-800">{user?.totalXp || 0} / {((user?.level || 1) * 1000)} XP</p>
            </div>
            <Progress value={((user?.totalXp || 0) / ((user?.level || 1) * 1000)) * 100} className="h-3" />
          </div>
        </div>
      </header>

      {/* Main Content - World Selector */}
      <main className="container py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
            {t.selectWorld}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === "en" 
              ? "Choose your adventure and start mastering English through epic quests and challenges!"
              : "¡Elige tu aventura y comienza a dominar el inglés a través de misiones épicas y desafíos!"}
          </p>
        </div>

        {/* Worlds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORLDS.map((world, index) => {
            const isLocked = index > 0; // For now, only first world is unlocked
            
            return (
              <Link key={world.id} href={isLocked ? "#" : `/world/${world.id}`}>
                <Card 
                  className={`world-card relative overflow-hidden ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                  style={{
                    background: isLocked 
                      ? 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)'
                      : `linear-gradient(135deg, ${world.color} 0%, ${world.secondaryColor} 100%)`,
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-5xl animate-float">{world.emoji}</span>
                      {isLocked ? (
                        <Badge variant="secondary" className="bg-gray-700 text-white">
                          🔒 {t.locked}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-600 text-white">
                          ✅ {t.unlocked}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-white text-2xl font-black">
                      {world.name}
                    </CardTitle>
                    <CardDescription className="text-white/90 font-semibold">
                      {world.cefrLevel} • {world.difficulty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">
                      {language === "en" ? world.narrative : world.description}
                    </p>
                    
                    {!isLocked && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-white/90">
                          <span>Missions: 0/10</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2 bg-white/20" />
                      </div>
                    )}
                    
                    {isLocked && (
                      <p className="text-white/70 text-xs italic">
                        {language === "en" 
                          ? "Complete previous worlds to unlock"
                          : "Completa los mundos anteriores para desbloquear"}
                      </p>
                    )}
                  </CardContent>
                  
                  {/* Decorative elements */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30"
                    style={{ background: world.accentColor }}
                  />
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-dashed border-purple-300">
            <CardHeader>
              <CardTitle className="text-3xl font-black text-purple-800">
                🎮 {t.comingSoon}
              </CardTitle>
              <CardDescription className="text-lg text-purple-700">
                {language === "en"
                  ? "More worlds, missions, and features are being crafted for your adventure!"
                  : "¡Más mundos, misiones y características están siendo creados para tu aventura!"}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
