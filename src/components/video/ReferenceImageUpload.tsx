// src/components/video/ReferenceImageUpload.tsx
import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, X, Eye, Info, Sparkles } from 'lucide-react';

interface ReferenceImageUploadProps {
  referenceImage?: string;
  onImageChange: (imageDataUrl?: string) => void;
  providerStatus: { activeProvider: string; hasGeminiKey: boolean };
}

export const ReferenceImageUpload: React.FC<ReferenceImageUploadProps> = ({
  referenceImage,
  onImageChange,
  providerStatus
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Sample curated art reference presets for quick testing
  const sampleImages = [
    {
      title: 'Krishna Portrait Sketch',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Vibrant Acrylic Splash',
      url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Cinematic Minimalist Object',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onImageChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isImageToVideoSupported = providerStatus.hasGeminiKey || providerStatus.activeProvider === 'gemini';

  return (
    <div className="bg-studio-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Reference Image
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/30">
                Visual Reference
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Guide character consistency, composition, and color palette
            </p>
          </div>
        </div>

        {referenceImage && (
          <button
            type="button"
            onClick={() => onImageChange(undefined)}
            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-950/30 border border-rose-900/30 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove Image</span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Upload Zone / Active Preview */}
      {!referenceImage ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 hover:border-pink-500/50 rounded-xl p-5 text-center cursor-pointer transition-all bg-studio-950/60 hover:bg-studio-950 group"
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-studio-900 border border-slate-700/60 flex items-center justify-center text-slate-400 group-hover:text-pink-400 group-hover:border-pink-500/40 transition-colors">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-200">
            Click to upload or drag and drop reference image
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            PNG, JPG, WebP up to 10MB
          </p>

          {/* Quick preset selector */}
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-[10px] text-slate-400">Or use art sample:</span>
            {sampleImages.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageChange(s.url);
                }}
                className="text-[10px] px-2 py-0.5 rounded-md bg-studio-900 hover:bg-pink-950/50 border border-slate-700 hover:border-pink-600/40 text-slate-300 hover:text-pink-300 transition-colors"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-studio-950 p-2 flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-700/60 group">
            <img
              src={referenceImage}
              alt="Reference"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
              title="Enlarge preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100 truncate">
                Active Reference Image
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-semibold">
                Attached
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Will guide generation style, character traits, and color harmonies.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Preview</span>
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-purple-400 hover:text-purple-300"
              >
                Replace Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provider Capabilities Notice */}
      <div className="p-3 rounded-xl bg-studio-950/80 border border-slate-800/80 flex items-start gap-2.5 text-[11px] leading-relaxed">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-slate-400">
          <span className="font-semibold text-slate-200">Model Capability Note: </span>
          {isImageToVideoSupported ? (
            <span>
              Connected AI model supports native <strong>Image-to-Video</strong> generation. Your uploaded reference will be supplied as the first frame anchor.
            </span>
          ) : (
            <span>
              Image-to-Video requires compatible video models (e.g. Gemini Omni Flash, Runway Gen-3, Luma Dream Machine). In Studio Simulation / Text-only mode, the reference image guides scene styling, color palette, and visual composition.
            </span>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && referenceImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="max-w-2xl max-h-[85vh] bg-studio-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">Reference Image Preview</span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-black/40">
              <img
                src={referenceImage}
                alt="Reference Large"
                className="max-h-[65vh] max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
