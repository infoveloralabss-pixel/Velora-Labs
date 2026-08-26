import React, { useState, useRef, useCallback } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  Image as ImageIcon,
  Trash2,
  Check,
  Sparkles,
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface PresetOption {
  label: string;
  url: string;
}

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  previewShape?: 'rounded' | 'circle' | 'square';
  presets?: PresetOption[];
  helpText?: string;
  maxDimension?: number; // max width/height in px to compress
  quality?: number; // jpeg/webp quality 0-1
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label = 'Image',
  value,
  onChange,
  aspectRatio = 'square',
  previewShape = 'rounded',
  presets = [],
  helpText,
  maxDimension = 1200,
  quality = 0.88,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and convert image file to optimized Base64 Data URL
  const processImageFile = useCallback(
    (file: File) => {
      setUploadError(null);

      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file (PNG, JPG, WebP, SVG, GIF).');
        return;
      }

      // If SVG or GIF, preserve directly as base64 without canvas resize
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            onChange(reader.result);
            setFileDetails({
              name: file.name,
              size: `${(file.size / 1024).toFixed(1)} KB`,
            });
          }
        };
        reader.onerror = () => setUploadError('Failed to read image file.');
        reader.readAsDataURL(file);
        return;
      }

      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;

          // Scale down proportionally if exceeding maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            onChange(e.target?.result as string);
            setIsProcessing(false);
            return;
          }

          // Smooth rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Output as optimized JPEG or WebP
          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(mimeType, quality);

          onChange(dataUrl);
          const estSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
          setFileDetails({
            name: file.name,
            size: `${estSizeKb} KB (Optimized ${width}x${height})`,
          });
          setIsProcessing(false);
        };

        img.onerror = () => {
          setUploadError('Invalid or corrupted image file.');
          setIsProcessing(false);
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        setUploadError('Failed to read file from disk.');
        setIsProcessing(false);
      };

      reader.readAsDataURL(file);
    },
    [maxDimension, quality, onChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processImageFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processImageFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setFileDetails(null);
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setFileDetails(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isBase64 = value?.startsWith('data:image/');

  return (
    <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="font-mono uppercase text-slate-300 text-[11px] font-semibold flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          {label}
        </label>
        {value && (
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
            <Check className="w-3 h-3" /> Image Active
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800/80">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-mono text-[10px] font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload From Device</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-mono text-[10px] font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'url'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Image URL</span>
        </button>

        {presets.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-mono text-[10px] font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Presets</span>
          </button>
        )}
      </div>

      {/* TAB 1: DEVICE UPLOAD DROPZONE */}
      {activeTab === 'upload' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-cyan-400 bg-cyan-950/40 scale-[0.99]'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-950/90'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UploadCloud className="w-5 h-5" />
              )}
            </div>

            <div>
              <p className="text-slate-200 font-semibold text-xs">
                {isProcessing ? 'Optimizing photo...' : 'Click to select from device or drag & drop'}
              </p>
              <p className="text-slate-500 text-[10px] mt-0.5">
                PNG, JPG, WebP, SVG, GIF (auto-resized & optimized for instant web rendering)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: URL INPUT */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApplyUrl();
                }
              }}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500/60 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-colors font-medium text-xs whitespace-nowrap"
            >
              Apply URL
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PRESETS */}
      {activeTab === 'presets' && presets.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setUrlInput(preset.url);
                  setFileDetails(null);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono border transition-all flex items-center gap-1.5 ${
                  value === preset.url
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 border border-slate-700">
                  <img src={preset.url} alt="" className="w-full h-full object-cover" />
                </div>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-[11px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Active Preview & File Details */}
      {value && (
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`overflow-hidden bg-slate-950 border border-slate-700 shrink-0 relative ${
                previewShape === 'circle'
                  ? 'w-12 h-12 rounded-full'
                  : aspectRatio === 'video'
                  ? 'w-20 h-12 rounded-xl'
                  : 'w-12 h-12 rounded-xl'
              }`}
            >
              <img
                src={value}
                alt="Selected preview"
                className="w-full h-full object-cover"
                onError={() => setUploadError('Image failed to load. Please verify image file or URL.')}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] text-white font-medium truncate">
                <FileCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">
                  {fileDetails?.name || (isBase64 ? 'Uploaded Device Image' : 'Linked Web Image')}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                {fileDetails?.size || (isBase64 ? 'Local Device Asset' : value.slice(0, 45) + '...')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-900/60 transition-colors"
              title="Remove image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {helpText && !uploadError && (
        <p className="text-[10px] text-slate-500 font-mono">{helpText}</p>
      )}
    </div>
  );
};
