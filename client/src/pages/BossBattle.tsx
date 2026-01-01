import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getMissionById, getWorldById } from "@shared/worlds";
import { getCourseByMissionId } from "@shared/courseContent";
import { Link, useParams, useLocation } from "wouter";
import { Trophy, Zap, Skull, Swords, Heart, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function BossBattle() {
  const { missionId } = useParams<{ missionId: string }>();
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [currentPhase, setCurrentPhase] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isPhaseComplete, setIsPhaseComplete] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isBattleComplete, setIsBattleComplete] = useState(false);

  const mission = missionId ? getMissionById(missionId) : undefined;
  const world = mission ? getWorldById(mission.worldId) : undefined;
  const course = missionId ? getCourseByMissionId(missionId) : undefined;
  const bossBattle = course?.bossBattle;

  const translations = {
    en: {
      bossBattle: "Boss Battle",
      phase: "Phase",
      lives: "Lives",
      score: "Score",
      timeLeft: "Time Left",
      seconds: "seconds",
      selectAnswer: "Select your answer",
      submit: "Submit Answer",
      nextPhase: "Next Phase",
      battleComplete: "Battle Complete!",
      victory: "Victory!",
      defeat: "Defeat",
      totalXp: "Total XP Earned",
      backToWorld: "Back to World",
      tryAgain: "Try Again",
      correct: "Correct!",
      incorrect: "Incorrect!",
      explanation: "Explanation",
    },
    es: {
      bossBattle: "Jefe Final",
      phase: "Fase",
      lives: "Vidas",
      score: "Puntuación",
      timeLeft: "Tiempo Restante",
      seconds: "segundos",
      selectAnswer: "Selecciona tu respuesta",
      submit: "Enviar Respuesta",
      nextPhase: "Siguiente Fase",
      battleComplete: "¡Batalla Completada!",
      victory: "¡Victoria!",
      defeat: "Derrota",
      totalXp: "XP Total Ganado",
      backToWorld: "Volver al Mundo",
      tryAgain: "Intentar de Nuevo",
      correct: "¡Correcto!",
      incorrect: "¡Incorrecto!",
      explanation: "Explicación",
    },
  };

  const t = translations[language];

  // Timer effect
  useEffect(() => {
    if (bossBattle && !isPhaseComplete && !isBattleComplete) {
      const phase = bossBattle.phases[currentPhase];
      if (phase.timeLimit && timeLeft === null) {
        setTimeLeft(phase.timeLimit);
      }

      if (timeLeft !== null && timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0) {
        handleTimeout();
      }
    }
  }, [timeLeft, isPhaseComplete, isBattleComplete]);

  const handleTimeout = () => {
    setLives(lives - 1);
    if (lives - 1 <= 0) {
      setIsBattleComplete(true);
    } else {
      setIsPhaseComplete(true);
    }
  };

  const handleSubmit = () => {
    if (!bossBattle || selectedAnswer === null) return;

    const phase = bossBattle.phases[currentPhase];
    const isCorrect = selectedAnswer === phase.challenge.correctAnswer;

    if (isCorrect) {
      setTotalScore(totalScore + phase.xpReward);
      setIsPhaseComplete(true);
    } else {
      setLives(lives - 1);
      if (lives - 1 <= 0) {
        setIsBattleComplete(true);
      } else {
        setIsPhaseComplete(true);
      }
    }
  };

  const handleNextPhase = () => {
    if (!bossBattle) return;

    if (currentPhase < bossBattle.phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
      setSelectedAnswer(null);
      setIsPhaseComplete(false);
      setTimeLeft(null);
    } else {
      setIsBattleComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-purple-900 to-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  if (!mission || !world || !bossBattle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-purple-900 to-black">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Boss Battle Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const phase = bossBattle.phases[currentPhase];
  const progressPercentage = ((currentPhase + 1) / bossBattle.phases.length) * 100;

  // Battle Complete Screen
  if (isBattleComplete) {
    const isVictory = lives > 0 && currentPhase === bossBattle.phases.length - 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-black flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-4 border-yellow-500 animate-pulse-glow">
          <CardHeader className="text-center">
            <div className="text-8xl mb-4">
              {isVictory ? "🏆" : "💀"}
            </div>
            <CardTitle className="text-5xl font-black mb-2">
              {isVictory ? t.victory : t.defeat}
            </CardTitle>
            <CardDescription className="text-2xl">
              {isVictory ? t.battleComplete : "The boss was too powerful..."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200">
                <CardContent className="pt-6 text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-2 text-yellow-600" />
                  <p className="text-sm text-gray-600">{t.totalXp}</p>
                  <p className="text-4xl font-black text-gray-800">{totalScore}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-100 to-red-200">
                <CardContent className="pt-6 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-2 text-red-600" />
                  <p className="text-sm text-gray-600">{t.lives}</p>
                  <p className="text-4xl font-black text-gray-800">{lives}</p>
                </CardContent>
              </Card>
            </div>

            {isVictory && (
              <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 text-center">
                <p className="text-2xl font-bold text-green-800 mb-2">
                  🎉 Congratulations, Champion! 🎉
                </p>
                <p className="text-green-700">
                  You have defeated the {bossBattle.title} and proven your mastery!
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Link href={`/world/${world.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  {t.backToWorld}
                </Button>
              </Link>
              {!isVictory && (
                <Button 
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600"
                  onClick={() => {
                    setCurrentPhase(0);
                    setSelectedAnswer(null);
                    setIsPhaseComplete(false);
                    setTotalScore(0);
                    setLives(3);
                    setTimeLeft(null);
                    setIsBattleComplete(false);
                  }}
                >
                  {t.tryAgain}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b-4 border-yellow-500 sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Skull className="w-12 h-12 text-red-500 animate-pulse" />
              <div>
                <h1 className="text-3xl font-black text-yellow-500">
                  {bossBattle.title}
                </h1>
                <p className="text-sm text-gray-300">
                  {mission.name} • {world.name}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage("en")}
                className={language === "en" ? "bg-yellow-500 text-black" : "text-white"}
              >
                🇬🇧
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage("es")}
                className={language === "es" ? "bg-yellow-500 text-black" : "text-white"}
              >
                🇪🇸
              </Button>
            </div>
          </div>

          {/* Battle Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-2 border-purple-400">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-purple-200">{t.phase}</p>
                <p className="text-2xl font-black text-white">{currentPhase + 1}/{bossBattle.phases.length}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-400">
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart 
                      key={i} 
                      className={`w-6 h-6 ${i < lives ? 'fill-white text-white' : 'text-red-900'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-red-200 mt-1">{t.lives}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-600 to-yellow-800 border-2 border-yellow-400">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-yellow-200">{t.score}</p>
                <p className="text-2xl font-black text-white">{totalScore}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-400">
              <CardContent className="p-3 text-center">
                <Clock className="w-6 h-6 mx-auto text-white" />
                <p className="text-xl font-black text-white">
                  {timeLeft !== null ? timeLeft : '--'}s
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-4 bg-gray-800" />
          </div>
        </div>
      </header>

      {/* Main Battle Content */}
      <main className="container py-12">
        <div className="max-w-3xl mx-auto">
          {/* Phase Card */}
          <Card className="border-4 border-yellow-500 mb-6 animate-pulse-glow">
            <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
              <div className="flex items-center gap-4">
                <Swords className="w-12 h-12" />
                <div className="flex-1">
                  <CardTitle className="text-3xl font-black">
                    {t.phase} {phase.phaseNumber}: {phase.title}
                  </CardTitle>
                  <CardDescription className="text-white/90 text-lg">
                    {phase.description}
                  </CardDescription>
                </div>
                <Badge className="bg-yellow-500 text-black text-lg px-4 py-2">
                  +{phase.xpReward} XP
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Question Card */}
          <Card className="border-2 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl">{phase.challenge.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {phase.challenge.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full text-left justify-start h-auto py-4 text-lg ${
                      isPhaseComplete && index === phase.challenge.correctAnswer
                        ? 'border-green-500 bg-green-50 border-4'
                        : isPhaseComplete && index === selectedAnswer && index !== phase.challenge.correctAnswer
                        ? 'border-red-500 bg-red-50 border-4'
                        : selectedAnswer === index
                        ? 'border-yellow-500 bg-yellow-50 border-4'
                        : 'border-gray-300'
                    }`}
                    onClick={() => !isPhaseComplete && setSelectedAnswer(index)}
                    disabled={isPhaseComplete}
                  >
                    <span className="font-black mr-3 text-2xl">{String.fromCharCode(65 + index)}</span>
                    {option}
                  </Button>
                ))}
              </div>

              {isPhaseComplete && (
                <div className={`mt-6 p-6 rounded-lg border-4 ${
                  selectedAnswer === phase.challenge.correctAnswer 
                    ? 'bg-green-100 border-green-500' 
                    : 'bg-red-100 border-red-500'
                }`}>
                  <p className="font-black text-2xl mb-3">
                    {selectedAnswer === phase.challenge.correctAnswer ? t.correct : t.incorrect}
                  </p>
                  <p className="text-lg mb-2">
                    <strong>{t.explanation}:</strong> {phase.challenge.explanation}
                  </p>
                  {selectedAnswer === phase.challenge.correctAnswer && (
                    <div className="flex items-center gap-2 mt-4">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                      <p className="font-bold text-xl">+{phase.xpReward} XP</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6">
                {!isPhaseComplete ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-xl py-6"
                  >
                    <Zap className="mr-2 h-6 w-6" />
                    {t.submit}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextPhase}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-black text-xl py-6"
                  >
                    {currentPhase < bossBattle.phases.length - 1 ? t.nextPhase : t.battleComplete}
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
