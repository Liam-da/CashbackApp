import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface CameraProps {
  onConfirm: (barcode: string) => void;
  onCancel: () => void;
}

const Camera: React.FC<CameraProps> = ({ onConfirm, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((mediaStream) => {
        activeStream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      })
      .catch(() => {
        setError("Kameratilladelse blev n\u00e6gtet. Pr\u00f8v igen.");
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      {error ? (
        <div className="my-8 text-sm text-red-600">{error}</div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full max-w-sm rounded-lg bg-black sm:max-w-md"
            autoPlay
            playsInline
          />
          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
              onClick={() => onConfirm("5701234567890")}
            >
              Bekr\u00e6fte
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={onCancel}
            >
              Annullere
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Camera;
