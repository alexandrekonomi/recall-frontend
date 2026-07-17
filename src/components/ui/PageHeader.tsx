interface PageHeaderProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function PageHeader({ icon, title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#E8F8F9' }}
          >
            <span style={{ color: '#14B7C1' }}>{icon}</span>
          </div>
          <div>
            <h1 className="text-[24px] font-bold leading-tight" style={{ color: '#4F525A' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-[13px] mt-0.5" style={{ color: '#9CA3AF' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
      <div className="h-px mt-6" style={{ backgroundColor: '#E3E6EA' }} />
    </div>
  )
}