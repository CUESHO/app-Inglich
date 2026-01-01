import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Mic, Square, Play, RotateCcw, Upload, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface VoicePracticeRecorderProps {
  targetPhrase: string;
  missionId: string;
  neonColor?: string;
  onComplete?: (score: number) => void;
}

export default function VoicePracticeRecorder({
  targetPhrase,
  missionId,
  neonColor = "#00D9FF",
  onComplete,
}: VoicePracticeRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const analyzePronunciation = trpc.pronunciation.analyzePronunciation.useMutation();
  const uploadAudio = trpc.pronunciation.uploadAudio.useMutation();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio context for visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Start visualization
      visualizeAudio();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Stop visualization
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success("Recording started!");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255); // Normalize to 0-1

      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      toast.success("Recording stopped!");
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const analyzeRecording = async () => {
    if (!audioBlob) {
      toast.error("No recording to analyze");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Upload audio and get analysis
        const uploadResult = await uploadAudio.mutateAsync({
          audioData: base64Audio,
          missionId,
        });

        if (uploadResult.audioUrl) {
          const analysisResult = await analyzePronunciation.mutateAsync({
            audioUrl: uploadResult.audioUrl,
            targetPhrase,
          });

          setResult(analysisResult);
          
          if (analysisResult.score && onComplete) {
            onComplete(analysisResult.score);
          }

          toast.success(`Analysis complete! Score: ${analysisResult.score}/100`);
        }
      };
    } catch (error) {
      console.error("Error analyzing pronunciation:", error);
      toast.error("Failed to analyze pronunciation");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setResult(null);
    setRecordingTime(0);
    setAudioLevel(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Target Phrase */}
      <Card
        style={{
          background: `linear-gradient(135deg, ${neonColor}15 0%, ${neonColor}08 100%)`,
          border: `1px solid ${neonColor}40`,
          boxShadow: `0 0 20px ${neonColor}20`,
        }}
      >
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2" style={{ color: neonColor }}>
            🎯 Target Phrase:
          </h3>
          <p className="text-2xl font-bold" style={{ color: `${neonColor}DD` }}>
            "{targetPhrase}"
          </p>
          <p className="text-sm mt-2" style={{ color: `${neonColor}99` }}>
            Pronunciation: {targetPhrase ? targetPhrase.split(' ').map(word => `[${word.toLowerCase()}]`).join(' ') : 'N/A'}
          </p>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card
        style={{
          background: "rgba(26, 10, 46, 0.6)",
          border: `1px solid ${neonColor}60`,
          boxShadow: `0 0 25px ${neonColor}30`,
        }}
      >
        <CardContent className="p-8">
          {/* Waveform Visualization */}
          {isRecording && (
            <div className="mb-6">
              <div className="flex items-center justify-center gap-1 h-24">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-full transition-all duration-100"
                    style={{
                      height: `${Math.max(10, audioLevel * 100 * (0.5 + Math.random() * 0.5))}%`,
                      background: `linear-gradient(180deg, ${neonColor} 0%, ${neonColor}60 100%)`,
                      boxShadow: `0 0 10px ${neonColor}`,
                    }}
                  />
                ))}
              </div>
              <p className="text-center text-xl font-bold mt-4" style={{ color: neonColor }}>
                Recording: {formatTime(recordingTime)}
              </p>
            </div>
          )}

          {/* Recording Status */}
          {!isRecording && !audioBlob && (
            <div className="text-center mb-6">
              <Mic className="w-16 h-16 mx-auto mb-4" style={{ color: neonColor, opacity: 0.5 }} />
              <p style={{ color: `${neonColor}DD` }}>
                Click the button below to start recording
              </p>
            </div>
          )}

          {/* Playback */}
          {audioBlob && !isRecording && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${neonColor}40 0%, ${neonColor}20 100%)`,
                    border: `2px solid ${neonColor}`,
                    boxShadow: `0 0 20px ${neonColor}60`,
                  }}
                >
                  <Mic className="w-8 h-8" style={{ color: neonColor }} />
                </div>
              </div>
              <p style={{ color: `${neonColor}DD` }}>
                Recording complete ({formatTime(recordingTime)})
              </p>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            {!isRecording && !audioBlob && (
              <Button
                onClick={startRecording}
                size="lg"
                style={{
                  background: `linear-gradient(135deg, ${neonColor} 0%, ${neonColor}CC 100%)`,
                  color: "#0a0a1a",
                  boxShadow: `0 0 20px ${neonColor}60`,
                }}
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button
                onClick={stopRecording}
                size="lg"
                style={{
                  background: "linear-gradient(135deg, #FF0080 0%, #FF0080CC 100%)",
                  color: "#0a0a1a",
                  boxShadow: "0 0 20px #FF008060",
                }}
              >
                <Square className="mr-2 h-5 w-5" />
                Stop Recording
              </Button>
            )}

            {audioBlob && !isRecording && (
              <>
                <Button
                  onClick={playRecording}
                  size="lg"
                  variant="outline"
                  style={{
                    borderColor: neonColor,
                    color: neonColor,
                    background: "transparent",
                  }}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Play
                </Button>

                <Button
                  onClick={analyzeRecording}
                  disabled={isAnalyzing}
                  size="lg"
                  style={{
                    background: `linear-gradient(135deg, #00FF9F 0%, #00FF9FCC 100%)`,
                    color: "#0a0a1a",
                    boxShadow: "0 0 20px #00FF9F60",
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Analyze Pronunciation
                    </>
                  )}
                </Button>

                <Button
                  onClick={reset}
                  size="lg"
                  variant="outline"
                  style={{
                    borderColor: "#FF0080",
                    color: "#FF0080",
                    background: "transparent",
                  }}
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {result && (
        <Card
          className="animate-float"
          style={{
            background: result.score >= 70
              ? "linear-gradient(135deg, #00FF9F20 0%, #00FF9F10 100%)"
              : result.score >= 50
              ? "linear-gradient(135deg, #FFD70020 0%, #FFD70010 100%)"
              : "linear-gradient(135deg, #FF008020 0%, #FF008010 100%)",
            border: result.score >= 70
              ? "2px solid #00FF9F"
              : result.score >= 50
              ? "2px solid #FFD700"
              : "2px solid #FF0080",
            boxShadow: result.score >= 70
              ? "0 0 30px #00FF9F40"
              : result.score >= 50
              ? "0 0 30px #FFD70040"
              : "0 0 30px #FF008040",
          }}
        >
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="text-3xl font-black mb-2" style={{
                color: result.score >= 70 ? "#00FF9F" : result.score >= 50 ? "#FFD700" : "#FF0080"
              }}>
                Pronunciation Score
              </h3>
              <div className="text-6xl font-black" style={{
                color: result.score >= 70 ? "#00FF9F" : result.score >= 50 ? "#FFD700" : "#FF0080"
              }}>
                {result.score}/100
              </div>
              <p className="text-lg mt-2" style={{
                color: result.score >= 70 ? "#00FF9FDD" : result.score >= 50 ? "#FFD700DD" : "#FF0080DD"
              }}>
                {result.score >= 90 ? "🌟 Excellent!" :
                 result.score >= 70 ? "✨ Great job!" :
                 result.score >= 50 ? "👍 Good effort!" :
                 "💪 Keep practicing!"}
              </p>
            </div>

            {result.transcription && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2" style={{ color: neonColor }}>
                  What you said:
                </h4>
                <p className="text-lg" style={{ color: `${neonColor}DD` }}>
                  "{result.transcription}"
                </p>
              </div>
            )}

            {result.feedback && (
              <div>
                <h4 className="font-semibold mb-2" style={{ color: neonColor }}>
                  Feedback:
                </h4>
                <p style={{ color: `${neonColor}DD` }}>
                  {result.feedback}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
