import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap, Coins, Star, Sparkles } from "lucide-react";

export type RewardType = "xp" | "level-up" | "world-unlock" | "coins" | "achievement";

interface RewardAnimationProps {
  type: RewardType;
  amount?: number;
  message?: string;
  show: boolean;
  onComplete?: () => void;
  neonColor?: string;
}

export default function RewardAnimation({
  type,
  amount,
  message,
  show,
  onComplete,
  neonColor = "#00D9FF",
}: RewardAnimationProps) {
  useEffect(() => {
    if (show) {
      triggerConfetti(type, neonColor);
      
      // Auto-complete after animation
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, type, neonColor, onComplete]);

  const getIcon = () => {
    switch (type) {
      case "xp":
        return <Zap className="w-16 h-16" style={{ color: neonColor }} />;
      case "level-up":
        return <Star className="w-16 h-16" style={{ color: "#FFD700" }} />;
      case "world-unlock":
        return <Sparkles className="w-16 h-16" style={{ color: "#FF00FF" }} />;
      case "coins":
        return <Coins className="w-16 h-16" style={{ color: "#FFD700" }} />;
      case "achievement":
        return <Trophy className="w-16 h-16" style={{ color: "#FF0080" }} />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "xp":
        return `+${amount} XP`;
      case "level-up":
        return "LEVEL UP!";
      case "world-unlock":
        return "WORLD UNLOCKED!";
      case "coins":
        return `+${amount} Coins`;
      case "achievement":
        return "ACHIEVEMENT UNLOCKED!";
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{
            background: 'rgba(10, 10, 26, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            {/* Icon with pulse animation */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: 2,
                ease: "easeInOut",
              }}
              className="mb-4 flex justify-center"
            >
              {getIcon()}
            </motion.div>

            {/* Title with glow effect */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-black mb-4"
              style={{
                color: neonColor,
                textShadow: `0 0 20px ${neonColor}, 0 0 40px ${neonColor}`,
              }}
            >
              {getTitle()}
            </motion.h2>

            {/* Message */}
            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold"
                style={{ color: "#B026FF" }}
              >
                {message}
              </motion.p>
            )}

            {/* Particle effects */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: "50%",
                    y: "50%",
                    scale: 0,
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 100}%`,
                    y: `${50 + (Math.random() - 0.5) * 100}%`,
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: neonColor,
                    boxShadow: `0 0 10px ${neonColor}`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Trigger confetti animation based on reward type
 */
function triggerConfetti(type: RewardType, neonColor: string) {
  const colors = getConfettiColors(type, neonColor);

  switch (type) {
    case "level-up":
      // Fireworks effect for level up
      const duration = 2000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
      break;

    case "world-unlock":
      // Explosion effect for world unlock
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
      }, 250);
      break;

    case "achievement":
      // Stars falling effect
      confetti({
        particleCount: 50,
        spread: 360,
        ticks: 100,
        gravity: 0.5,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["star"],
        colors,
      });
      break;

    case "xp":
    case "coins":
      // Simple burst for XP and coins
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors,
      });
      break;
  }
}

/**
 * Get confetti colors based on reward type
 */
function getConfettiColors(type: RewardType, neonColor: string): string[] {
  switch (type) {
    case "level-up":
      return ["#FFD700", "#FFA500", "#FF6347", "#00D9FF"];
    case "world-unlock":
      return ["#FF00FF", "#B026FF", "#00D9FF", "#00FF9F"];
    case "achievement":
      return ["#FF0080", "#FF00FF", "#FFD700"];
    case "xp":
      return [neonColor, "#00FF9F", "#00D9FF"];
    case "coins":
      return ["#FFD700", "#FFA500", "#FFFF00"];
    default:
      return [neonColor];
  }
}
