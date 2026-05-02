'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Download,
  Trash2,
  Search,
} from 'lucide-react'

interface AuditRecord {
  id: string
  patient_id: string
  transfusion_type: string
  transfusion_date: string
  appropriateness_rating: string
  clinical_indication: string
  created_at: string
}

export function AuditsList() {
  const [audits, setAudits] = useState<AuditRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState<string>('all')

  useEffect(() => {
    fetchAudits()
  }, [])

  const fetchAudits = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('audit_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAudits(data || [])
    } catch (error) {
      console.error('Error fetching audits:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAudits = audits.filter((audit) => {
    const matchesSearch =
      audit.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.clinical_indication
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterRating === 'all' || audit.appropriateness_rating === filterRating
    return matchesSearch && matchesFilter
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this audit record?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('audit_records')
        .delete()
        .eq('id', id)

      if (error) throw error
      setAudits(audits.filter((a) => a.id !== id))
    } catch (error) {
      console.error('Error deleting audit:', error)
      alert('Error deleting audit record')
    }
  }

  const handleExportCSV = () => {
    if (filteredAudits.length === 0) {
      alert('No audits to export')
      return
    }

    const headers = [
      'Patient ID',
      'Component',
      'Date',
      'Appropriateness',
      'Indication',
      'Created',
    ]
    const rows = filteredAudits.map((audit) => [
      audit.patient_id,
      audit.transfusion_type,
      audit.transfusion_date,
      audit.appropriateness_rating,
      audit.clinical_indication,
      new Date(audit.created_at).toLocaleDateString(),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audits-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Adecuada':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'Inadecuada':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'Dudosa':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'Adecuada':
        return <CheckCircle className="h-4 w-4" />
      case 'Inadecuada':
        return <AlertCircle className="h-4 w-4" />
      case 'Dudosa':
        return <HelpCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading audits...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient ID or indication..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Appropriateness
              </label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All</option>
                <option value="Adecuada">Appropriate (Green)</option>
                <option value="Dudosa">Questionable (Yellow)</option>
                <option value="Inadecuada">Inappropriate (Red)</option>
              </select>
            </div>
            <Button onClick={handleExportCSV} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Audit Records ({filteredAudits.length} of {audits.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAudits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No audit records found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">
                      Patient ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Component
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Indication
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudits.map((audit) => (
                    <tr key={audit.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {audit.patient_id}
                      </td>
                      <td className="px-4 py-3">{audit.transfusion_type}</td>
                      <td className="px-4 py-3">
                        {new Date(audit.transfusion_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getRatingColor(
                            audit.appropriateness_rating
                          )}`}
                        >
                          {getRatingIcon(audit.appropriateness_rating)}
                          {audit.appropriateness_rating}
                        </div>
                      </td>
                      <td className="px-4 py-3 truncate max-w-xs">
                        {audit.clinical_indication}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(audit.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(audit.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
