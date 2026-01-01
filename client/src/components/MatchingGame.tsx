import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CheckCircle2, XCircle, RotateCcw, Sparkles } from "lucide-react";

interface MatchingGameProps {
  pairs: Array<{ left: string; right: string }>;
  onComplete: (isCorrect: boolean) => void;
  neonColor?: string;
  xpReward?: number;
}

interface Match {
  leftIndex: number;
  rightIndex: number;
}

export default function MatchingGame({
  pairs,
  onComplete,
  neonColor = "#00D9FF",
  xpReward = 50,
}: MatchingGameProps) {
  const [leftItems, setLeftItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Shuffle right items for the game
    const shuffledRight = [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5);
    setLeftItems(pairs.map(p => p.left));
    setRightItems(shuffledRight);
    setMatches([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setIsChecked(false);
    setIsCorrect(null);
    setShowFeedback(false);
  }, [pairs]);

  const handleLeftClick = (index: number) => {
    if (isChecked) return;
    // Check if this left item is already matched
    if (matches.some(m => m.leftIndex === index)) return;
    
    setSelectedLeft(index);
    
    // If right is already selected, create match
    if (selectedRight !== null) {
      setMatches([...matches, { leftIndex: index, rightIndex: selectedRight }]);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const handleRightClick = (index: number) => {
    if (isChecked) return;
    // Check if this right item is already matched
    if (matches.some(m => m.rightIndex === index)) return;
    
    setSelectedRight(index);
    
    // If left is already selected, create match
    if (selectedLeft !== null) {
      setMatches([...matches, { leftIndex: selectedLeft, rightIndex: index }]);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const handleRemoveMatch = (matchIndex: number) => {
    if (isChecked) return;
    setMatches(matches.filter((_, i) => i !== matchIndex));
  };

  const handleCheck = () => {
    // Validate all matches
    const allCorrect = matches.every(match => {
      const leftValue = leftItems[match.leftIndex];
      const rightValue = rightItems[match.rightIndex];
      // Find the correct pair
      const correctPair = pairs.find(p => p.left === leftValue);
      return correctPair && correctPair.right === rightValue;
    });

    const allMatched = matches.length === pairs.length;
    const correct = allCorrect && allMatched;
    
    setIsCorrect(correct);
    setIsChecked(true);
    setShowFeedback(true);

    if (correct) {
      setTimeout(() => {
        onComplete(true);
      }, 2000);
    }
  };

  const handleReset = () => {
    const shuffledRight = [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5);
    setRightItems(shuffledRight);
    setMatches([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setIsChecked(false);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const isLeftMatched = (index: number) => matches.some(m => m.leftIndex === index);
  const isRightMatched = (index: number) => matches.some(m => m.rightIndex === index);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: `linear-gradient(135deg, ${neonColor}10 0%, ${neonColor}05 100%)`,
          border: `1px solid ${neonColor}40`,
          boxShadow: `0 0 20px ${neonColor}20`,
        }}
      >
        <h3 className="text-xl font-bold mb-2" style={{ color: neonColor }}>
          🎯 Match the Pairs
        </h3>
        <p className="text-lg" style={{ color: `${neonColor}DD` }}>
          Click on items from the left and right columns to create matches.
        </p>
      </div>

      {/* Matching Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          {leftItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleLeftClick(index)}
              disabled={isLeftMatched(index) || isChecked}
              className="w-full p-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: selectedLeft === index
                  ? `linear-gradient(135deg, ${neonColor}40 0%, ${neonColor}20 100%)`
                  : isLeftMatched(index)
                  ? `linear-gradient(135deg, ${neonColor}30 0%, ${neonColor}15 100%)`
                  : `linear-gradient(135deg, ${neonColor}15 0%, ${neonColor}08 100%)`,
                border: `2px solid ${neonColor}${selectedLeft === index ? '' : '60'}`,
                color: neonColor,
                boxShadow: selectedLeft === index ? `0 0 20px ${neonColor}60` : `0 0 10px ${neonColor}30`,
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {rightItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleRightClick(index)}
              disabled={isRightMatched(index) || isChecked}
              className="w-full p-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: selectedRight === index
                  ? `linear-gradient(135deg, ${neonColor}40 0%, ${neonColor}20 100%)`
                  : isRightMatched(index)
                  ? `linear-gradient(135deg, ${neonColor}30 0%, ${neonColor}15 100%)`
                  : `linear-gradient(135deg, ${neonColor}15 0%, ${neonColor}08 100%)`,
                border: `2px solid ${neonColor}${selectedRight === index ? '' : '60'}`,
                color: neonColor,
                boxShadow: selectedRight === index ? `0 0 20px ${neonColor}60` : `0 0 10px ${neonColor}30`,
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Current Matches */}
      {matches.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-lg font-semibold" style={{ color: neonColor }}>
            Your Matches:
          </h4>
          <div className="space-y-2">
            {matches.map((match, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${neonColor}10 0%, ${neonColor}05 100%)`,
                  border: `1px solid ${neonColor}40`,
                }}
              >
                <span className="flex-1 font-semibold" style={{ color: neonColor }}>
                  {leftItems[match.leftIndex]}
                </span>
                <span style={{ color: neonColor }}>→</span>
                <span className="flex-1 font-semibold" style={{ color: neonColor }}>
                  {rightItems[match.rightIndex]}
                </span>
                {!isChecked && (
                  <button
                    onClick={() => handleRemoveMatch(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && isCorrect !== null && (
        <Card
          className="animate-float"
          style={{
            background: isCorrect
              ? "linear-gradient(135deg, #00FF9F20 0%, #00FF9F10 100%)"
              : "linear-gradient(135deg, #FF008020 0%, #FF008010 100%)",
            border: isCorrect ? "2px solid #00FF9F" : "2px solid #FF0080",
            boxShadow: isCorrect ? "0 0 30px #00FF9F40" : "0 0 30px #FF008040",
          }}
        >
          <CardContent className="p-6 flex items-center gap-4">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-12 h-12" style={{ color: "#00FF9F" }} />
                <div>
                  <h4 className="text-2xl font-bold" style={{ color: "#00FF9F" }}>
                    Perfect! 🎉
                  </h4>
                  <p style={{ color: "#00FF9FDD" }}>
                    All matches are correct! +{xpReward} XP
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-12 h-12" style={{ color: "#FF0080" }} />
                <div>
                  <h4 className="text-2xl font-bold" style={{ color: "#FF0080" }}>
                    Not quite right...
                  </h4>
                  <p style={{ color: "#FF0080DD" }}>
                    Some matches are incorrect. Try again!
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={handleCheck}
          disabled={matches.length !== pairs.length || isChecked}
          size="lg"
          style={{
            background: `linear-gradient(135deg, ${neonColor} 0%, ${neonColor}CC 100%)`,
            color: "#0a0a1a",
            boxShadow: `0 0 20px ${neonColor}60`,
          }}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Check Answer
        </Button>

        {isChecked && !isCorrect && (
          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
            style={{
              borderColor: neonColor,
              color: neonColor,
              background: "transparent",
            }}
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
