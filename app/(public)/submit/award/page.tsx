'use client'
import React, { useState, useEffect } from 'react'
import Image from "next/image";
import Stepper, { Step } from '@/components/Award/stepForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AsyncSelect } from "@/components/ui/async-select";
import { FlipText } from '@/components/magicui/flip-text';
import { AuroraText } from '@/components/magicui/aurora-text';
import { ItemDisplay } from '@/components/ui/item-display';
import { useAwardSubmission } from '@/hooks/awards/useAwardSubmission';
import { AwardSuccessCard } from '@/components/Award/AwardSuccessCard';
import { useRouter } from 'next/navigation';

// Types for the mapped data
interface ProjectOption {
  id: string;
  name: string;
  image: string;
  groupNumber: string;
  year: string;
}

interface CompetitionOption {
  id: string;
  name: string;
  image: string;
  startDate: string;
  endDate: string;
}

// Utility functions
const getAvatarUrl = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    return dateString;
  }
};

type Props = {}

const page = (props: Props) => {
  // Form state
  const [projectId, setProjectId] = useState("");
  const [competitionId, setCompetitionId] = useState("");
  const [awardName, setAwardName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);  
  const {
    isSubmitting,
    error,
    success,
    validationErrors,
    submitAward,
  } = useAwardSubmission();
  const router = useRouter();

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        router.push('/');
      }, 3500);
      return () => clearTimeout(timeout);
    }
  }, [success, router]);

  // Fetcher functions for AsyncSelect - these call the API directly
  const searchProjects = async (query?: string): Promise<ProjectOption[]> => {
    try {
      const response = await fetch(`/api/projects/search?q=${encodeURIComponent(query || '')}&limit=5`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      
      const projects = await response.json();
      return projects.map((project: any): ProjectOption => ({
        id: project.project_id,
        name: project.title,
        image: project.logo || getAvatarUrl(project.title),
        groupNumber: project.group_num,
        year: project.sdgp_year
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };

  const searchCompetitions = async (query?: string): Promise<CompetitionOption[]> => {
    try {
      const response = await fetch(`/api/competition/search?q=${encodeURIComponent(query || '')}&limit=5`);
      if (!response.ok) throw new Error('Failed to fetch competitions');
      
      const competitions = await response.json();
      return competitions.map((competition: any): CompetitionOption => ({
        id: competition.id,
        name: competition.name,
        image: competition.logo || getAvatarUrl(competition.name),
        startDate: competition.start_date,
        endDate: competition.end_date
      }));
    } catch (error) {
      console.error('Error fetching competitions:', error);
      return [];
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File type validation
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Please select a JPG or PNG image');
      return;
    }

    // File size validation (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submission handler for the last step
  const handleSubmit = async () => {
    if (!projectId || !competitionId || !awardName || !imageFile) return;
    await submitAward({
      projectId,
      competitionId,
      awardName,
      imageFile,
    });
  };

  if (success) {
    return <AwardSuccessCard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-4xl space-y-6">
   <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
      Submit your <AuroraText>Achievement</AuroraText>
    </h1>
          <Stepper
            initialStep={1}
            onStepChange={(step) => {
              console.log(step);
            }}
            onFinalStepCompleted={handleSubmit}
            backButtonText="Previous"
            nextButtonText="Next"
          >
            <Step>
              <h2 className="text-xl font-semibold mb-4">Select Project</h2>
              <p className="text-muted-foreground mb-6">Choose the project you want to award</p>              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Project</label>                <AsyncSelect<ProjectOption>
                  fetcher={searchProjects}
                  renderOption={(project: ProjectOption) => (
                    <ItemDisplay 
                      name={project.name}
                      image={project.image}
                      subtitle={`${project.groupNumber} | ${project.year}`}
                      getFallbackImage={getAvatarUrl}
                    />
                  )}
                  getOptionValue={(project: ProjectOption) => project.id}
                  getDisplayValue={(project: ProjectOption) => (
                    <ItemDisplay 
                      name={project.name}
                      image={project.image}
                      getFallbackImage={getAvatarUrl}
                      size="small"
                    />
                  )}
                  notFound={<div className="py-6 min-w-80 text-center text-sm">No projects found</div>}
                  loadingSkeleton={
                    <div className="p-4 min-w-80 text-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                      <p className="mt-2 text-sm text-muted-foreground">Loading projects...</p>
                    </div>
                  }                  label="Project"
                  placeholder="Search projects..."
                  value={projectId}
                  onChange={val => setProjectId(val || "")}
                  width="100%"
                  className="w-full"
                  triggerClassName="w-full"
                />
              </div>
            </Step>
            
            <Step>
              <h2 className="text-xl font-semibold mb-4">Select Competition</h2>
              <p className="text-muted-foreground mb-6">Choose which competition this award is for</p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Competition</label>                <AsyncSelect<CompetitionOption>
                  fetcher={searchCompetitions}                  renderOption={(competition: CompetitionOption) => (
                    <ItemDisplay 
                      name={competition.name}
                      image={competition.image}
                      subtitle={`${formatDate(competition.startDate)} - ${formatDate(competition.endDate)}`}
                      getFallbackImage={getAvatarUrl}
                    />
                  )}
                  getOptionValue={(competition: CompetitionOption) => competition.id}                  getDisplayValue={(competition: CompetitionOption) => (
                    <ItemDisplay 
                      name={competition.name}
                      image={competition.image}
                      getFallbackImage={getAvatarUrl}
                      size="small"
                    />
                  )}
                  notFound={<div className="py-6 text-center text-sm">No competitions found</div>}
                  loadingSkeleton={
                    <div className="p-4 text-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                      <p className="mt-2 text-sm text-muted-foreground">Loading competitions...</p>
                    </div>
                  }                  label="Competition"
                  placeholder="Search competitions..."
                  value={competitionId}
                  onChange={val => setCompetitionId(val || "")}
                  width="100%"
                  className="w-full"
                  triggerClassName="w-full"
                />
              </div>
            </Step>
            
            <Step>
              <h2 className="text-xl font-semibold mb-4">Award Details</h2>
              <p className="text-muted-foreground mb-6">Provide details about the award</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Award Name*</label>
                  <input 
                    type="text"
                    value={awardName}
                    onChange={(e) => setAwardName(e.target.value)}
                    placeholder="e.g., 1st Place / Best UI Designers"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Award Image*</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {!imagePreview ? (
                          <>
                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">JPG or PNG (Max. 5MB)</p>
                          </>
                        ) : (
                          <div className="relative w-full h-full flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={imagePreview} 
                              alt="Award preview" 
                              className="max-h-28 rounded-lg object-contain" 
                            />
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageChange}
                        required
                      />
                    </label>
                  </div>
                </div>
              </div>
            </Step>
          </Stepper>
        </div>
      </div>
  
  );
}

export default page