interface ImagePlaceholderProps {
  className?: string
}

export function ImagePlaceholder({ className = '' }: ImagePlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center bg-slate-800 text-slate-500 text-xs font-medium ${className}`}
      role="img"
      aria-label="No image available"
    >
      <span>No Image</span>
    </div>
  )
}

