import React, { useState } from 'react';
import { geminiService, GEMINI_MODELS } from '../services/geminiService';
import { X, Sparkles, Key, CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSettingsSaved }) => {
  if (!isOpen) return null;

  const [apiKey, setApiKey] = useState(geminiService.getApiKey());
  const [model, setModel] = useState(geminiService.getModel());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = () => {
    geminiService.setApiKey(apiKey);
    geminiService.setModel(model);
    onSettingsSaved();
    onClose();
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      setTestResult({ success: false, message: 'Please enter a Gemini API Key first.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with the single word: "VERIFIED"' }] }],
        }),
      });

      if (res.ok) {
        setTestResult({ success: true, message: 'Connection verified! Gemini API is active & responsive.' });
      } else {
        const errorData = await res.json().catch(() => ({}));
        setTestResult({
          success: false,
          message: errorData.error?.message || `API error (HTTP ${res.status}). Verify your key.`,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network error connecting to Gemini API.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-lg rounded-2xl border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative space-y-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">SAARTHI AI Engine Settings</h2>
              <p className="text-xs text-slate-400">Configure Gemini API or use built-in Zero-Key engine</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gemini API Key */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Google Gemini API Key</span>
            </span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <p className="text-[11px] text-slate-400">
            Keys are stored locally in your browser storage or can be preloaded via <code className="text-cyan-300">VITE_GEMINI_API_KEY</code>.
          </p>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Target AI Model
          </label>
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          >
            {GEMINI_MODELS.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Test Connection Button & Result */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || !apiKey}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Validating Key with Google AI Studio...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test Live API Connection</span>
              </>
            )}
          </button>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Zero-Key Mode Assurance */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          <p className="leading-relaxed">
            <strong className="text-slate-200">Zero-Key Guarantee:</strong> If no API key is provided, SAARTHI automatically utilizes its built-in deterministic semantic pipeline with zero hallucination enforcement.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
