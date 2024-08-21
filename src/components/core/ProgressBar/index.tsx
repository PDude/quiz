import { FC, memo } from 'react'

interface ProgressBarProps {
  progress: number
}

export const ProgressBar: FC<ProgressBarProps> = memo(({ progress }) => (
  <div className="w-full bg-gray-300 rounded-full border-gray-300 border">
    <div
      className="bg-gray-600 h-1.5 rounded-full transition-width duration-500 ease"
      style={{ width: `${progress}%` }}
    />
  </div>
))
