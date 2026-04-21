'use client';

import { ApprovalStatus } from '@/types/prisma-types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { AwardStatusBadge } from '@/components/student/status-badges';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { awardPayloadSchema } from '@/validations/award';
import useUploadImageToBlob from '@/hooks/azure/useUploadImageToBlob';

type StudentAwardFormProps = {
  awardId?: string;
};

type Option = {
  id: string;
  label: string;
  sublabel?: string;
};

type AwardPayload = {
  projectId: string;
  competitionId: string;
  awardName: string;
  image: string;
  approvalStatus?: ApprovalStatus;
  rejectedReason?: string | null;
};

export default function StudentAwardForm({ awardId }: StudentAwardFormProps) {
  const router = useRouter();
  const { uploadImage } = useUploadImageToBlob();

  const [projects, setProjects] = useState<Option[]>([]);
  const [competitions, setCompetitions] = useState<Option[]>([]);
  const [formData, setFormData] = useState<AwardPayload>({
    projectId: '',
    competitionId: '',
    awardName: '',
    image: '',
  });
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [projectResponse, competitionResponse, awardResponse] = await Promise.all([
          fetch('/api/student/projects?page=1&limit=100'),
          fetch('/api/competition/search?limit=20'),
          awardId ? fetch(`/api/student/awards/${awardId}`) : Promise.resolve(null),
        ]);

        const projectPayload = await projectResponse.json();
        if (!projectResponse.ok) {
          throw new Error(projectPayload?.error || 'Failed to load your projects');
        }

        const competitionPayload = await competitionResponse.json();
        if (!competitionResponse.ok) {
          throw new Error(competitionPayload?.error || 'Failed to load competitions');
        }

        const projectOptions: Option[] = (projectPayload.data ?? []).map((project: any) => ({
          id: project.projectId,
          label: project.title,
          sublabel: `${project.groupNum} | ${project.year}`,
        }));

        let competitionOptions: Option[] = (competitionPayload ?? []).map((competition: any) => ({
          id: competition.id,
          label: competition.name,
          sublabel: [competition.start_date, competition.end_date]
            .filter(Boolean)
            .map((value: string) => new Date(value).toLocaleDateString())
            .join(' - '),
        }));

        setProjects(projectOptions);

        if (awardId) {
          if (!awardResponse) {
            throw new Error('Failed to load award');
          }

          const awardPayload = await awardResponse.json();
          if (!awardResponse.ok) {
            throw new Error(awardPayload?.error || 'Failed to load award');
          }

          const award = awardPayload.data;
          setFormData({
            projectId: award.project_id,
            competitionId: award.competition_id,
            awardName: award.name,
            image: award.image ?? '',
            approvalStatus: award.approval_status,
            rejectedReason: award.rejected_reason ?? null,
          });

          if (!competitionOptions.some((option) => option.id === award.competition.id)) {
            competitionOptions = [
              ...competitionOptions,
              {
                id: award.competition.id,
                label: award.competition.name,
              },
            ];
          }
        }

        setCompetitions(competitionOptions);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load award form');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [awardId]);

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      let imageUrl = formData.image;
      if (pendingImageFile) {
        imageUrl = await uploadImage(pendingImageFile);
      }

      const payload = {
        projectId: formData.projectId,
        competitionId: formData.competitionId,
        awardName: formData.awardName,
        image: imageUrl,
      };

      const validation = awardPayloadSchema.safeParse(payload);
      if (!validation.success) {
        const errors: Record<string, string> = {};
        for (const issue of validation.error.errors) {
          const key = Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path);
          errors[key] = issue.message;
        }
        setFieldErrors(errors);
        setIsSaving(false);
        return;
      }

      const response = await fetch(awardId ? `/api/student/awards/${awardId}` : '/api/student/awards', {
        method: awardId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to save award');
      }

      toast.success(awardId ? 'Award updated' : 'Award created');
      router.push('/student/awards');
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save award');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-48 w-full' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {awardId && formData.approvalStatus ? (
        <div className='flex items-center gap-3'>
          <AwardStatusBadge status={formData.approvalStatus} />
          {formData.rejectedReason ? (
            <p className='text-destructive text-sm'>Reason: {formData.rejectedReason}</p>
          ) : null}
        </div>
      ) : null}

      {errorMessage ? (
        <Alert variant='destructive'>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className='space-y-4 rounded-xl border p-5'>
        <div>
          <h2 className='text-xl font-semibold'>Award Details</h2>
          <p className='text-muted-foreground text-sm'>
            Awards are tied to projects you own. Editing a rejected award sends it back for review.
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='award-project'>Project</Label>
            <select
              id='award-project'
              value={formData.projectId}
              onChange={(event) => setFormData((current) => ({ ...current, projectId: event.target.value }))}
              className='border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            >
              <option value=''>Select one of your projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.label}{project.sublabel ? ` (${project.sublabel})` : ''}
                </option>
              ))}
            </select>
            {fieldErrors.projectId ? (
              <p className='text-destructive text-xs'>{fieldErrors.projectId}</p>
            ) : null}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='award-competition'>Competition</Label>
            <select
              id='award-competition'
              value={formData.competitionId}
              onChange={(event) =>
                setFormData((current) => ({ ...current, competitionId: event.target.value }))
              }
              className='border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            >
              <option value=''>Select a competition</option>
              {competitions.map((competition) => (
                <option key={competition.id} value={competition.id}>
                  {competition.label}{competition.sublabel ? ` (${competition.sublabel})` : ''}
                </option>
              ))}
            </select>
            {fieldErrors.competitionId ? (
              <p className='text-destructive text-xs'>{fieldErrors.competitionId}</p>
            ) : null}
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='award-name'>Award Name</Label>
          <Input
            id='award-name'
            value={formData.awardName}
            onChange={(event) => setFormData((current) => ({ ...current, awardName: event.target.value }))}
            placeholder='Best Innovation Award'
          />
          {fieldErrors.awardName ? (
            <p className='text-destructive text-xs'>{fieldErrors.awardName}</p>
          ) : null}
        </div>

        <div className='space-y-2'>
          <Label>Award Image</Label>
          <Input
            id='award-image-file'
            type='file'
            accept='image/png,image/jpeg'
            aria-label='Upload award image'
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setPendingImageFile(file);

              if (previewObjectUrlRef.current) {
                URL.revokeObjectURL(previewObjectUrlRef.current);
                previewObjectUrlRef.current = null;
              }

              if (file) {
                const objectUrl = URL.createObjectURL(file);
                previewObjectUrlRef.current = objectUrl;
                setImagePreview(objectUrl);
              } else {
                setImagePreview(null);
              }
            }}
          />
          {fieldErrors.image ? (
            <p className='text-destructive text-xs'>{fieldErrors.image}</p>
          ) : null}
          {imagePreview || formData.image ? (
            <img
              src={imagePreview ?? formData.image}
              alt='Award preview'
              className='max-h-72 rounded-lg border object-contain'
            />
          ) : null}
        </div>

        <div className='flex flex-wrap gap-3'>
          <Button onClick={() => void handleSubmit()} disabled={isSaving}>
            {isSaving ? 'Saving...' : awardId ? 'Save Changes' : 'Create Award'}
          </Button>
          <Button variant='outline' asChild>
            <Link href='/student/awards'>Cancel</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
