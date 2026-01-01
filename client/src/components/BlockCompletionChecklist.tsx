import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Trophy, Zap, RefreshCw } from "lucide-react";

interface BlockCompletionChecklistProps {
  correct: number;
  total: number;
  worldColor: string;
  onContinue: () => void;
  language: "en" | "es";
}

export default function BlockCompletionChecklist({
  correct,
  total,
  worldColor,
  onContinue,
  language
}: BlockCompletionChecklistProps) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = percentage >= 70;

  const translations = {
    en: {
      title: passed ? "🎉 Block Completed!" : "⚠️ Block Not Completed",
      subtitle: passed 
        ? "Great job! You've mastered this content." 
        : "You need at least 70% to unlock the next block.",
      score: "Your Score",
      correctAnswers: "Correct Answers",
      totalQuestions: "Total Questions",
      accuracy: "Accuracy",
      continue: passed ? "Continue to Next Block" : "Retry This Block",
      tip: passed 
        ? "Keep up the excellent work!" 
        : "Review the content and try again. You can do it!"
    },
    es: {
      title: passed ? "🎉 ¡Bloque Completado!" : "⚠️ Bloque No Completado",
      subtitle: passed 
        ? "¡Buen trabajo! Has dominado este contenido." 
        : "Necesitas al menos 70% para desbloquear el siguiente bloque.",
      score: "Tu Puntuación",
      correctAnswers: "Respuestas Correctas",
      totalQuestions: "Preguntas Totales",
      accuracy: "Precisión",
      continue: passed ? "Continuar al Siguiente Bloque" : "Reintentar Este Bloque",
      tip: passed 
        ? "¡Sigue con el excelente trabajo!" 
        : "Revisa el contenido e inténtalo de nuevo. ¡Tú puedes!"
    }
  };

  const t = translations[language];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card 
        className="w-full max-w-md border-4 animate-in zoom-in-95 duration-300"
        style={{ 
          borderColor: passed ? worldColor : '#ef4444',
          backgroundColor: 'rgba(15, 23, 42, 0.95)'
        }}
      >
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {passed ? (
              <Trophy 
                className="h-20 w-20 animate-bounce" 
                style={{ color: worldColor }}
              />
            ) : (
              <RefreshCw 
                className="h-20 w-20 text-red-500" 
              />
            )}
          </div>
          <CardTitle className="text-3xl font-bold" style={{ color: passed ? worldColor : '#ef4444' }}>
            {t.title}
          </CardTitle>
          <CardDescription className="text-lg text-gray-300 mt-2">
            {t.subtitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-6xl font-bold mb-2" style={{ color: passed ? worldColor : '#ef4444' }}>
              {percentage}%
            </div>
            <p className="text-gray-400">{t.accuracy}</p>
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <span className="text-gray-300">{t.correctAnswers}</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" style={{ color: worldColor }} />
                <span className="font-bold text-white">{correct}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <span className="text-gray-300">{t.totalQuestions}</span>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-white">{total}</span>
              </div>
            </div>

            {!passed && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-red-400 text-sm">
                  {t.tip}
                </span>
              </div>
            )}

            {passed && (
              <div className="flex items-center gap-2 p-3 rounded-lg border" style={{ 
                backgroundColor: `${worldColor}20`,
                borderColor: `${worldColor}50`
              }}>
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: worldColor }} />
                <span className="text-sm" style={{ color: worldColor }}>
                  {t.tip}
                </span>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            className="w-full text-white font-bold py-6 text-lg"
            style={{ backgroundColor: passed ? worldColor : '#ef4444' }}
          >
            {passed ? <Trophy className="mr-2 h-5 w-5" /> : <RefreshCw className="mr-2 h-5 w-5" />}
            {t.continue}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
