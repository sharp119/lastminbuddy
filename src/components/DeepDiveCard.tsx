import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  ChevronDown,
  Volume2,
  Pause,
  Loader2,
  X,
  Wand2,
  Palette,
  StickyNote,
  Terminal,
} from 'lucide-react';
import { DeepDiveResult } from '../types';
import { generateDeepDiveAudio, generateDeepDiveImage } from '../services/aiClient';
import { Markdown } from './Markdown';

const STYLE_PRESETS = [
  { id: 'whimsical', name: 'Whimsical Illustration', icon: <Wand2 size={16} />, prompt: "Colorful, friendly, slightly cartoonish, children's book style, no text." },
  { id: 'infographic', name: 'Clean Infographic', icon: <Palette size={16} />, prompt: 'Clean modern infographic with icons, a structured minimalist isometric layout.' },
  { id: 'adhd', name: 'ADHD Notebook', icon: <StickyNote size={16} />, prompt: 'Chaotic-but-creative student notebook: handwritten notes, doodles, arrows, circled key points, grid-paper background.' },
  { id: 'custom', name: 'Custom Style', icon: <Terminal size={16} />, prompt: '' },
];

interface Props {
  result: DeepDiveResult;
  isLoading?: boolean;
  onUpdate?: (updates: Partial<DeepDiveResult>) => void;
}

export const DeepDiveCard: React.FC<Props> = ({ result, isLoading, onUpdate }) => {
  const [images, setImages] = useState(result.images || []);
  const [audioUrl, setAudioUrl] = useState(result.audioUrl);
  const [playing, setPlaying] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [showStyles, setShowStyles] = useState(false);
  const [presetId, setPresetId] = useState(STYLE_PRESETS[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (result.images) setImages(result.images);
    if (result.audioUrl) setAudioUrl(result.audioUrl);
  }, [result]);

  const makeImage = async () => {
    setShowStyles(false);
    setLoadingImage(true);
    setError('');
    const preset = STYLE_PRESETS.find((p) => p.id === presetId);
    const prompt = presetId === 'custom' ? customPrompt : preset?.prompt || '';
    const styleName = presetId === 'custom' ? 'Custom' : preset?.name || 'Default';
    try {
      const url = await generateDeepDiveImage(result.explanation, prompt);
      const next = [...images, { url, style: styleName }];
      setImages(next);
      onUpdate?.({ images: next });
    } catch (e: any) {
      setError(e?.message || 'Could not generate image.');
    } finally {
      setLoadingImage(false);
    }
  };

  const toggleAudio = async () => {
    if (audioUrl && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        await audioRef.current.play();
        setPlaying(true);
      }
      return;
    }
    setLoadingAudio(true);
    setError('');
    try {
      const url = await generateDeepDiveAudio(result.explanation);
      setAudioUrl(url);
      onUpdate?.({ audioUrl: url });
      setTimeout(() => {
        audioRef.current?.play();
        setPlaying(true);
      }, 80);
    } catch (e: any) {
      setError(e?.message || 'Could not generate audio.');
    } finally {
      setLoadingAudio(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/60 to-indigo-50/60 p-6">
        <div className="flex items-center gap-2 text-purple-700 font-semibold mb-4">
          <Sparkles size={18} /> Generating Deep Dive…
        </div>
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-purple-100 rounded w-3/4" />
          <div className="h-3 bg-purple-100 rounded w-1/2" />
        </div>
      </div>
    );
  }

  const btn = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors';

  return (
    <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 p-6">
      <div className="flex items-center gap-2 text-purple-700 font-semibold mb-4">
        <Sparkles size={18} /> Deep Dive
      </div>

      <div className="text-slate-700">
        <Markdown>{result.explanation}</Markdown>
      </div>

      {images.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-3 mt-4 snap-x">
          {images.map((img, i) => (
            <figure key={i} className="shrink-0 w-[280px] snap-center">
              <img src={img.url} alt={`Visual ${i + 1}`} className="w-full rounded-lg shadow-sm" />
              <figcaption className="mt-2 text-xs text-center text-slate-500 flex items-center justify-center gap-1">
                <Sparkles size={12} /> {img.style}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

      <div className="relative flex gap-3 mt-4">
        {showStyles && !loadingImage && (
          <div className="absolute bottom-full left-0 mb-3 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-20 animate-slide-up">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-800 text-sm">Visual Style</h4>
              <button onClick={() => setShowStyles(false)} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-1.5 mb-3">
              {STYLE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPresetId(p.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 ${
                    presetId === p.id ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className={presetId === p.id ? 'text-indigo-600' : 'text-slate-400'}>{p.icon}</span>
                  {p.name}
                </button>
              ))}
            </div>
            {presetId === 'custom' && (
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. pixel art, blueprint, cyberpunk…"
                className="w-full text-sm border border-slate-200 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[56px]"
              />
            )}
            <button
              onClick={makeImage}
              className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Sparkles size={14} /> Generate Visual
            </button>
          </div>
        )}

        <button onClick={() => setShowStyles((s) => !s)} className={btn} disabled={loadingImage}>
          {loadingImage ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Drawing…
            </>
          ) : (
            <>
              <ImageIcon size={16} /> {images.length > 0 ? 'Draw Another' : 'Show Visual'}
              <ChevronDown size={13} className="opacity-50" />
            </>
          )}
        </button>

        <button onClick={toggleAudio} className={btn} disabled={loadingAudio}>
          {loadingAudio ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Generating Audio…
            </>
          ) : playing ? (
            <>
              <Pause size={16} /> Pause
            </>
          ) : (
            <>
              <Volume2 size={16} /> Listen
            </>
          )}
        </button>

        {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} />}
      </div>
    </div>
  );
};
