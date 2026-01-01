import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getWorldById, getMissionsByWorldId } from "@shared/worlds";
import { Link, useParams } from "wouter";
import { ArrowLeft, Star, Trophy, Zap, Lock } from "lucide-react";
import { useState } from "react";

export default function WorldMissions() {
  const { worldId } = useParams<{ worldId: string }>();
  const { user, loading } = useAuth();
  const [language, setLanguage] = useState<"en" | "es">("en");

  const world = worldId ? getWorldById(worldId) : undefined;
  const missions = worldId ? getMissionsByWorldId(worldId) : [];

  const translations = {
    en: {
      backToWorlds: "Back to Worlds",
      missions: "Missions",
      selectMission: "Select a Mission",
      missionDescription: "Choose your challenge and prove your skills!",
      difficulty: "Difficulty",
      reward: "Reward",
      xp: "XP",
      start: "Start Mission",
      locked: "Locked",
      completed: "Completed",
      inProgress: "In Progress",
      worldProgress: "World Progress",
    },
    es: {
      backToWorlds: "Volver a Mundos",
      missions: "Misiones",
      selectMission: "Selecciona una Misión",
      missionDescription: "¡Elige tu desafío y demuestra tus habilidades!",
      difficulty: "Dificultad",
      reward: "Recompensa",
      xp: "XP",
      start: "Comenzar Misión",
      locked: "Bloqueado",
      completed: "Completado",
      inProgress: "En Progreso",
      worldProgress: "Progreso del Mundo",
    },
  };

  const t = translations[language];

  const dynamicIcons: Record<string, string> = {
    "Quiz Master": "🧠",
    "Puzzle Solver": "🧩",
    "Simulation Quest": "🎬",
    "Memory Challenge": "🧠💫",
    "Dialogue Battle": "💬⚔️",
    "Listening Expedition": "👂🗺️",
    "Writing Fortress": "✍️🏰",
    "Pronunciation Duel": "🎤⚔️",
    "Logic Labyrinth": "🧭🔀",
    "Boss Battle": "👹🏆",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!world) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">World Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${world.color}15 0%, ${world.secondaryColor}15 100%)`,
      }}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.backToWorlds}
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-4xl">{world.emoji}</span>
                  <div>
                    <h1 className="text-2xl font-black text-gray-800">
                      {world.name}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {world.cefrLevel} • {world.difficulty}
                    </p>
                  </div>
                </div>
              </div>
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

          {/* World Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.worldProgress}</p>
              <p className="text-sm font-bold text-gray-800">0 / {missions.length} {t.missions}</p>
            </div>
            <Progress value={0} className="h-3" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* World Description */}
        <Card 
          className="mb-8 border-2"
          style={{
            borderColor: world.color,
            background: `linear-gradient(135deg, ${world.color}10 0%, ${world.secondaryColor}10 100%)`,
          }}
        >
          <CardHeader>
            <CardTitle className="text-3xl font-black" style={{ color: world.color }}>
              {t.selectMission}
            </CardTitle>
            <CardDescription className="text-lg">
              {language === "en" ? world.narrative : world.description}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission, index) => {
            const isLocked = index > 0; // For now, only first mission is unlocked
            const isBossBattle = mission.dynamic === "Boss Battle";
            
            return (
              <Link key={mission.id} href={isLocked ? "#" : `/mission/${mission.id}`}>
                <Card 
                  className={`mission-card relative overflow-hidden h-full ${
                    isLocked ? 'opacity-60 cursor-not-allowed' : ''
                  } ${isBossBattle ? 'animate-pulse-glow' : ''}`}
                  style={{
                    background: isBossBattle
                      ? `linear-gradient(135deg, ${world.color} 0%, ${world.accentColor} 100%)`
                      : 'white',
                    borderColor: world.color,
                    borderWidth: isBossBattle ? '3px' : '1px',
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-4xl">{dynamicIcons[mission.dynamic] || "🎮"}</span>
                      {isLocked ? (
                        <Badge variant="secondary" className="bg-gray-700 text-white">
                          <Lock className="w-3 h-3 mr-1" />
                          {t.locked}
                        </Badge>
                      ) : (
                        <Badge 
                          variant="secondary" 
                          style={{ 
                            backgroundColor: world.color,
                            color: 'white',
                          }}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          {t.start}
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className={`text-xl font-bold ${isBossBattle ? 'text-white' : ''}`}>
                      {mission.name}
                    </CardTitle>
                    
                    <CardDescription className={isBossBattle ? 'text-white/90' : ''}>
                      {mission.dynamic}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <p className={`text-sm mb-4 ${isBossBattle ? 'text-white/80' : 'text-gray-600'}`}>
                      {mission.objective}
                    </p>
                    
                    <div className="space-y-2">
                      {/* Difficulty Stars */}
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${isBossBattle ? 'text-white' : 'text-gray-600'}`}>
                          {t.difficulty}:
                        </span>
                        <div className="flex gap-1">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < mission.difficulty
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : isBossBattle
                                  ? 'text-white/30'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* XP Reward */}
                      <div className="flex items-center gap-2">
                        <Trophy className={`w-4 h-4 ${isBossBattle ? 'text-yellow-300' : 'text-yellow-600'}`} />
                        <span className={`text-sm font-bold ${isBossBattle ? 'text-white' : 'text-gray-800'}`}>
                          +{mission.xpReward} {t.xp}
                        </span>
                      </div>
                    </div>
                    
                    {!isLocked && !isBossBattle && (
                      <Button 
                        className="w-full mt-4"
                        style={{ 
                          backgroundColor: world.color,
                          color: 'white',
                        }}
                      >
                        {t.start}
                      </Button>
                    )}
                    
                    {!isLocked && isBossBattle && (
                      <Button 
                        className="w-full mt-4 bg-yellow-500 text-gray-900 font-black hover:bg-yellow-400"
                      >
                        ⚔️ {t.start}
                      </Button>
                    )}
                  </CardContent>
                  
                  {/* Decorative elements */}
                  {isBossBattle && (
                    <div 
                      className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-40"
                      style={{ background: world.accentColor }}
                    />
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
