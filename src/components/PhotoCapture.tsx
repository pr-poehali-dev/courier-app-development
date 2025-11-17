import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PhotoCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoTaken: (photoData: string) => void;
  orderId: string;
}

export function PhotoCapture({ isOpen, onClose, onPhotoTaken, orderId }: PhotoCaptureProps) {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      handleFileUpload();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(photoData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const photoData = event.target?.result as string;
          setCapturedPhoto(photoData);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const confirmPhoto = () => {
    if (capturedPhoto) {
      onPhotoTaken(capturedPhoto);
      resetCapture();
      onClose();
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const resetCapture = () => {
    setCapturedPhoto(null);
    stopCamera();
  };

  const handleClose = () => {
    resetCapture();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Фото доставки • {orderId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isCameraActive && !capturedPhoto && (
            <div className="space-y-3">
              <Button 
                onClick={startCamera} 
                className="w-full gap-2"
              >
                <Icon name="Camera" size={20} />
                Открыть камеру
              </Button>
              <Button 
                onClick={handleFileUpload} 
                variant="outline" 
                className="w-full gap-2"
              >
                <Icon name="Upload" size={20} />
                Загрузить из галереи
              </Button>
            </div>
          )}

          {isCameraActive && (
            <div className="space-y-3">
              <Card className="overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto"
                />
              </Card>
              <div className="flex gap-2">
                <Button 
                  onClick={takePhoto} 
                  className="flex-1 gap-2"
                >
                  <Icon name="Camera" size={20} />
                  Сделать фото
                </Button>
                <Button 
                  onClick={stopCamera} 
                  variant="outline"
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}

          {capturedPhoto && (
            <div className="space-y-3">
              <Card className="overflow-hidden">
                <img 
                  src={capturedPhoto} 
                  alt="Captured delivery" 
                  className="w-full h-auto"
                />
              </Card>
              <div className="flex gap-2">
                <Button 
                  onClick={confirmPhoto} 
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Icon name="Check" size={20} />
                  Подтвердить
                </Button>
                <Button 
                  onClick={retakePhoto} 
                  variant="outline"
                  className="gap-2"
                >
                  <Icon name="RotateCcw" size={20} />
                  Переснять
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
