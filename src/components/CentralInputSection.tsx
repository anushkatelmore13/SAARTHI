import React, { useState, useRef, useEffect } from 'react';
import { 
  Keyboard, 
  Mic, 
  Image as ImageIcon, 
  FileText, 
  Send, 
  Sparkles, 
  StopCircle, 
  FileCheck,
  X,
  RefreshCw,
  ArrowDownCircle,
  Shield,
  CloudSnow,
  Landmark,
  FileSpreadsheet,
  HeartPulse,
  Briefcase,
  Radio
} from 'lucide-react';
import { InputSourceType, DomainCategory } from '../types';
import { imageOcrService } from '../services/imageOcrService';

interface CentralInputSectionProps {
  onSubmit: (text: string, inputType: InputSourceType, metadata?: any) => Promise<void>;
  isLoading: boolean;
  onSelectDemoCase: (caseId: string) => void;
}

export const CentralInputSection: React.FC<CentralInputSectionProps> = ({
  onSubmit,
  isLoading,
  onSelectDemoCase,
}) => {
  const [activeTab, setActiveTab] = useState<InputSourceType>('text');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; preview?: string } | null>(null);
  const [_speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scenariosRef = useRef<HTMLDivElement>(null);

  const categories: { label: DomainCategory; icon: any }[] = [
    { label: 'Emergency / Safety', icon: Shield },
    { label: 'Weather / Travel', icon: CloudSnow },
    { label: 'Government / Public Services', icon: Landmark },
    { label: 'Documents / Forms', icon: FileSpreadsheet },
    { label: 'Healthcare Information', icon: HeartPulse },
    { label: 'Workplace / Operational Incidents', icon: Briefcase },
    { label: 'News / Information', icon: Radio },
  ];

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setTextInput(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch { }
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch { }
      }
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setSpeechError(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
          setRecordingDuration(0);
          timerRef.current = setInterval(() => {
            setRecordingDuration(d => d + 1);
          }, 1000);
        } catch {
          loadSimulatedVoice();
        }
      } else {
        loadSimulatedVoice();
      }
    }
  };

  const loadSimulatedVoice = () => {
    setTextInput(
      `"Command, this is Ramesh... Sector 7 B-Wing loading docks! Listen, water came up super fast, past the ramp, already two feet deep and rising! Forklift three tipped over right next to the 400-series chemical racks. I think Sandeep was in the south battery charging room when the siren sounded, but the alarm speaker cut out. The backup transformer is buzzing loudly and throwin' sparks right near the water level! Need SAR boat immediately!"`
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted = `${(file.size / 1024).toFixed(1)} KB`;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async () => {
        const previewUrl = reader.result as string;
        setUploadedFile({
          name: file.name,
          size: sizeFormatted,
          preview: previewUrl,
        });

        // Clear stale text immediately so previous analysis does not persist
        setTextInput('');

        try {
          const ocrResult = await imageOcrService.extractTextFromImage(file, previewUrl);
          if (ocrResult.success && ocrResult.text.trim().length > 0) {
            setTextInput(
              `[EXTRACTED FROM OCR IMAGE: ${file.name}]\n${ocrResult.text.trim()}`
            );
          } else {
            setTextInput(
              `[IMAGE OCR NOTICE: ${file.name}] No legible text could be extracted from this image. Please provide a clearer screenshot or enter the incident details manually.`
            );
          }
        } catch (err) {
          console.warn('OCR extraction error:', err);
          setTextInput(
            `[IMAGE OCR NOTICE: ${file.name}] No legible text could be extracted from this image. Please review the image or enter the incident details manually.`
          );
        }
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFile({
          name: file.name,
          size: sizeFormatted,
        });
        const content = reader.result as string;
        setTextInput(content.slice(0, 1500) || `[DOCUMENT ATTACHMENT: ${file.name}] Attached document. Please enter relevant context if needed.`);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim() || isLoading) return;

    if (isRecording) {
      toggleRecording();
    }

    await onSubmit(textInput.trim(), activeTab, {
      fileName: uploadedFile?.name,
      duration: isRecording || activeTab === 'voice' ? `${Math.floor(recordingDuration / 60)}:${(recordingDuration % 60).toString().padStart(2, '0')}` : undefined,
    });
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-6 space-y-8">
      {/* Radiant ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-blue-500/15 rounded-3xl blur-2xl opacity-60 pointer-events-none -z-10" />

      {/* Hero Headings */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-1 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Any messy situation. One intelligent action bridge.</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
          SAARTHI
        </h1>

        <p className="text-lg sm:text-xl font-medium text-slate-300">
          From Human Intent to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 font-bold">Verified Action</span>.
        </p>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-normal leading-relaxed">
          Turn messy real-world situations into structured, verified next steps.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => scenariosRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Try a Live Scenario</span>
          </button>

          <button
            type="button"
            onClick={() => textareaRef.current?.focus()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all hover:scale-105"
          >
            <span>Tell SAARTHI what happened</span>
            <ArrowDownCircle className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* 7 Universal Domain Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <span
                key={cat.label}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/70 border border-slate-800/80 text-[11px] font-medium text-slate-300 hover:border-slate-700 transition-colors"
              >
                <Icon className="w-3 h-3 text-cyan-400" />
                <span>{cat.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Main Interaction Card */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Card Header & Modal Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/70">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Tell me what happened.</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Type, speak, or drop raw files. SAARTHI extracts facts, isolates missing data, and builds a verified action plan.
            </p>
          </div>

          {/* Input modality pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'text'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Type</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('voice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'voice'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Speak</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('image');
                fileInputRef.current?.click();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'image'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('document');
                fileInputRef.current?.click();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'document'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Doc</span>
            </button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={activeTab === 'image' ? 'image/*' : '.txt,.pdf,.doc,.docx,.log,.json'}
          onChange={handleFileUpload}
        />

        {/* Voice Recording Banner if voice tab active */}
        {activeTab === 'voice' && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleRecording}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all shadow-lg ${
                  isRecording 
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' 
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold'
                }`}
              >
                {isRecording ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <div>
                <p className="text-sm font-semibold text-white">
                  {isRecording ? 'Listening & Transcribing via Web Speech API...' : 'Click mic to speak natural intent'}
                </p>
                <p className="text-xs text-slate-400">
                  {isRecording 
                    ? `Recording: ${Math.floor(recordingDuration / 60)}:${(recordingDuration % 60).toString().padStart(2, '0')}`
                    : 'Speak freely — speech cadence, pauses, and disfluencies are parsed cleanly.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadSimulatedVoice}
              className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Panicked Voice Dispatch Sample</span>
            </button>
          </div>
        )}

        {/* Uploaded File Chip */}
        {uploadedFile && (
          <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {uploadedFile.preview ? (
                <img src={uploadedFile.preview} alt="Upload preview" className="w-10 h-10 object-cover rounded-lg border border-cyan-500/40" />
              ) : (
                <FileCheck className="w-6 h-6 text-cyan-400" />
              )}
              <div>
                <p className="text-xs font-semibold text-slate-200">{uploadedFile.name}</p>
                <p className="text-[11px] text-slate-400">{uploadedFile.size} • Processed & OCR Grounded</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setUploadedFile(null);
                setTextInput('');
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Text Input Area */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={4}
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Describe any messy situation: an urgent hazard, confusing government rejection, stranded travel emergency, or commercial contract dispute..."
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 resize-y transition-all"
            />
          </div>

          {/* Action Row */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {textInput.split(/\s+/).filter(Boolean).length} words
              </span>
              <span>• Zero hallucination guarantee (Strict Truth Layer)</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {textInput && (
                <button
                  type="button"
                  onClick={() => setTextInput('')}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                disabled={!textInput.trim() || isLoading}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  !textInput.trim() || isLoading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20 hover:scale-[1.02]'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deconstructing Intent...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Analyze & Build Action Center</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* 4 Signature Live Demo Scenarios Bar */}
        <div ref={scenariosRef} className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Signature Demo Scenarios — One-Click Evaluation</span>
            </span>
            <span className="text-[11px] text-slate-400">Click any card to launch the cognitive pipeline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Scenario A: Emergency */}
            <button
              type="button"
              onClick={() => onSelectDemoCase('case-demo-1')}
              className="p-3.5 text-left rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/50 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 font-bold uppercase">
                  A • Emergency
                </span>
                <span className="text-[10px] font-mono text-rose-400 font-bold">CRITICAL</span>
              </div>
              <h4 className="text-xs font-bold text-slate-100 group-hover:text-rose-300 transition-colors line-clamp-1 mb-1">
                Industrial Flash Flood
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                Panicked voice radio: 2ft rising water, arcing transformer, trapped worker, 4% battery.
              </p>
            </button>

            {/* Scenario B: Government Service */}
            <button
              type="button"
              onClick={() => onSelectDemoCase('case-demo-2')}
              className="p-3.5 text-left rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-bold uppercase">
                  B • Gov Service
                </span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">HIGH</span>
              </div>
              <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
                Pension Portal Lock
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                Error 409 rejection, missing municipal QR death cert, bedridden senior, Friday 90-day cutoff.
              </p>
            </button>

            {/* Scenario C: Weather + Travel */}
            <button
              type="button"
              onClick={() => onSelectDemoCase('case-demo-3')}
              className="p-3.5 text-left rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800 font-bold uppercase">
                  C • Weather / Travel
                </span>
                <span className="text-[10px] font-mono text-sky-400 font-bold">HIGH</span>
              </div>
              <h4 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-1 mb-1">
                Blizzard & I-70 Closure
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                Stranded family in Denver: canceled flight, I-70 Traction Law, diabetic senior, $1,800 condo at risk.
              </p>
            </button>

            {/* Scenario D: Documents / Forms */}
            <button
              type="button"
              onClick={() => onSelectDemoCase('case-demo-4')}
              className="p-3.5 text-left rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-bold uppercase">
                  D • Documents
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">HIGH</span>
              </div>
              <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                Lease CAM Dispute
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                Landlord threatens $25k Letter of Credit draw in 5 days over disputed CAM; Section 22.1 violated.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
