import { Button } from 'components/core/Button'
import { Quiz } from 'components/layout/Quiz'
import { loadFromLocalStorage } from 'helpers'
import { FC, useCallback, useState } from 'react'
import { LocalStorageKey } from 'types/common'

export const App: FC = () => {
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(() =>
    loadFromLocalStorage<boolean>(LocalStorageKey.IS_QUIZ_STARTED, false)
  )

  const handleStart = useCallback(() => {
    setIsQuizStarted(true)
    localStorage.setItem(LocalStorageKey.IS_QUIZ_STARTED, 'true')
  }, [])

  const handleReset = useCallback(() => setIsQuizStarted(false), [])

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      {!isQuizStarted ? <Button onClick={handleStart} label="START" /> : <Quiz onReset={handleReset} />}
    </div>
  )
}
