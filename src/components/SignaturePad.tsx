import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface SignaturePadProps {
  label: string;
  signatureData: string | null;
  onSave: (dataUrl: string | null) => void;
  idPrefix: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  label,
  signatureData,
  onSave,
  idPrefix,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(!!signatureData);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Redraw image or clear canvas based on signatureData prop
  const redrawCanvas = useCallback((dataUrl: string | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (dataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        setHasContent(true);
      };
      img.src = dataUrl;
    } else {
      setHasContent(false);
    }
  }, []);

  // Set up canvas dimensions on mount and resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const initCanvas = () => {
      const rect = container.getBoundingClientRect();
      const displayWidth = Math.floor(rect.width) || 300;
      const displayHeight = 120;

      // Internal pixel buffer matches display
      canvas.width = displayWidth;
      canvas.height = displayHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }

      redrawCanvas(signatureData);
    };

    initCanvas();

    const resizeObserver = new ResizeObserver(() => {
      // Re-init if container width changes significantly
      const rect = container.getBoundingClientRect();
      if (Math.abs(canvas.width - Math.floor(rect.width)) > 20) {
        initCanvas();
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []); // Run on mount only to prevent re-initializing canvas during strokes

  // Sync external changes to signatureData (e.g. form reset or load history)
  useEffect(() => {
    if (!isDrawingRef.current) {
      redrawCanvas(signatureData);
    }
  }, [signatureData, redrawCanvas]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capture pointer so drawing continues even if moving outside canvas
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }

    const { x, y } = getCoordinates(e);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(x, y);
    lastPointRef.current = { x, y };

    isDrawingRef.current = true;
    setIsDrawing(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    // Draw smooth line
    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    lastPointRef.current = { x, y };
    setHasContent(true);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    setIsDrawing(false);
    lastPointRef.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
    onSave(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-slate-800">{label}</span>
          {hasContent && (
            <span className="flex items-center text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
              Tersimpan
            </span>
          )}
        </div>
        <button
          id={`${idPrefix}-clear-btn`}
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-1 text-xs font-medium text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition-colors active:scale-95"
        >
          <RotateCcw className="w-3 h-3" />
          Hapus TTD
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative border-2 border-dashed border-slate-300 rounded-lg overflow-hidden bg-slate-50 touch-none select-none"
        style={{ touchAction: 'none' }}
      >
        <canvas
          id={`${idPrefix}-canvas`}
          ref={canvasRef}
          className="w-full h-[120px] cursor-crosshair block touch-none"
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        {!hasContent && !isDrawing && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs select-none">
            <span className="font-medium text-slate-500">Tanda tangan di area ini</span>
            <span className="text-[10px] text-slate-400 mt-0.5">(Goreskan jari, stylus, atau kursor mouse)</span>
          </div>
        )}
      </div>
    </div>
  );
};
