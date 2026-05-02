import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navigation } from '@/components/navigation'
import { AuditForm } from '@/components/audit-form'

export default async function AuditPage() {
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Audit</h1>
          <p className="text-gray-600 mt-2">
            Create a new transfusion appropriateness audit record
          </p>
        </div>
        <AuditForm />
      </main>
    </>
  )
}
