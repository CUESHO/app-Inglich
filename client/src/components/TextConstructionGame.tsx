import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CheckCircle2, XCircle, RotateCcw, Sparkles } from "lucide-react";

interface TextConstructionGameProps {
  question: string;
  words: string[];
  correctOrder: string[];
  onComplete: (isCorrect: boolean) => void;
  neonColor?: string;
}

interface DraggableWordProps {
  id: string;
  word: string;
  neonColor: string;
  isInDropZone: boolean;
}

function DraggableWord({ id, word, neonColor, isInDropZone }: DraggableWordProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="inline-block cursor-grab active:cursor-grabbing"
    >
      <div
        className="px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105"
        style={{
          background: isInDropZone
            ? `linear-gradient(135deg, ${neonColor}40 0%, ${neonColor}20 100%)`
            : `linear-gradient(135deg, ${neonColor}20 0%, ${neonColor}10 100%)`,
          border: `2px solid ${neonColor}`,
          color: neonColor,
          boxShadow: `0 0 15px ${neonColor}40`,
        }}
      >
        {word}
      </div>
    </div>
  );
}

export default function TextConstructionGame({
  question,
  words,
  correctOrder,
  onComplete,
  neonColor = "#00D9FF",
}: TextConstructionGameProps) {
  const [wordBank, setWordBank] = useState<string[]>([]);
  const [dropZone, setDropZone] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    // Shuffle words for word bank
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWordBank(shuffled);
    setDropZone([]);
    setIsChecked(false);
    setIsCorrect(null);
    setShowFeedback(false);
  }, [words]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeWord = active.id as string;
    const isFromWordBank = wordBank.includes(activeWord);
    const isFromDropZone = dropZone.includes(activeWord);

    // Moving from word bank to drop zone
    if (isFromWordBank && over.id === "drop-zone") {
      setWordBank(wordBank.filter((w) => w !== activeWord));
      setDropZone([...dropZone, activeWord]);
    }
    // Moving from drop zone back to word bank
    else if (isFromDropZone && over.id === "word-bank") {
      setDropZone(dropZone.filter((w) => w !== activeWord));
      setWordBank([...wordBank, activeWord]);
    }
    // Reordering within drop zone
    else if (isFromDropZone && dropZone.includes(over.id as string)) {
      const oldIndex = dropZone.indexOf(activeWord);
      const newIndex = dropZone.indexOf(over.id as string);
      setDropZone(arrayMove(dropZone, oldIndex, newIndex));
    }
  };

  const handleCheck = () => {
    const correct = JSON.stringify(dropZone) === JSON.stringify(correctOrder);
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
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWordBank(shuffled);
    setDropZone([]);
    setIsChecked(false);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const activeWord = activeId ? (wordBank.includes(activeId) || dropZone.includes(activeId) ? activeId : null) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Question */}
        <div
          className="p-6 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${neonColor}10 0%, ${neonColor}05 100%)`,
            border: `1px solid ${neonColor}40`,
            boxShadow: `0 0 20px ${neonColor}20`,
          }}
        >
          <h3 className="text-xl font-bold mb-2" style={{ color: neonColor }}>
            📝 Construct the Sentence
          </h3>
          <p className="text-lg" style={{ color: `${neonColor}DD` }}>
            {question}
          </p>
        </div>

        {/* Drop Zone */}
        <div>
          <h4 className="text-lg font-semibold mb-3" style={{ color: neonColor }}>
            Your Answer:
          </h4>
          <SortableContext items={dropZone} strategy={verticalListSortingStrategy}>
            <div
              id="drop-zone"
              className="min-h-[120px] p-6 rounded-lg flex flex-wrap gap-3 items-center justify-center transition-all duration-300"
              style={{
                background: dropZone.length > 0
                  ? `linear-gradient(135deg, ${neonColor}15 0%, ${neonColor}08 100%)`
                  : "rgba(255, 255, 255, 0.05)",
                border: `2px dashed ${neonColor}${dropZone.length > 0 ? "" : "40"}`,
                boxShadow: dropZone.length > 0 ? `0 0 25px ${neonColor}30` : "none",
              }}
            >
              {dropZone.length === 0 ? (
                <p className="text-gray-500 italic">Drag words here to build your sentence...</p>
              ) : (
                dropZone.map((word) => (
                  <DraggableWord key={word} id={word} word={word} neonColor={neonColor} isInDropZone={true} />
                ))
              )}
            </div>
          </SortableContext>
        </div>

        {/* Word Bank */}
        <div>
          <h4 className="text-lg font-semibold mb-3" style={{ color: neonColor }}>
            Word Bank:
          </h4>
          <SortableContext items={wordBank} strategy={verticalListSortingStrategy}>
            <div
              id="word-bank"
              className="min-h-[100px] p-6 rounded-lg flex flex-wrap gap-3 items-center justify-center"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: `1px solid ${neonColor}30`,
              }}
            >
              {wordBank.length === 0 ? (
                <p className="text-gray-500 italic">All words used!</p>
              ) : (
                wordBank.map((word) => (
                  <DraggableWord key={word} id={word} word={word} neonColor={neonColor} isInDropZone={false} />
                ))
              )}
            </div>
          </SortableContext>
        </div>

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
                      You've constructed the sentence correctly! +50 XP
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
                      Try rearranging the words. The correct order is: <strong>{correctOrder.join(" ")}</strong>
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
            disabled={dropZone.length === 0 || isChecked}
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

      {/* Drag Overlay */}
      <DragOverlay>
        {activeWord ? (
          <div
            className="px-4 py-2 rounded-lg font-semibold text-lg"
            style={{
              background: `linear-gradient(135deg, ${neonColor}60 0%, ${neonColor}40 100%)`,
              border: `2px solid ${neonColor}`,
              color: neonColor,
              boxShadow: `0 0 25px ${neonColor}80`,
              cursor: "grabbing",
            }}
          >
            {activeWord}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
