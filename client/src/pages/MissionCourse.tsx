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
import { useState } from "react";
import { Streamdown } from "streamdown";

export default function MissionCourse() {
  const { missionId } = useParams<{ missionId: string }>();
  const { user, loading } = useAuth();
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [completedBlocks, setCompletedBlocks] = useState<Set<number>>(new Set());

  const mission = missionId ? getMissionById(missionId) : undefined;
  const world = mission ? getWorldById(mission.worldId) : undefined;
  const course = missionId ? getCourseByMissionId(missionId) : undefined;

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

  const handleCompleteBlock = () => {
    setCompletedBlocks(prev => new Set(prev).add(currentBlockIndex));
    if (currentBlockIndex < (course?.blocks.length || 0) - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    }
  };

  const handleNextBlock = () => {
    if (currentBlockIndex < (course?.blocks.length || 0) - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    }
  };

  const handlePreviousBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!mission || !world || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Mission Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentBlock = course.blocks[currentBlockIndex];
  const progressPercentage = ((completedBlocks.size / course.blocks.length) * 100);

  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${world.color}10 0%, ${world.secondaryColor}10 100%)`,
      }}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
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
                <p className="text-sm font-bold text-gray-800">{course.estimatedTime} {t.minutes}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">{t.blocks}</p>
                <p className="text-sm font-bold text-gray-800">{completedBlocks.size} / {course.blocks.length}</p>
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
                  {currentBlockIndex + 1} / {course.blocks.length}
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
                  minigame={currentBlock.minigame} 
                  worldColor={world.color}
                  translations={t}
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
                  questions={currentBlock.quiz} 
                  worldColor={world.accentColor}
                  translations={t}
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
              currentBlockIndex < course.blocks.length - 1 ? (
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
    </div>
  );
}

// Minigame Renderer Component
function MinigameRenderer({ minigame, worldColor, translations }: any) {
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = () => {
    // Simple check for now - will be enhanced later
    setIsCorrect(true);
  };

  if (minigame.type === "matching") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {minigame.data.pairs.map((pair: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Badge variant="outline" className="flex-1 justify-center py-2">
                {pair.left}
              </Badge>
              <span>→</span>
              <Badge variant="outline" className="flex-1 justify-center py-2">
                {pair.right}
              </Badge>
            </div>
          ))}
        </div>
        <Button 
          onClick={handleSubmit}
          className="w-full"
          style={{ backgroundColor: worldColor, color: 'white' }}
        >
          {translations.submit}
        </Button>
        {isCorrect !== null && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="font-bold">{isCorrect ? translations.correct : translations.incorrect}</p>
            <p className="text-sm">+{minigame.xpReward} {translations.xpEarned}</p>
          </div>
        )}
      </div>
    );
  }

  if (minigame.type === "text-construction") {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {minigame.data.words.map((word: string, index: number) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              {word}
            </Badge>
          ))}
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[100px]">
          <p className="text-gray-400 text-center">Drag words here to build your sentence</p>
        </div>
        <Button 
          onClick={handleSubmit}
          className="w-full"
          style={{ backgroundColor: worldColor, color: 'white' }}
        >
          {translations.submit}
        </Button>
      </div>
    );
  }

  if (minigame.type === "dialogue-choice") {
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
                setIsCorrect(minigame.data.correctAnswers.includes(index));
              }}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + index)})</span>
              {option}
            </Button>
          ))}
        </div>
        {isCorrect !== null && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="font-bold">{isCorrect ? translations.correct : translations.incorrect}</p>
            <p className="text-sm mt-2">{minigame.data.feedback[userAnswer]}</p>
            <p className="text-sm font-bold mt-2">+{minigame.xpReward} {translations.xpEarned}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500">
      Minigame type "{minigame.type}" coming soon!
    </div>
  );
}

// Quiz Renderer Component
function QuizRenderer({ questions, worldColor, translations }: any) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    setIsAnswered(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + currentQuestion.xpReward);
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
            <div className={`mt-4 p-4 rounded-lg ${
              selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <p className="font-bold mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? translations.correct : translations.incorrect}
              </p>
              <p className="text-sm">
                <strong>{translations.explanation}:</strong> {currentQuestion.explanation}
              </p>
              {selectedAnswer === currentQuestion.correctAnswer && (
                <p className="text-sm font-bold mt-2">+{currentQuestion.xpReward} XP</p>
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
              <div className="w-full text-center p-4 bg-green-100 rounded-lg">
                <p className="font-bold text-lg">Quiz Completed!</p>
                <p className="text-sm">Total Score: {score} XP</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
