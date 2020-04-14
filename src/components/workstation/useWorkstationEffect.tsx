import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import useKeyPress from '../../hooks/useKeyPress';
import AudioService from '../../services/AudioService';
import { WorkstationDispatchAction } from './useWorkstationContext';
import { TOGGLE_PLAYBACK, WorkstationState } from './useWorkstationState';

const useWorkstationEffect = (
  state: WorkstationState,
  dispatch: React.Dispatch<WorkstationDispatchAction>
) => {
  const { isPlaying, seekTransportTime } = state;

  /*
   * Use spacebar to toggle playback.
   */

  useKeyPress(() => dispatch([TOGGLE_PLAYBACK]), {
    targetKey: ' ',
  });

  /*
   * Toggle audio playback.
   */

  useEffect(() => {
    if (isPlaying) {
      AudioService.startPlayback();
    } else {
      AudioService.pausePlayback();
    }
  }, [isPlaying]);

  /*
   * Seek transport time.
   */

  useEffect(() => {
    AudioService.setTransportTime(seekTransportTime);
  }, [seekTransportTime]);

  /*
   * Compute scale factor for timeline transform when drawer is open.
   */

  const [timelineScaleFactor, setTimelineScaleFactor] = useState(1.0);

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const drawerContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (timelineContainerRef.current && drawerContainerRef.current) {
      const {
        height: timelineHeight,
      } = timelineContainerRef.current.getBoundingClientRect();
      const {
        height: drawerHeight,
      } = drawerContainerRef.current.getBoundingClientRect();
      const scaleFactor = (timelineHeight - drawerHeight) / timelineHeight;
      setTimelineScaleFactor(scaleFactor);
    }
  }, []);

  return { timelineScaleFactor, timelineContainerRef, drawerContainerRef };
};

export default useWorkstationEffect;
