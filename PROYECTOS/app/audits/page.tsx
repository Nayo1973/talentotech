import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navigation } from '@/components/navigation'
import { AuditsList } from '@/components/audits-list'

export default async function AuditsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <>
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Audit Records</h1>
          <p className="text-gray-600 mt-2">
            View, filter, and manage all transfusion audit records
          </p>
        </div>
        <AuditsList />
      </main>
    </>
  )
}
