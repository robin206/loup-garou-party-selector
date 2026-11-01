
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

interface TimerProps {
  defaultMinutes?: number;
}

const Timer: React.FC<TimerProps> = ({ defaultMinutes = 5 }) => {
  const [totalSeconds, setTotalSeconds] = useState(defaultMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (totalSeconds === 0) {
      setIsActive(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, totalSeconds]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTotalSeconds(defaultMinutes * 60);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const addMinute = () => {
    setTotalSeconds(seconds => seconds + 60);
  };

  const removeMinute = () => {
    setTotalSeconds(seconds => Math.max(0, seconds - 60));
  };

  const formatTime = () => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (totalSeconds > 60) return 'text-green-500';
    if (totalSeconds > 30) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5">
      <div className={`text-3xl font-mono font-bold tabular-nums tracking-wider ${getTimerColor()}`}>
        {formatTime()}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTimer}
          className="h-9 w-9 rounded-full bg-white/5 text-gray-200 hover:bg-white/15 hover:text-white"
        >
          {isActive ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={resetTimer}
          className="h-9 w-9 rounded-full bg-white/5 text-gray-200 hover:bg-white/15 hover:text-white"
        >
          <RotateCcw size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={removeMinute}
          className="h-9 w-9 rounded-full bg-white/5 text-gray-200 hover:bg-white/15 hover:text-white"
        >
          <Minus size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={addMinute}
          className="h-9 w-9 rounded-full bg-white/5 text-gray-200 hover:bg-white/15 hover:text-white"
        >
          <Plus size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Timer;
