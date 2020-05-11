import React, { useEffect, useRef } from 'react';
import OfflineAnalyser from '../../services/OfflineAnalyser';
import { Track, TrackColor } from '../project/projectPageReducer';
import './Spectrogram.css';

type SpectrogramProps = {
  height: number;
  pixelsPerSecond: number;
  track: Track;
};

const Spectrogram = ({ height, pixelsPerSecond, track }: SpectrogramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { audioBuffer, color, volume } = track;

  const offlineAnalyser = new OfflineAnalyser(audioBuffer);

  const heightPixelRatio = height / offlineAnalyser.frequencyBinCount;
  const heightFactor = Math.ceil(heightPixelRatio);
  const widthFactor = Math.ceil(
    pixelsPerSecond * offlineAnalyser.timeResolution
  );
  const canvasWidth = Math.trunc(audioBuffer.duration * pixelsPerSecond);
  const canvasHeight =
    Math.ceil(heightPixelRatio) * offlineAnalyser.frequencyBinCount;

  useEffect(() => {
    if (canvasRef.current) {
      const colorMap = createColorMap(color);
      const canvasContext = canvasRef.current.getContext('2d');
      offlineAnalyser.getLogarithmicFrequencyData(
        (frequencyData: Uint8Array, currentTime: number) => {
          const x = currentTime * pixelsPerSecond;
          drawSpectrogramFrame(
            frequencyData,
            canvasHeight,
            colorMap,
            canvasContext as CanvasRenderingContext2D,
            heightFactor,
            widthFactor,
            x
          );
        }
      );
    }
  }, [
    audioBuffer,
    color,
    height,
    pixelsPerSecond,
    canvasHeight,
    heightFactor,
    offlineAnalyser,
    widthFactor,
  ]);

  const wrapperStyle = {
    opacity: convertToOpacity(volume),
    transform: `scaleY(${heightPixelRatio})`,
    transformOrigin: 'top left',
    width: `${canvasWidth}px`,
  };

  return (
    <div className="spectrogram" style={wrapperStyle}>
      <canvas
        ref={canvasRef}
        className="spectrogram__canvas"
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  );
};

function convertToOpacity(value: number): string {
  return (value / 100).toFixed(2);
}

function createColorMap(color: TrackColor): number[][] {
  const { r, g, b } = color;
  const colorMap = [];
  for (let i = 0; i < 256; i++) {
    const opacity = i / 256;
    colorMap.push([r, g, b, opacity]);
  }
  return colorMap;
}

function drawSpectrogramFrame(
  frequencyData: Uint8Array,
  height: number,
  colorMap: number[][],
  canvasContext: CanvasRenderingContext2D,
  heightFactor: number,
  widthFactor: number,
  x: number
) {
  for (let bin = 0; bin < frequencyData.length; bin++) {
    const color = colorMap[frequencyData[bin]];
    canvasContext.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
    canvasContext.fillRect(
      x,
      height - bin * heightFactor,
      widthFactor,
      heightFactor
    );
  }
}

export default Spectrogram;