import { useEffect, useMemo, useState } from 'react'

type MaskedValueProps =
  | {
      value: string
      mode?: 'display'
      className?: string
    }
  | {
      value: string
      mode: 'input'
      className?: string
      onChange: (value: string) => void
      placeholder?: string
      ariaInvalid?: boolean
    }

function getMaskedValue(value: string) {
  const length = Math.max(12, Math.min(value.length, 18))
  return '•'.repeat(length)
}

export function MaskedValue(props: MaskedValueProps) {
  const [revealed, setRevealed] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const maskedValue = useMemo(() => getMaskedValue(props.value), [props.value])

  useEffect(() => {
    if (!revealed) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setRevealed(false)
    }, 15000)

    return () => window.clearTimeout(timeoutId)
  }, [revealed])

  useEffect(() => {
    if (copyState === 'idle') {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setCopyState('idle')
    }, 1600)

    return () => window.clearTimeout(timeoutId)
  }, [copyState])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.value)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <div className={`vault-masked-value ${props.className ?? ''}`.trim()}>
      <div className="vault-masked-value__surface">
        {props.mode === 'input' ? (
          <input
            type={revealed ? 'text' : 'password'}
            value={props.value}
            onChange={(event) => props.onChange(event.target.value)}
            placeholder={props.placeholder}
            aria-invalid={props.ariaInvalid}
          />
        ) : (
          <code aria-live="polite">{revealed ? props.value : maskedValue}</code>
        )}
      </div>
      <div className="vault-masked-value__actions">
        <button
          type="button"
          className="vault-action vault-action--secondary"
          onClick={() => setRevealed((current) => !current)}
        >
          {revealed ? 'Hide' : 'Reveal'}
        </button>
        <button type="button" className="vault-action vault-action--secondary" onClick={handleCopy}>
          Copy
        </button>
        <span className="vault-masked-value__status" aria-live="polite">
          {revealed ? 'Auto-hides in 15s' : copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Masked'}
        </span>
      </div>
    </div>
  )
}
