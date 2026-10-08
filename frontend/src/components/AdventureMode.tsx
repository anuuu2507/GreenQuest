import React, { useState, useEffect } from 'react';
import {
  PhoneOff,
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowLeft,
  Moon,
  Star,
  Trees,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { AdventurePlan, CompletePlanPayload } from '../types';

interface AdventureModeProps {
  plan: AdventurePlan;
  onExit: () => void;
  onComplete: (payload: CompletePlanPayload) => Promise<void>;
}

export const AdventureMode: React.FC<AdventureModeProps> = ({
  plan,
  onExit,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = plan.steps[currentStepIndex] || plan.steps[0];

  // Seconds left for the current step
  const [secondsRemaining, setSecondsRemaining] = useState(currentStep.duration * 60);
  const [isActive, setIsActive] = useState(true);
  const [isPocketDim, setIsPocketDim] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [reflection, setReflection] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audio tone generator for step chime
  const playChime = React.useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Audio not supported or blocked
    }
  }, [soundEnabled]);

  const triggerCompletion = React.useCallback(() => {
    setIsPocketDim(false);
    setShowCompletionModal(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#f59e0b'],
      });
    } catch {
      // canvas-confetti fallback
    }
  }, []);

  // Timer loop
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev > 1) {
          return prev - 1;
        }
        // Step finished!
        playChime();
        if (currentStepIndex < plan.steps.length - 1) {
          const nextIdx = currentStepIndex + 1;
          setCurrentStepIndex(nextIdx);
          return plan.steps[nextIdx].duration * 60;
        } else {
          setIsActive(false);
          triggerCompletion();
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentStepIndex, plan.steps, playChime, triggerCompletion]);

  const handleNextStep = () => {
    if (currentStepIndex < plan.steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setSecondsRemaining(plan.steps[nextIdx].duration * 60);
    } else {
      triggerCompletion();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const totalSteps = plan.steps.length;
  const progressPct = ((currentStepIndex + (1 - secondsRemaining / (currentStep.duration * 60))) / totalSteps) * 100;

  const handleSaveCompletion = async () => {
    setIsSubmitting(true);
    try {
      await onComplete({
        reflection: reflection.trim() || undefined,
        rating,
      });
    } catch (err) {
      console.error('Completion save failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPocketDim) {
    return (
      <div
        onClick={() => setIsPocketDim(false)}
        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
      >
        <div className="space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-900 flex items-center justify-center mx-auto animate-pulse">
            <Trees className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-emerald-500/80 tracking-wide">
              POCKET MODE ACTIVE
            </h1>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Screen dimmed to preserve battery & keep your gaze on nature.
            </p>
          </div>
          <div className="font-mono text-3xl font-light text-slate-600">
            {formatTime(secondsRemaining)}
          </div>
          <p className="text-xs text-slate-700 underline underline-offset-4 pt-4">
            Tap anywhere to awaken screen
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* Top Header: Touch Grass Reminders */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between border-b border-slate-900 pb-4">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Mode</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold">
          <PhoneOff className="w-3.5 h-3.5" />
          <span>Phone down. Adventure on.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Step chime on' : 'Muted'}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsPocketDim(true)}
            title="Pocket dim screen"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Center Stage: Huge Clean Timer & Current Step */}
      <div className="max-w-2xl mx-auto w-full my-auto text-center space-y-8 py-6">
        {/* Step indicator */}
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {currentStep.activity}
          </h2>
        </div>

        {/* Big Countdown Timer */}
        <div className="relative py-2">
          <div className="text-7xl sm:text-9xl font-mono font-black tracking-tighter text-emerald-400 select-all">
            {formatTime(secondsRemaining)}
          </div>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-1">
            Remaining in this phase
          </p>
        </div>

        {/* Essential Instruction & Mindfulness Sensory Cue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-left shadow-2xl">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
              What to do outside:
            </p>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              {currentStep.description}
            </p>
          </div>

          {currentStep.mindfulness_prompt && (
            <div className="pt-3 border-t border-slate-800/80 flex items-start gap-3 text-xs sm:text-sm text-emerald-300">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-200">Sensory Focus: </span>
                <span>{currentStep.mindfulness_prompt}</span>
              </div>
            </div>
          )}
        </div>

        {/* Next step teaser */}
        {currentStepIndex < totalSteps - 1 && (
          <p className="text-xs text-slate-500">
            Next: <strong className="text-slate-400">{plan.steps[currentStepIndex + 1].activity}</strong> ({plan.steps[currentStepIndex + 1].duration}m)
          </p>
        )}
      </div>

      {/* Bottom Controls & "Put Phone Away" Banner */}
      <div className="max-w-2xl mx-auto w-full space-y-4">
        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setIsPocketDim(true)}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Moon className="w-4 h-4 text-slate-400" />
            <span>Pocket Mode</span>
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className="py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/30 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isActive ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isActive ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={handleNextStep}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next Step'}</span>
            <SkipForward className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Prominent Touch Grass Banner */}
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-center text-xs text-emerald-400">
          "Your plan is ready. Now close the app and go outside. Check back when you're done."
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-800/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-100 space-y-6 shadow-2xl animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                You Touched Grass!
              </h3>
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                {plan.duration} Screen-Free Minutes Logged
              </p>
              <p className="text-xs text-slate-400">
                You completed <em>{plan.title}</em> in {plan.location}. Welcome back to reality.
              </p>
            </div>

            {/* Rating */}
            <div className="space-y-2 text-center">
              <label className="block text-xs font-semibold text-slate-400">
                How refreshing was this adventure?
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        rating >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Reflection Note */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400">
                Post-Adventure Reflection (Optional)
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What did you hear, smell, or notice? How did it feel stepping away from screens?"
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onExit}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Skip Reflection
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSaveCompletion}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Recording...' : 'Record Completion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
