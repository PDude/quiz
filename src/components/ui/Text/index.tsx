import { FC, memo, useCallback } from 'react'

interface TextProps {
  label: string
  type: 'subtitle' | 'body' | 'plain'
}

export const Text: FC<TextProps> = memo(({ label, type }) => {
  const textStyles = useCallback(() => {
    switch (type) {
      case 'subtitle':
        return 'text-xl font-bold text-xl'
      case 'body':
        return 'text-md font-bold text-base'
      case 'plain':
        return 'text-sm text-base'
    }
  }, [type])()

  return <p className={`${textStyles} text-white`}>{label}</p>
})
