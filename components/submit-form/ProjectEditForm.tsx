'use client'

import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormProvider, useForm, type FieldErrors, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSubmissionSchema, type ProjectSubmissionSchema } from '@/validations/submit_project'
import { toast } from 'sonner'
import FormStepper from './FormStepper'
import FormStep1 from './FormStep1'
import FormStep2 from './FormStep2'
import FormStep3 from './FormStep3'
import FormStep4 from './FormStep4'
import FormStep5 from './FormStep5'
import { useSubmitProjectEdit } from '@/hooks/project/useSubmitProjectEdit'
import useUploadImageToBlob from '@/hooks/azure/useUploadImageToBlob'
import { compressImageFile } from './utils/compressImageFile'
import { UploadingSequence } from '@/components/ui/UploadingSequence'
import type { Dispatch, SetStateAction } from 'react'

const TOTAL_STEPS = 5

type ProjectEditFormProps = {
  projectId: string
  initialSnapshot: ProjectSubmissionSchema
}

function splitTeamPhone(teamPhone: string | undefined) {
  const trimmed = teamPhone?.trim() ?? ''
  if (!trimmed) return { country_code: '+94', phone_number: '' }
  if (!trimmed.startsWith('+')) return { country_code: '+94', phone_number: trimmed.replace(/\D/g, '').slice(0, 10) }

  const digits = trimmed.slice(1).replace(/\D/g, '')
  for (let len = 1; len <= 4; len += 1) {
    const phoneNumber = digits.slice(len)
    if (phoneNumber.length >= 1 && phoneNumber.length <= 10) {
      return { country_code: `+${digits.slice(0, len)}`, phone_number: phoneNumber }
    }
  }

  return { country_code: '+94', phone_number: digits.slice(2, 12) }
}

function normalizeInitialSnapshot(snapshot: ProjectSubmissionSchema): ProjectSubmissionSchema {
  const phone = splitTeamPhone(snapshot.projectDetails?.team_phone)

  return {
    ...snapshot,
    projectDetails: {
      ...snapshot.projectDetails,
      country_code: snapshot.projectDetails.country_code || phone.country_code,
      phone_number: snapshot.projectDetails.phone_number || phone.phone_number,
      team_phone:
        snapshot.projectDetails.team_phone ||
        (phone.phone_number ? `${phone.country_code}${phone.phone_number}` : ''),
    },
    sdgGoals: snapshot.sdgGoals ?? [],
    socialLinks: snapshot.socialLinks ?? [],
    team: snapshot.team ?? [],
    slides: snapshot.slides ?? [],
  }
}

function flattenErrorPaths(errors: FieldErrors, prefix = ''): string[] {
  return Object.entries(errors).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (!value || typeof value !== 'object') return [path]
    if ('message' in value && value.message) return [path]
    return flattenErrorPaths(value as FieldErrors, path)
  })
}

