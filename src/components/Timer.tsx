
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

interface TimerProps {
  defaultMinutes?: number;
}

const Timer: React.FC<TimerProps> = ({ defaultMinutes = 5 }) => {
  const [totalSeconds, setTotalSeconds] = useState(defaultMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    <div className="flex flex-col items-center gap-2 p-3 bg-gray-950/50 backdrop-blur-sm rounded-lg">
      <div className={`text-3xl font-mono font-bold ${getTimerColor()}`}>
        {formatTime()}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTimer}
          className="bg-gray-950/70; text-gray-100 hover:bg-gray-800"
        >
          {isActive ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetTimer}
          className="bg-gray-950/70; text-gray-100 hover:bg-gray-800"
        >
          <RotateCcw size={18} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={removeMinute}
          className="bg-gray-950/70; text-gray-100 hover:bg-gray-800"
        >
          <Minus size={18} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addMinute}
          className="bg-gray-950/70; text-gray-100 hover:bg-gray-800"
        >
          <Plus size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Timer;
