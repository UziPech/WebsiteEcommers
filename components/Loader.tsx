import React from 'react';
import { useProgress } from '@react-three/drei';

export const Loader: React.FC = () => {
  const { progress } = useProgress();
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="w-64 h-1 bg-stone-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-stone-800 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-xs font-bold tracking-widest text-stone-400">
        LOADING HERITAGE {Math.round(progress)}%
      </p>
    </div>
  );
};