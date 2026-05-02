'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const auditFormSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  patient_age: z.coerce.number().min(0).max(150),
  patient_gender: z.enum(['M', 'F', 'O']),
  transfusion_type: z.string().min(1, 'Transfusion type is required'),
  transfusion_date: z.string().min(1, 'Transfusion date is required'),
  clinical_indication: z.string().min(1, 'Clinical indication is required'),
  hemoglobin_before: z.coerce.number().optional(),
  hemoglobin_after: z.coerce.number().optional(),
  notes: z.string().optional(),
})

type AuditFormData = z.infer<typeof auditFormSchema>

interface ClassificationResult {
  rating: 'Adecuada' | 'Inadecuada' | 'Dudosa'
  reason: string
}

function classifyTransfusion(data: Partial<AuditFormData>): ClassificationResult {
  // Simple logic for traffic light classification
  const hemDrop = data.hemoglobin_before && data.hemoglobin_after 
    ? data.hemoglobin_before - data.hemoglobin_after 
    : 0

  // Red flags for inappropriate transfusions
  const inappropriateFlags = []
  const appropriateFlags = []
  const questionableFlags = []

  // Check hemoglobin levels
  if (data.hemoglobin_before && data.hemoglobin_before > 10) {
    inappropriateFlags.push('Hemoglobin > 10 g/dL before transfusion')
  }
  if (data.hemoglobin_before && data.hemoglobin_before < 7) {
    appropriateFlags.push('Hemoglobin < 7 g/dL (clear indication)')
  }
  if (
    data.hemoglobin_before &&
    data.hemoglobin_before >= 7 &&
    data.hemoglobin_before <= 10
  ) {
    questionableFlags.push('Hemoglobin 7-10 g/dL (requires clinical evaluation)')
  }

  // Classify based on flags
  if (inappropriateFlags.length > 0 && appropriateFlags.length === 0) {
    return {
      rating: 'Inadecuada',
      reason: inappropriateFlags.join(', '),
    }
  }

  if (questionableFlags.length > 0) {
    return {
      rating: 'Dudosa',
      reason: questionableFlags.join(', '),
    }
  }

  if (appropriateFlags.length > 0) {
    return {
      rating: 'Adecuada',
      reason: appropriateFlags.join(', '),
    }
  }

  return {
    rating: 'Dudosa',
    reason: 'Additional clinical evaluation needed',
  }
}

export function AuditForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [classification, setClassification] = useState<ClassificationResult | null>(
    null
  )
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
  })

  const formData = watch()

  // Update classification as user fills form
  if (formData.hemoglobin_before !== undefined) {
    const newClassification = classifyTransfusion(formData)
    if (
      !classification ||
      classification.rating !== newClassification.rating
    ) {
      setClassification(newClassification)
    }
  }

  const onSubmit = async (data: AuditFormData) => {
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const classification_result = classifyTransfusion(data)

      const { error } = await supabase.from('audit_records').insert([
        {
          user_id: user.id,
          patient_id: data.patient_id,
          patient_age: data.patient_age,
          patient_gender: data.patient_gender,
          transfusion_type: data.transfusion_type,
          transfusion_date: data.transfusion_date,
          clinical_indication: data.clinical_indication,
          appropriateness_rating: classification_result.rating,
          risk_factors: {
            hemoglobin_before: data.hemoglobin_before,
            hemoglobin_after: data.hemoglobin_after,
          },
          notes: data.notes,
        },
      ])

      if (error) throw error

      router.push('/audits')
    } catch (error) {
      console.error('Submission error:', error)
      alert('Error submitting audit record')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getClassificationColor = (rating: string) => {
    switch (rating) {
      case 'Adecuada':
        return 'text-green-600 bg-green-50'
      case 'Inadecuada':
        return 'text-red-600 bg-red-50'
      case 'Dudosa':
        return 'text-amber-600 bg-amber-50'
      default:
        return ''
    }
  }

  const getClassificationIcon = (rating: string) => {
    switch (rating) {
      case 'Adecuada':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'Inadecuada':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'Dudosa':
        return <HelpCircle className="h-5 w-5 text-amber-600" />
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>New Transfusion Audit Record</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="patient_id">Patient ID</Label>
                <Input
                  id="patient_id"
                  placeholder="12345"
                  {...register('patient_id')}
                />
                {errors.patient_id && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.patient_id.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="patient_age">Age</Label>
                <Input
                  id="patient_age"
                  type="number"
                  placeholder="45"
                  {...register('patient_age')}
                />
              </div>
              <div>
                <Label htmlFor="patient_gender">Gender</Label>
                <select
                  id="patient_gender"
                  className="w-full px-3 py-2 border rounded-md"
                  {...register('patient_gender')}
                >
                  <option value="">Select gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transfusion Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Transfusion Details</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="transfusion_type">Blood Component</Label>
                <select
                  id="transfusion_type"
                  className="w-full px-3 py-2 border rounded-md"
                  {...register('transfusion_type')}
                >
                  <option value="">Select component</option>
                  <option value="Red Blood Cells">Red Blood Cells (RBC)</option>
                  <option value="Plasma">Fresh Frozen Plasma (FFP)</option>
                  <option value="Platelets">Platelets</option>
                  <option value="Cryoprecipitate">Cryoprecipitate</option>
                </select>
                {errors.transfusion_type && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.transfusion_type.message}
                  </p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="transfusion_date">Date of Transfusion</Label>
                  <Input
                    id="transfusion_date"
                    type="date"
                    {...register('transfusion_date')}
                  />
                  {errors.transfusion_date && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.transfusion_date.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Clinical Information</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="clinical_indication">Clinical Indication</Label>
                <textarea
                  id="clinical_indication"
                  placeholder="Reason for transfusion..."
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  {...register('clinical_indication')}
                />
                {errors.clinical_indication && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.clinical_indication.message}
                  </p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="hemoglobin_before">
                    Hemoglobin Before (g/dL)
                  </Label>
                  <Input
                    id="hemoglobin_before"
                    type="number"
                    step="0.1"
                    placeholder="7.5"
                    {...register('hemoglobin_before')}
                  />
                </div>
                <div>
                  <Label htmlFor="hemoglobin_after">Hemoglobin After (g/dL)</Label>
                  <Input
                    id="hemoglobin_after"
                    type="number"
                    step="0.1"
                    placeholder="9.0"
                    {...register('hemoglobin_after')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Light Classification */}
          {classification && (
            <div
              className={`p-4 rounded-lg border-2 flex items-start gap-3 ${getClassificationColor(
                classification.rating
              )}`}
            >
              {getClassificationIcon(classification.rating)}
              <div className="flex-1">
                <h4 className="font-semibold">
                  Classification: {classification.rating}
                </h4>
                <p className="text-sm mt-1">{classification.reason}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <textarea
              id="notes"
              placeholder="Any additional observations..."
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              {...register('notes')}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit Audit'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
