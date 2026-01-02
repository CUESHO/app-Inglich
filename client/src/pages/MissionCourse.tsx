import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMissionById, getWorldById } from "@shared/worlds";
import { getCourseByMissionId } from "@shared/courseContent";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Trophy, Zap, Clock, BookOpen, Gamepad2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Streamdown } from "streamdown";
import TextConstructionGame from "@/components/TextConstructionGame";
import MatchingGame from "@/components/MatchingGame";
import VoicePracticeRecorder from "@/components/VoicePracticeRecorder";
import BlockCompletionChecklist from "@/components/BlockCompletionChecklist";
import { trpc } from "@/lib/trpc";

export default function MissionCourse() {
  const { missionId } = useParams<{ missionId: string }>();
  const { user, loading } = useAuth();
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [completedBlocks, setCompletedBlocks] = useState<Set<number>>(new Set());
  const [blockScores, setBlockScores] = useState<Map<number, { correct: number; total: number }>>(new Map());
  const [showChecklist, setShowChecklist] = useState(false);
  const [currentBlockScore, setCurrentBlockScore] = useState({ correct: 0, total: 0 });
  const [minigameCompleted, setMinigameCompleted] = useState(false);
  const [showBackButton, setShowBackButton] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [blockResetKey, setBlockResetKey] = useState(0);
  
  // Auto-hide navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setShowBackButton(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setShowBackButton(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const mission = missionId ? getMissionById(missionId) : undefined;
  const world = mission ? getWorldById(mission.worldId) : undefined;
  
  // Generate course content dynamically using AI
  const generateContent = trpc.content.generateMissionContent.useMutation();
  const [course, setCourse] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate content when mission loads
  useState(() => {
    if (mission && world && !course && !isGenerating) {
      setIsGenerating(true);
      generateContent.mutateAsync({
        missionId: mission.id,
        worldId: world.id,
        worldName: world.name,
        worldTheme: world.description,
        cefrLevel: world.cefrLevel,
        missionTitle: mission.name,
        missionObjective: mission.objective,
      }).then((data: any) => {
        setCourse(data);
        setIsGenerating(false);
      }).catch((error: any) => {
        console.error('Failed to generate course:', error);
        setIsGenerating(false);
        // Fallback to static content
        setCourse(getCourseByMissionId(missionId!));
      });
    }
  });

  const translations = {
    en: {
      backToMissions: "Back to Missions",
      courseProgress: "Course Progress",
      estimatedTime: "Estimated Time",
      minutes: "minutes",
      blocks: "Blocks",
      currentBlock: "Current Block",
      nextBlock: "Next Block",
      previousBlock: "Previous Block",
      completeBlock: "Complete Block",
      startBossBattle: "Start Boss Battle",
      minigame: "Minigame",
      quiz: "Quiz",
      instructions: "Instructions",
      submit: "Submit Answer",
      correct: "Correct!",
      incorrect: "Incorrect",
      tryAgain: "Try Again",
      explanation: "Explanation",
      xpEarned: "XP Earned",
      blockCompleted: "Block Completed!",
    },
    es: {
      backToMissions: "Volver a Misiones",
      courseProgress: "Progreso del Curso",
      estimatedTime: "Tiempo Estimado",
      minutes: "minutos",
      blocks: "Bloques",
      currentBlock: "Bloque Actual",
      nextBlock: "Siguiente Bloque",
      previousBlock: "Bloque Anterior",
      completeBlock: "Completar Bloque",
      startBossBattle: "Comenzar Jefe Final",
      minigame: "Minijuego",
      quiz: "Quiz",
      instructions: "Instrucciones",
      submit: "Enviar Respuesta",
      correct: "¡Correcto!",
      incorrect: "Incorrecto",
      tryAgain: "Intentar de Nuevo",
      explanation: "Explicación",
      xpEarned: "XP Ganado",
      blockCompleted: "¡Bloque Completado!",
    },
  };

  const t = translations[language];

  // Get final course (generated or fallback)
  const finalCourse = course || (missionId ? getCourseByMissionId(missionId) : null);

  const handleCompleteBlock = () => {
    // Calculate total activities: quiz questions + minigame (if present)
    const hasMinigame = currentBlock.minigame ? 1 : 0;
    const totalActivities = currentBlockScore.total + hasMinigame;
    const correctActivities = currentBlockScore.correct + (minigameCompleted ? 1 : 0);
    
    const percentage = totalActivities > 0 ? (correctActivities / totalActivities) * 100 : 0;
    
    // Update score to include minigame
    const finalScore = {
      correct: correctActivities,
      total: totalActivities
    };
    
    // Save score for this block
    setBlockScores(prev => {
      const newScores = new Map(prev);
      newScores.set(currentBlockIndex, finalScore);
      return newScores;
    });
    
    // Update current block score for display
    setCurrentBlockScore(finalScore);
    
    // Show checklist
    setShowChecklist(true);
    
    // Only mark as completed if score >= 70%
    if (percentage >= 70) {
      setCompletedBlocks(prev => new Set(prev).add(currentBlockIndex));
    }
  };
  
  const handleContinueAfterChecklist = () => {
    setShowChecklist(false);
    const percentage = currentBlockScore.total > 0 ? (currentBlockScore.correct / currentBlockScore.total) * 100 : 0;
    
    if (percentage >= 70 && finalCourse && currentBlockIndex < finalCourse.blocks.length - 1) {
      // Move to next block
      setCurrentBlockIndex(currentBlockIndex + 1);
      setCurrentBlockScore({ correct: 0, total: 0 });
      setMinigameCompleted(false);
    } else if (percentage < 70) {
      // Reset current block score for retry
      setCurrentBlockScore({ correct: 0, total: 0 });
      setMinigameCompleted(false);
      // Force complete reset of all components by changing key
      setBlockResetKey(prev => prev + 1);
    }
  };
  
  const handleQuizAnswer = (isCorrect: boolean) => {
    setCurrentBlockScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNextBlock = () => {
    if (finalCourse && currentBlockIndex < finalCourse.blocks.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
      setCurrentBlockScore({ correct: 0, total: 0 });
      setMinigameCompleted(false);
    }
  };

  const handlePreviousBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    }
  };

  if (loading || isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mx-auto mb-4" style={{ borderColor: '#00D9FF' }}></div>
          <p className="text-xl" style={{ color: '#B026FF' }}>
            {isGenerating ? (language === 'en' ? 'Generating course content...' : 'Generando contenido del curso...') : (language === 'en' ? 'Loading...' : 'Cargando...')}
          </p>
        </div>
      </div>
    );
  }

  if (!mission || !world) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#00D9FF' }}>Mission Not Found</h1>
          <Link href="/">
            <Button style={{ background: '#B026FF', color: 'white' }}>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // finalCourse is already declared above
  
  if (!finalCourse || !finalCourse.blocks || finalCourse.blocks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#FF0080' }}>Course Content Not Available</h1>
          <p className="mb-4" style={{ color: '#B026FF' }}>Unable to load course content for this mission.</p>
          <Link href={`/world/${world.id}`}>
            <Button style={{ background: '#B026FF', color: 'white' }}>Back to Missions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentBlock = finalCourse.blocks[currentBlockIndex];
  const progressPercentage = ((completedBlocks.size / finalCourse.blocks.length) * 100);

  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${world.color}10 0%, ${world.secondaryColor}10 100%)`,
      }}
    >
      {/* Header */}
      <header 
        className={`bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky z-50 transition-all duration-300 ${
          showBackButton ? 'top-0' : '-top-24'
        }`}
      >
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/world/${world.id}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.backToMissions}
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{world.emoji}</span>
                  <div>
                    <h1 className="text-xl font-black text-gray-800">
                      {mission.name}
                    </h1>
                    <p className="text-xs text-gray-600">
                      {world.name} • {mission.dynamic}
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

          {/* Course Progress */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">{t.estimatedTime}</p>
                <p className="text-sm font-bold text-gray-800">{finalCourse.estimatedTime} {t.minutes}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">{t.blocks}</p>
                <p className="text-sm font-bold text-gray-800">{completedBlocks.size} / {finalCourse.blocks.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-600">{t.xpEarned}</p>
                <p className="text-sm font-bold text-gray-800">0 XP</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.courseProgress}</p>
              <p className="text-sm font-bold text-gray-800">{Math.round(progressPercentage)}%</p>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Block Navigation Tabs */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black" style={{ color: world.color }}>
                    {currentBlock.title}
                  </CardTitle>
                  {currentBlock.subtitle && (
                    <CardDescription className="text-lg mt-1">
                      {currentBlock.subtitle}
                    </CardDescription>
                  )}
                </div>
                <Badge 
                  variant="secondary"
                  style={{ backgroundColor: world.color, color: 'white' }}
                >
                  {currentBlockIndex + 1} / {finalCourse.blocks.length}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Block Content */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                <Streamdown>{currentBlock.content}</Streamdown>
              </div>
            </CardContent>
          </Card>

          {/* Minigame Section */}
          {currentBlock.minigame && (
            <Card 
              className="mb-6 border-2"
              style={{ borderColor: world.color }}
            >
              <CardHeader style={{ background: `${world.color}15` }}>
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-6 h-6" style={{ color: world.color }} />
                  <CardTitle className="text-xl font-bold" style={{ color: world.color }}>
                    {t.minigame}: {currentBlock.minigame.title}
                  </CardTitle>
                </div>
                <CardDescription>
                  {currentBlock.minigame.instructions}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <MinigameRenderer 
                  key={`minigame-${currentBlockIndex}-${blockResetKey}`}
                  minigame={currentBlock.minigame} 
                  worldColor={world.color}
                  translations={t}
                  onComplete={() => setMinigameCompleted(true)}
                />
              </CardContent>
            </Card>
          )}

          {/* Quiz Section */}
          {currentBlock.quiz && currentBlock.quiz.length > 0 && (
            <Card 
              className="mb-6 border-2"
              style={{ borderColor: world.accentColor }}
            >
              <CardHeader style={{ background: `${world.accentColor}15` }}>
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6" style={{ color: world.accentColor }} />
                  <CardTitle className="text-xl font-bold" style={{ color: world.accentColor }}>
                    {t.quiz}: Block Assessment
                  </CardTitle>
                </div>
                <CardDescription>
                  Test your knowledge from this block!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <QuizRenderer 
                  key={`quiz-${currentBlockIndex}-${blockResetKey}`}
                  questions={currentBlock.quiz} 
                  worldColor={world.accentColor}
                  translations={t}
                  onAnswer={handleQuizAnswer}
                />
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePreviousBlock}
              disabled={currentBlockIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.previousBlock}
            </Button>

            {completedBlocks.has(currentBlockIndex) ? (
              currentBlockIndex < finalCourse.blocks.length - 1 ? (
                <Button
                  onClick={handleNextBlock}
                  style={{ backgroundColor: world.color, color: 'white' }}
                >
                  {t.nextBlock}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Link href={`/boss-battle/${mission.id}`}>
                  <Button
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-black"
                  >
                    ⚔️ {t.startBossBattle}
                  </Button>
                </Link>
              )
            ) : (
              <Button
                onClick={handleCompleteBlock}
                style={{ backgroundColor: world.color, color: 'white' }}
              >
                <Trophy className="mr-2 h-4 w-4" />
                {t.completeBlock}
              </Button>
            )}
          </div>
        </div>
      </main>
      
      {/* Block Completion Checklist Modal */}
      {showChecklist && (
        <BlockCompletionChecklist
          correct={currentBlockScore.correct}
          total={currentBlockScore.total}
          worldColor={world?.color || '#00f0ff'}
          onContinue={handleContinueAfterChecklist}
          language={language}
        />
      )}
    </div>
  );
}

// Minigame Renderer Component
function MinigameRenderer({ minigame, worldColor, translations, onComplete }: any) {
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Reset minigame state when minigame changes (new block)
  useEffect(() => {
    setUserAnswer(null);
    setIsCorrect(null);
  }, [minigame]);

  const handleSubmit = () => {
    // Simple check for now - will be enhanced later
    setIsCorrect(true);
    if (onComplete) {
      onComplete();
    }
  };

  if (minigame.type === "matching") {
    if (!minigame.data || !minigame.data.pairs || !Array.isArray(minigame.data.pairs) || minigame.data.pairs.length === 0) {
      return (
        <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-400 font-semibold">Error: Invalid minigame data for matching game</p>
          <p className="text-sm text-red-300 mt-2">Expected structure: pairs array with left, right, correctMatch fields</p>
        </div>
      );
    }
    // Validate each pair has required fields
    const isValid = minigame.data.pairs.every((pair: any) => 
      pair && typeof pair.left === 'string' && typeof pair.right === 'string'
    );
    if (!isValid) {
      return (
        <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-400 font-semibold">Error: Invalid pair structure in matching game</p>
          <p className="text-sm text-red-300 mt-2">Each pair must have 'left' and 'right' string fields</p>
        </div>
      );
    }
    return (
      <MatchingGame
        pairs={minigame.data.pairs}
        neonColor={worldColor}
        xpReward={minigame.xpReward}
        onComplete={(isCorrect) => {
          setIsCorrect(isCorrect);
          if (isCorrect) {
            console.log(`Awarded ${minigame.xpReward} XP`);
            if (onComplete) {
              onComplete();
            }
          }
        }}
      />
    );
  }

  if (minigame.type === "text-construction") {
    if (!minigame.data || !minigame.data.words || !Array.isArray(minigame.data.words)) {
      return (
        <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-400 font-semibold">Error: Invalid minigame data for text-construction game</p>
        </div>
      );
    }
    return (
      <TextConstructionGame
        question={minigame.data.question}
        words={minigame.data.words}
        correctOrder={minigame.data.correctOrder}
        neonColor={worldColor}
        onComplete={(isCorrect) => {
          setIsCorrect(isCorrect);
          if (isCorrect) {
            // Award XP
            console.log(`Awarded ${minigame.xpReward} XP`);
            if (onComplete) {
              onComplete();
            }
          }
        }}
      />
    );
  }

  if (minigame.type === "dialogue-choice") {
    if (!minigame.data || !minigame.data.options || !Array.isArray(minigame.data.options)) {
      return (
        <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-400 font-semibold">Error: Invalid minigame data for dialogue-choice game</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <Card className="bg-gray-100">
          <CardContent className="pt-6">
            <p className="text-lg font-semibold mb-2">{minigame.data.scenario}</p>
            <p className="text-xl font-bold" style={{ color: worldColor }}>
              "{minigame.data.dialogue}"
            </p>
          </CardContent>
        </Card>
        <div className="space-y-2">
          {minigame.data.options.map((option: string, index: number) => (
            <Button
              key={index}
              variant="outline"
              className="w-full text-left justify-start h-auto py-4"
              onClick={() => {
                setUserAnswer(index);
                const correct = minigame.data.correctAnswers.includes(index);
                setIsCorrect(correct);
                if (correct && onComplete) {
                  onComplete();
                }
              }}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + index)})</span>
              {option}
            </Button>
          ))}
        </div>
        {isCorrect !== null && (
          <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
            <p className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{isCorrect ? translations.correct : translations.incorrect}</p>
            <p className={`text-sm mt-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>{minigame.data.feedback[userAnswer]}</p>
            <p className={`text-sm font-bold mt-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>+{minigame.xpReward} {translations.xpEarned}</p>
          </div>
        )}
      </div>
    );
  }

  if (minigame.type === "pronunciation-practice") {
    if (!minigame.data || !minigame.data.targetPhrase) {
      return (
        <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-400 font-semibold">Error: Invalid minigame data for pronunciation-practice</p>
        </div>
      );
    }
    return (
      <VoicePracticeRecorder
        targetPhrase={minigame.data.targetPhrase}
        missionId={minigame.data.missionId || "default"}
        neonColor={worldColor}
        onComplete={(score) => {
          setIsCorrect(score >= 70);
          console.log(`Pronunciation score: ${score}`);
          if (score >= 70 && onComplete) {
            onComplete();
          }
        }}
      />
    );
  }

  return (
    <div className="text-center text-gray-500">
      Minigame type "{minigame.type}" coming soon!
    </div>
  );
}

// Quiz Renderer Component
function QuizRenderer({ questions, worldColor, translations, onAnswer }: any) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // Reset quiz state when questions change (new block)
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
  }, [questions]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    setIsAnswered(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + currentQuestion.xpReward);
    }
    // Notify parent component about the answer
    if (onAnswer) {
      onAnswer(isCorrect);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline">
          Question {currentQuestionIndex + 1} / {questions.length}
        </Badge>
        <Badge style={{ backgroundColor: worldColor, color: 'white' }}>
          Score: {score} XP
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {currentQuestion.options.map((option: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                className={`w-full text-left justify-start h-auto py-4 ${
                  isAnswered && index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswer
                    ? 'border-red-500 bg-red-50'
                    : selectedAnswer === index
                    ? 'border-primary bg-primary/10'
                    : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + index)})</span>
                {option}
              </Button>
            ))}
          </div>

          {isAnswered && (
            <div className={`mt-4 p-4 rounded-lg border ${
              selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'
            }`}>
              <p className={`font-bold mb-2 ${
                selectedAnswer === currentQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'
              }`}>
                {selectedAnswer === currentQuestion.correctAnswer ? translations.correct : translations.incorrect}
              </p>
              <p className={`text-sm ${
                selectedAnswer === currentQuestion.correctAnswer ? 'text-green-300' : 'text-red-300'
              }`}>
                <strong>{translations.explanation}:</strong> {currentQuestion.explanation}
              </p>
              {selectedAnswer === currentQuestion.correctAnswer && (
                <p className="text-sm font-bold mt-2 text-green-300">+{currentQuestion.xpReward} XP</p>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            {!isAnswered ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="w-full"
                style={{ backgroundColor: worldColor, color: 'white' }}
              >
                {translations.submit}
              </Button>
            ) : currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={handleNext}
                className="w-full"
                style={{ backgroundColor: worldColor, color: 'white' }}
              >
                Next Question
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div className="w-full text-center p-4 bg-green-900/20 border border-green-500 rounded-lg">
                <p className="font-bold text-lg text-green-400">Quiz Completed!</p>
                <p className="text-sm text-green-300">Total Score: {score} XP</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
