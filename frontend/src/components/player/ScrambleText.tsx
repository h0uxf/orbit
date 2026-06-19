import { useEffect, useState, type CSSProperties } from 'react';

interface ScrambleTextProps {
  text: string;
  isScrambling: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ScrambleText({ text, isScrambling, className, style }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!isScrambling) {
      setDisplay(text);
      return;
    }
    const chars = '!<>-_\\/[]{}—=+*^?#$%&';
    let n = 0;
    const id = setInterval(() => {
      n++;
      setDisplay(
        text
          .split('')
          .map((c) => {
            if (c === ' ') return ' ';
            if (n > 10 && Math.random() > 0.5) return c;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
    }, 50);
    return () => {
      clearInterval(id);
      setDisplay(text);
    };
  }, [isScrambling, text]);

  return (
    <div
      className={className}
      style={{
        ...style,
        fontVariantNumeric: 'tabular-nums',
        color: isScrambling ? 'var(--accent-m)' : style?.color || 'var(--text-0)',
        transition: 'color 0.2s',
      }}
    >
      {display}
    </div>
  );
}
