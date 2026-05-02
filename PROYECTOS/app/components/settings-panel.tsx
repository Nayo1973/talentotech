'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: string
  department: string | null
}

export function SettingsPanel() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [department, setDepartment] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfile(data)
        setFullName(data.full_name || '')
        setDepartment(data.department || '')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName,
          department: department,
        })
        .eq('id', profile.id)

      if (error) throw error

      setProfile({ ...profile, full_name: fullName, department })
      alert('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* User Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || ''}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              type="text"
              placeholder="e.g., Hematology"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              type="text"
              value={profile?.role || 'auditor'}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Contact administrator to change role
            </p>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>

      {/* System Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Hospital</Label>
            <p className="text-gray-900">
              Hospital Universitario Susana López de Valencia
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">System</Label>
            <p className="text-gray-900">
              Transfusion Appropriateness Audit Dashboard
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Version</Label>
            <p className="text-gray-900">1.0.0</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Data Protection</Label>
            <p className="text-gray-900">
              HIPAA Compliant - Colombian Law 1581
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Help & Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Traffic Light System</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span>
                  <strong>Adecuada (Green):</strong> Appropriate transfusion
                  per guidelines
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span>
                  <strong>Inadecuada (Red):</strong> Inappropriate transfusion
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                <span>
                  <strong>Dudosa (Yellow):</strong> Requires clinical
                  evaluation
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Hemoglobin Ranges</h4>
            <ul className="text-sm space-y-1">
              <li>
                <strong>{`<`}7 g/dL:</strong> Clear indication for transfusion
              </li>
              <li>
                <strong>7-10 g/dL:</strong> Requires clinical judgment
              </li>
              <li>
                <strong>{`>`}10 g/dL:</strong> Generally not indicated
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
