'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface SuccessPageProps {
  projectId: string | null;
}

const SuccessPage = ({ projectId }: SuccessPageProps) => {
  const router = useRouter();

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-background border md:p-12 flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.2 
        }}
        className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 dark:bg-green-900/30"
      >
        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
      </motion.div>

      <motion.h1 
        className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Project Submitted Successfully!
      </motion.h1>

      <motion.p 
        className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Your project has been submitted and is now pending approval. You can view your project details below or submit another project.
      </motion.p>

      <motion.div 
        className="flex flex-col sm:flex-row gap-4 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {projectId && (
          <Button onClick={() => router.push(`/project/${projectId}`)} className="flex items-center gap-2">
            <span>View Project</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
        
        <Button variant="outline" onClick={() => router.push('/dashboard/submit/project')}>
          Submit Another Project
        </Button>
        
        <Button variant="ghost" onClick={() => router.push('/')}>
          Return to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
