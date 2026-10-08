import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Footprints,
  Trees,
  Flower2,
  Binoculars,
  Bike,
  Sparkles,
  AlertCircle,
  Sliders,
  Check,
  LocateFixed,
} from 'lucide-react';
import type { PlanRequest } from '../types';

interface PlannerPageProps {
  initialValues?: Partial<PlanRequest>;
  onSubmit: (request: PlanRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ACTIVITIES = [
  { id: 'Walking', label: 'Walking', icon: Footprints, desc: 'Gentle stroll or brisk neighborhood walk' },
  { id: 'Nature exploration', label: 'Nature Exploration', icon: Trees, desc: 'Trails, local parks, and plant discovery' },
  { id: 'Running', label: 'Running', icon: Footprints, desc: 'Aerobic jog or scenic outdoor strides' },
  { id: 'Birdwatching', label: 'Birdwatching', icon: Binoculars, desc: 'Canopy listening and avian spotting' },
  { id: 'Gardening', label: 'Gardening', icon: Flower2, desc: 'Soil aeration, pruning, and hands-on planting' },
  { id: 'Cycling', label: 'Cycling', icon: Bike, desc: 'Two-wheeled greenway and park cruising' },
];

const PRESET_DURATIONS = [15, 30, 45, 60, 90, 120];

const SUGGESTED_INTERESTS = [
  'Native tree spotting',
  'Bird acoustic songs',
  'Quiet paths without traffic',
  'Waterfront / Streams',
  'Wildflower identification',
  'Soil grounding',
  'Cloud observation',
];

const LOADING_THOUGHTS = [
  'Querying Google Gemma open-weight model...',
  'Analyzing your location geography and flora...',
  'Structuring sensory warm-ups and trail steps...',
  'Formulating screen-free mindfulness prompts...',
  'Preparing packing checklist and local safety tips...',
  'Nearly ready: Time to pocket the phone and step outside!',
];

export const PlannerPage: React.FC<PlannerPageProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  error,
}) => {
  const [location, setLocation] = useState(initialValues?.location || 'Bhimavaram Nature Park');
  const [duration, setDuration] = useState<number>(initialValues?.duration || 60);
  const [activity, setActivity] = useState(initialValues?.activity || 'Walking');
  const [fitnessLevel, setFitnessLevel] = useState(initialValues?.fitness_level || 'Beginner');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialValues?.interests || ['Native tree spotting']);
  const [customInterest, setCustomInterest] = useState('');
  const [customNotes, setCustomNotes] = useState(initialValues?.custom_notes || '');
  const [loadingIndex, setLoadingIndex] = useState(0);

  // Cycle loading thoughts
  React.useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % LOADING_THOUGHTS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const handleUseLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocation('Local Nature Park (My Current Area)');
        },
        () => {
          setLocation('Local Green Space');
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    onSubmit({
      location: location.trim(),
      duration,
      activity,
      fitness_level: fitnessLevel,
      interests: selectedInterests,
      custom_notes: customNotes.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl p-10 border border-emerald-100 shadow-xl space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <Trees className="w-12 h-12 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">
              Crafting Your Outdoor Adventure
            </h2>
            <p className="text-sm font-medium text-emerald-700 min-h-[24px] transition-all">
              {LOADING_THOUGHTS[loadingIndex]}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-semibold text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gemma Open-Weight Model at Work</span>
            </div>
            <p>
              Generating structured steps, sensory mindfulness cues, and screen-free outdoor challenges.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="mb-8 text-center sm:text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Step 1: Set Your Parameters</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Plan Your Outdoor Adventure
        </h1>
        <p className="text-slate-600 text-sm">
          Tell Gemma your location and available time. We will generate a balanced, screen-free quest.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Unable to generate adventure</p>
            <p className="text-rose-700 text-xs leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Location & Time */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Where & How Long?</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Location / Setting
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Bhimavaram, Central Park, neighborhood trails, backyard garden"
                  required
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 text-sm outline-hidden transition-all bg-slate-50/50 focus:bg-white"
                />
                <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={handleUseLocation}
                  title="Use generic nearby area"
                  className="absolute right-3 top-2.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>Nearby</span>
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Can be a specific park, city, botanical garden, or simply your local neighborhood.
              </p>
            </div>

            {/* Duration Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Available Time
                </label>
                <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {duration} minutes
                </span>
              </div>

              {/* Preset chips */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {PRESET_DURATIONS.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      duration === mins
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="10"
                max="180"
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>10 mins (Quick breath)</span>
                <span>60 mins (Golden hour)</span>
                <span>180 mins (Half-day trek)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Activity Preference */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Footprints className="w-5 h-5 text-emerald-600" />
            <span>Select Activity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ACTIVITIES.map((act) => {
              const Icon = act.icon;
              const isSelected = activity === act.id;
              return (
                <div
                  key={act.id}
                  onClick={() => setActivity(act.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{act.label}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{act.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Experience & Personalization */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <span>Fitness Level & Nature Interests</span>
          </h2>

          {/* Fitness level */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Experience / Fitness Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFitnessLevel(lvl)}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    fitnessLevel === lvl
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nature Immersion Focus (Optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTED_INTERESTS.map((interest) => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800'
                    }`}
                  >
                    {active ? `✓ ${interest}` : `+ ${interest}`}
                  </button>
                );
              })}
            </div>

            {/* Custom interest tag input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Add custom focus (e.g., fungi spotting, photography)..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddCustomInterest}
                className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Special Notes / Constraints (Optional)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g., Bringing my dog, gentle knees, prefer shaded tree canopy..."
              maxLength={250}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 outline-hidden"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Outdoor Plan with Gemma</span>
          </button>
          <p className="text-center text-xs text-slate-500 mt-3">
            Plan will be generated with Google Gemma open-weight model. Structured strictly for offline execution.
          </p>
        </div>
      </form>
    </div>
  );
};
