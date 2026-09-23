"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CameraProps {
  onCapture: (canvas: HTMLCanvasElement) => void;
}

export default function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreamActive(true);
      }
    } catch {
      setError("ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้กล้อง หรืออัปโหลดรูปแทน");
    }
  }, []);

  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | undefined;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function captureFromVideo() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(
      video,
      (video.videoWidth - size) / 2,
      (video.videoHeight - size) / 2,
      size,
      size,
      0,
      0,
      size,
      size,
    );
    onCapture(canvas);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
      onCapture(canvas);
    };
    img.src = URL.createObjectURL(file);
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-card border border-sand-300 bg-ink/5">
        {streamActive ? (
          <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink/50">
            ยังไม่ได้เปิดกล้อง
          </div>
        )}
      </div>

      {error && <p className="text-sm text-caution-500">{error}</p>}

      <div className="flex flex-wrap gap-3">
        {!streamActive ? (
          <button
            onClick={startCamera}
            className="rounded-card bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-900 transition-colors"
          >
            เปิดกล้อง
          </button>
        ) : (
          <button
            onClick={captureFromVideo}
            className="rounded-card bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-900 transition-colors"
          >
            ถ่ายภาพ
          </button>
        )}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-card border border-sand-300 bg-surface px-4 py-2.5 text-sm font-medium text-ink/80 hover:border-teal-400 transition-colors"
        >
          อัปโหลดรูปแทน
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
