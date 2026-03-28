'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ScanLine, BookOpen, BarChart2, Settings, Sprout } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/detect', label: 'Detect', icon: ScanLine },
  { href: '/guide', label: 'Crops', icon: BookOpen },
  { href: '/prices', label: 'Prices', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Navbar() {
  const pathname = usePathname()

  // Hide navbar on auth pages
  if (pathname === '/login' || pathname === '/register') return null

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-[240px] min-h-screen fixed left-0 top-0 p-4 gap-2"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2 px-3 py-4 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Sprout size={18} color="white" />
          </div>
          <span className="text-lg font-bold text-white">KisanAI</span>
        </div>

        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.75)',
              }}
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around h-[60px] border-t z-50"
        style={{ backgroundColor: 'var(--color-white)', borderColor: 'var(--color-neutral-200)' }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 flex-1 py-2"
              style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-neutral-500)' }}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
