"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CameraProps {
  onCapture: (canvas: HTMLCanvasElement) => void;
}

const MAX_IMAGE_DIMENSION = 1280;

function drawEntireImage(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  canvas: HTMLCanvasElement,
) {
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(sourceWidth, sourceHeight));
  canvas.width = Math.max(1, Math.round(sourceWidth * scale));
  canvas.height = Math.max(1, Math.round(sourceHeight * scale));
  canvas.getContext("2d")?.drawImage(source, 0, 0, canvas.width, canvas.height);
}

export default function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  const startingRef = useRef(false);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStreamActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    // กันกดซ้ำระหว่างรอสิทธิ์กล้อง ไม่ให้ได้ stream ซ้อนกันจนปิดไม่หมด
    if (startingRef.current || streamRef.current) return;
    startingRef.current = true;
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
      });
      // component ถูกถอดออกระหว่างรอสิทธิ์ ต้องปิด stream ทิ้งเอง เพราะ cleanup ทำงานไปก่อนแล้ว
      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      // <video> เป็น element ที่ render อยู่เสมอ จึงผูก stream ได้ทันที
      const video = videoRef.current;
      if (!video) {
        stopStream();
        return;
      }
      video.srcObject = streamRef.current;
      await video.play();
      setStreamActive(true);
    } catch {
      stopStream();
      if (mountedRef.current) {
        setError("ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้กล้อง หรืออัปโหลดรูปแทน");
      }
    } finally {
      startingRef.current = false;
    }
  }, [stopStream]);

  // ปิดกล้องตอน unmount (อ่านจาก streamRef เพราะ videoRef.current ถูกล้างเป็น null ก่อน cleanup)
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  function captureFromVideo() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError("กล้องยังไม่พร้อม กรุณารอสักครู่แล้วลองใหม่");
      return;
    }
    drawEntireImage(video, video.videoWidth, video.videoHeight, canvas);
    onCapture(canvas);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setError(null);

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = canvasRef.current;
      if (!canvas) return;
      drawEntireImage(img, img.naturalWidth, img.naturalHeight, canvas);
      onCapture(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("ไม่สามารถอ่านไฟล์รูปนี้ได้ กรุณาลองรูปอื่น (JPG หรือ PNG)");
    };
    img.src = url;
    // ล้างค่า เพื่อให้เลือกไฟล์เดิมซ้ำได้
    input.value = "";
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-card border border-sand-300 bg-ink/5">
        <video
          ref={videoRef}
          className={`h-full w-full object-contain ${streamActive ? "" : "hidden"}`}
          muted
          playsInline
        />
        {!streamActive && (
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
          <>
            <button
              onClick={captureFromVideo}
              className="rounded-card bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-900 transition-colors"
            >
              ถ่ายภาพ
            </button>
            <button
              onClick={stopStream}
              className="rounded-card border border-sand-300 bg-surface px-4 py-2.5 text-sm font-medium text-ink/80 hover:border-teal-400 transition-colors"
            >
              ปิดกล้อง
            </button>
          </>
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