export default function ProjectEditForm({ projectId, initialSnapshot }: ProjectEditFormProps) {
  const router = useRouter()
  const { submitEdit, isSubmitting, warning } = useSubmitProjectEdit(projectId)
  const { uploadImage } = useUploadImageToBlob()

  const initialMetadata = initialSnapshot.metadata
  const initialTeam = initialSnapshot.team ?? []
  const initialSlides = initialSnapshot.slides ?? []

  // Local file state is used by the step components to show previews and detect changes.
  const [currentStep, setCurrentStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(initialMetadata.logo ?? null)

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(initialMetadata.cover_image ?? null)

  const [slideFiles, setSlideFiles] = useState<File[]>([])
  const [slidePreviews, setSlidePreviews] = useState<string[]>(
    initialSlides.map((s) => s.slides_content)
  )

  const [teamProfileFiles, setTeamProfileFiles] = useState<(File | null)[]>(
    initialTeam.map(() => null)
  )
  const [teamProfilePreviews, setTeamProfilePreviews] = useState<(string | null)[]>(
    initialTeam.map((m) => m.profile_image ?? null)
  )

  const defaultValues = useMemo<ProjectSubmissionSchema>(
    () => normalizeInitialSnapshot(initialSnapshot),
    [initialSnapshot]
  )

  const methods = useForm<ProjectSubmissionSchema>({
    resolver: zodResolver(projectSubmissionSchema),
    defaultValues,
    mode: 'onBlur',
  })

  const fieldsToValidateByStep = useMemo(() => {
    return {
      1: [
        'metadata.group_num',
        'metadata.sdgp_year',
        'metadata.title',
        'metadata.subtitle',
        'metadata.website',
        'metadata.cover_image',
        'metadata.logo',
      ],
      2: ['projectDetails.problem_statement', 'projectDetails.solution', 'projectDetails.features', 'slides'],
      3: ['techStack', 'projectTypes', 'status.status', 'sdgGoals', 'domains'],
      4: ['socialLinks', 'projectDetails.team_email', 'projectDetails.country_code', 'projectDetails.phone_number', 'projectDetails.team_phone'],
      5: ['team'],
    } as const
  }, [])

  const handleNext = async () => {
    const fieldsToValidate = fieldsToValidateByStep[currentStep as keyof typeof fieldsToValidateByStep]

    const results = await Promise.all(fieldsToValidate.map((field) => methods.trigger(field as any)))
    const isValid = results.every(Boolean)
    if (!isValid) {
      toast.error('Please complete all required fields', {
        description: 'Check the highlighted fields and ensure all required information is provided.',
      })
      return
    }

    // Upload only newly-changed images based on local file state.
    if (currentStep === 1) {
      // Upload logo / cover only if the user selected new files.
      if (logoFile || coverFile) {
        setIsUploading(true)
        try {
          if (logoFile) {
            const compressedLogo = await compressImageFile(logoFile, 'logo')
            const logoUrl = await uploadImage(compressedLogo)
            methods.setValue('metadata.logo', logoUrl, { shouldValidate: true })
            setLogoPreviewUrl(logoUrl)
            setLogoFile(null)
          }
          if (coverFile) {
            const compressedCover = await compressImageFile(coverFile, 'cover_image')
            const coverUrl = await uploadImage(compressedCover)
            methods.setValue('metadata.cover_image', coverUrl, { shouldValidate: true })
            setCoverPreviewUrl(coverUrl)
            setCoverFile(null)
          }
        } catch (e) {
          console.error('Logo/Cover upload failed:', e)
          toast.error('Image upload failed. Please try again.')
          return
        } finally {
          setIsUploading(false)
        }
      }
    }

    if (currentStep === 2) {
      // Upload slide files only if the user added new ones.
      if (slideFiles.length > 0) {
        setIsUploading(true)
        try {
          const urls: string[] = []
          for (const file of slideFiles) {
            const compressedSlide = await compressImageFile(file, 'slide')
            const url = await uploadImage(compressedSlide)
            urls.push(url)
          }

          methods.setValue(
            'slides',
            urls.map((url) => ({ slides_content: url })),
            { shouldValidate: true }
          )
          setSlidePreviews(urls)
          setSlideFiles([])
        } catch (e) {
          console.error('Slide upload failed:', e)
          toast.error('Slide image upload failed. Please try again.')
          return
        } finally {
          setIsUploading(false)
        }
      }
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const getStepForField = (fieldPath: string) => {
    if (fieldPath.startsWith('metadata.')) return 1
    if (fieldPath.startsWith('projectDetails.problem_statement')) return 2
    if (fieldPath.startsWith('projectDetails.solution')) return 2
    if (fieldPath.startsWith('projectDetails.features')) return 2
    if (fieldPath.startsWith('slides')) return 2
    if (
      fieldPath.startsWith('techStack') ||
      fieldPath.startsWith('projectTypes') ||
      fieldPath.startsWith('status.') ||
      fieldPath.startsWith('sdgGoals') ||
      fieldPath.startsWith('domains')
    ) return 3
    if (fieldPath.startsWith('projectDetails.') || fieldPath.startsWith('socialLinks')) return 4
    if (fieldPath.startsWith('team')) return 5
    return currentStep
  }

  const onInvalid = (errors: FieldErrors<ProjectSubmissionSchema>) => {
    const [firstPath] = flattenErrorPaths(errors)
    if (firstPath) {
      setCurrentStep(getStepForField(firstPath))
    }

    console.error('Project edit validation blocked submit:', errors)
    toast.error('Could not submit yet', {
      description: firstPath
        ? `Please fix the highlighted field: ${firstPath}`
        : 'Please check the form for missing or invalid fields.',
    })
  }

  const onSubmit: SubmitHandler<ProjectSubmissionSchema> = async (data) => {
    try {
      let submissionData = data

      // Upload team profile images only if the student changed them.
      const hasProfileImages = teamProfileFiles.some((f) => f !== null)
      if (hasProfileImages) {
        setIsUploading(true)
        try {
          const currentTeam = [...data.team]
          const updatedTeam = await Promise.all(
            currentTeam.map(async (member, i) => {
              const file = teamProfileFiles[i]
              if (file) {
                const compressedTeam = await compressImageFile(file, 'team')
                const url = await uploadImage(compressedTeam)
                return { ...member, profile_image: url }
              }
              return member
            })
          )
          methods.setValue('team', updatedTeam, { shouldValidate: true })
          setTeamProfileFiles(updatedTeam.map(() => null))
          setTeamProfilePreviews(updatedTeam.map((m) => m.profile_image ?? null))
          submissionData = { ...data, team: updatedTeam }
        } finally {
          setIsUploading(false)
        }
      }

      const result = await submitEdit(submissionData)
      if (result.success) {
        toast.success('Edit submitted', {
          description:
            result.mode === 'RESUBMITTED_REJECTED_PROJECT'
              ? 'Your corrected project has been sent back for review.'
              : 'Admins will review your changes and either approve or reject them.',
        })
        router.push('/dashboard/projects')
        return
      }

      toast.error('Edit submission failed', {
        description: result.details || result.message || 'Unknown error occurred',
      })
    } catch (err: any) {
      console.error('Error during edit submission:', err)
      toast.error('Edit submission failed', {
        description: err?.message || 'Unknown error occurred',
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <div className='rounded-xl bg-white p-6 shadow-sm dark:bg-background border md:p-8'>
        {warning ? (
          <div className='mb-4 text-sm text-muted-foreground'>
            {warning}
          </div>
        ) : null}

        <FormStepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <form onSubmit={methods.handleSubmit(onSubmit, onInvalid)} className='mt-6 space-y-8'>
          {currentStep === 1 ? (
            <FormStep1
              logoFile={logoFile}
              setLogoFile={setLogoFile as Dispatch<SetStateAction<File | null>>}
              logoPreviewUrl={logoPreviewUrl}
              setLogoPreviewUrl={setLogoPreviewUrl}
              coverFile={coverFile}
              setCoverFile={setCoverFile as Dispatch<SetStateAction<File | null>>}
              coverPreviewUrl={coverPreviewUrl}
              setCoverPreviewUrl={setCoverPreviewUrl}
              lockYearAndGroup
            />
          ) : null}

          {currentStep === 2 ? (
            <FormStep2
              slideFiles={slideFiles}
              setSlideFiles={setSlideFiles}
              slidePreviews={slidePreviews}
              setSlidePreviews={setSlidePreviews}
            />
          ) : null}

          {currentStep === 3 ? <FormStep3 /> : null}
          {currentStep === 4 ? <FormStep4 /> : null}

          {currentStep === 5 ? (
            <FormStep5
              teamProfileFiles={teamProfileFiles}
              setTeamProfileFiles={setTeamProfileFiles}
              teamProfilePreviews={teamProfilePreviews}
              setTeamProfilePreviews={setTeamProfilePreviews}
            />
          ) : null}

          <div className='flex justify-between pt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting || isUploading}
            >
              Previous
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button type='button' onClick={handleNext} disabled={isSubmitting || isUploading}>
                {isSubmitting || isUploading ? <UploadingSequence /> : 'Next'}
              </Button>
            ) : (
              <Button type='submit' disabled={isSubmitting || isUploading}>
                {isSubmitting || isUploading ? <UploadingSequence /> : 'Submit Edit'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
