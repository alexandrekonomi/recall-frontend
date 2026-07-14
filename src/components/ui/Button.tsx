interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg transition-all duration-150
    cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
    font-[Inter]
  `

  const variants = {
    primary: 'bg-[#14B7C1] hover:bg-[#0F98A1] text-white',
    secondary: 'border-2 border-[#14B7C1] text-[#14B7C1] hover:bg-[#14B7C1]/10 bg-white',
    ghost: 'text-[#4F525A] hover:bg-[#F5F7F9] bg-transparent',
    destructive: 'bg-red-500 hover:bg-red-600 text-white',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-sm',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  )
}