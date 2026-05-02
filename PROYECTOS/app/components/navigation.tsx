'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Droplet, LogOut } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Droplet className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Auditar</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-primary transition"
            >
              Dashboard
            </Link>
            <Link
              href="/audit"
              className="text-gray-700 hover:text-primary transition"
            >
              New Audit
            </Link>
            <Link
              href="/audits"
              className="text-gray-700 hover:text-primary transition"
            >
              View Audits
            </Link>
            <Link
              href="/settings"
              className="text-gray-700 hover:text-primary transition"
            >
              Settings
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Dashboard
            </Link>
            <Link
              href="/audit"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              New Audit
            </Link>
            <Link
              href="/audits"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              View Audits
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Settings
            </Link>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
