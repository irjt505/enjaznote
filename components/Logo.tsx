import Image from 'next/image'

interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/pp.png"
        alt="انجاز نوت"
        width={44}
        height={44}
        priority
        className="size-11 rounded-lg object-contain"
      />
      <div>
        <span className="text-lg font-bold leading-tight text-white">انجاز نوت</span>
        <p className="text-[10px] leading-tight text-accent font-medium tracking-wider uppercase">INJAZ NOTE</p>
      </div>
    </div>
  )
}
