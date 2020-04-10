import classNames from 'classnames';
import React from 'react';
import { Track } from '../project/useProjectState';
import './Timeline.css';
import Waveform from './Waveform';

type TimelineProps = {
  focusedTracks: number[];
  mutedTracks: number[];
  pixelsPerSecond: number;
  tracks: Track[];
};

const Timeline = ({
  focusedTracks,
  mutedTracks,
  pixelsPerSecond,
  tracks,
}: TimelineProps) => {
  console.log('Timeline render');

  return (
    <div className="timeline">
      {tracks.map((track) => {
        const timelineWaveformClass = getTimelineWaveformClass(
          track,
          mutedTracks,
          focusedTracks
        );
        return (
          <div key={track.id} className={timelineWaveformClass}>
            <MemoizedWaveform track={track} pixelsPerSecond={pixelsPerSecond} />
          </div>
        );
      })}
    </div>
  );
};

const MemoizedWaveform = React.memo(Waveform);

function getTimelineWaveformClass(
  track: Track,
  mutedTracks: number[],
  focusedTracks: number[]
) {
  const isMuted = mutedTracks.includes(track.id);
  const isForeground = focusedTracks.includes(track.id);
  const isBackground = focusedTracks.length > 0 && !isForeground;
  return classNames('timeline__waveform', {
    'timeline__waveform--muted': isMuted,
    'timeline__waveform--foreground': !isMuted && isForeground,
    'timeline__waveform--background': !isMuted && isBackground,
  });
}

export default Timeline;