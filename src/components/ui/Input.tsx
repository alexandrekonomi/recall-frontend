interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-[#4F525A]">{label}</label>
      )}
      <input
        className={`
          w-full px-3 py-2.5 rounded-lg border text-sm text-[#4F525A] bg-white
          outline-none transition-all duration-150
          ${error
            ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-[#E3E6EA] focus:border-[#14B7C1] focus:ring-2 focus:ring-[#14B7C1]/20'
          }
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}