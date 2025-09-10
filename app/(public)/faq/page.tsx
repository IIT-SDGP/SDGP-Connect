// © 2025 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, BookOpen, ChevronDown, ChevronUp, GraduationCap, HelpCircle, Info, Mail, MessageCircle, Search, Upload, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      id: 1,
      category: "General",
      icon: MessageCircle,
      question: "What is SDGP.LK?",
      answer: "SDGP.LK is a collaborative platform built to showcase and support sustainable development projects aligned with the UN Sustainable Development Goals (SDGs). It connects students, researchers, professionals, and institutions to foster innovation, learning, and action toward global impact.",
      tags: ["platform", "sdg", "about"]
    },
    {
      id: 2,
      category: "General",
      icon: Info,
      question: "Who can submit projects on SDGP.LK?",
      answer: "Informatics Institute of Technology students only.",
      tags: ["submission", "iit", "students", "eligibility"]
    },
    {
      id: 3,
      category: "General",
      icon: Users,
      question: "Who can use SDGP.LK?",
      answer: "Anyone passionate about sustainability is welcome! Whether you're a student, educator, researcher, NGO, government agency, or tech enthusiast, SDGP.LK is designed to support your engagement with meaningful projects and global goals.",
      tags: ["users", "eligibility", "access"]
    },
    {
      id: 4,
      category: "Platform",
      icon: HelpCircle,
      question: "Is there a cost to use the platform?",
      answer: "No. SDGP.LK is completely free to use. Our aim is to remove financial barriers to participation and promote open collaboration for sustainable development. We are supported by academic institutions, grants, and partnerships.",
      tags: ["cost", "free", "pricing"]
    },
    {
      id: 5,
      category: "Support",
      icon: Mail,
      question: "How can I contact support?",
      answer: "You can reach us via the 'Contact' page, join our peer support forum, or explore our help center. For urgent queries, our dedicated support team responds within 24 hours.",
      tags: ["support", "contact", "help"]
    },
    {
      id: 6,
      category: "Projects",
      icon: BookOpen,
      question: "What types of projects are featured on the platform?",
      answer: "SDGP.LK features projects across all 17 SDGs—from climate action and education to clean energy, innovation, and public health. These projects span local initiatives and international collaborations and may involve academic research, community outreach, or technical solutions.",
      tags: ["projects", "types", "sdgs", "categories"]
    },
    {
      id: 7,
      category: "Platform",
      icon: Search,
      question: "How do I search for specific projects?",
      answer: "Visit the 'Projects' section and use our advanced filters to search by SDG, project type, tech stack, location, timeline, and more. Our smart search helps match your interests with relevant initiatives.",
      tags: ["search", "filter", "discovery"]
    },
    {
      id: 8,
      category: "Collaboration",
      icon: Users,
      question: "Can I collaborate with other users on projects?",
      answer: "Yes! Each project includes options to connect with its team, propose collaboration, or join efforts. We also host regular networking events and discussion forums to foster partnerships.",
      tags: ["collaboration", "networking", "partnership"]
    },
    {
      id: 9,
      category: "Project Submission",
      icon: Zap,
      question: "What information do I need to submit a project?",
      answer: `To submit your project, you will need the following: project title and description, SDG alignment, objectives, methodology, team members, tech stack (if applicable), cover image, at least 3 gallery images, contact number, email, and expected outcomes. Be sure to review submission instructions before sending.`,
      tags: ["submission", "requirements", "information", "media"]
    },
    {
      id: 10,
      category: "General",
      icon: BookOpen,
      question: "Are there resources for learning about SDGs?",
      answer: "Yes, we provide curated learning materials including SDG guides, case studies, project reports, and links to UN documentation. These help students and professionals build SDG-aligned knowledge and impact strategies.",
      tags: ["learning", "resources", "education", "sdgs"]
    }, {
      id: 11,
      category: "Project Submission",
      icon: AlertCircle,
      question: "How long does the review process take?",
      answer: "All submissions are carefully reviewed and approved or rejected. The review process typically takes 0-2 days. Please be patient as our team ensures each project meets our quality standards and platform guidelines.",
      tags: ["review", "approval", "timeline", "processing"]
    },
    {
      id: 12,
      category: "Project Submission",
      icon: Upload,
      question: "Can I edit my project after submission?",
      answer: "No, once submitted, you cannot edit your project. If you need to make changes, you'll need to resubmit the entire project with the correct information. Please review your submission carefully before submitting.",
      tags: ["editing", "resubmission", "changes", "final"]
    },
    {
      id: 13,
      category: "Project Submission",
      icon: Users,
      question: "Do all team members need to submit separately?",
      answer: "No, only one member from your team needs to submit the project form. However, make sure you have permission from all team members and that all their information is accurately included in the submission.",
      tags: ["team", "group", "submission", "members"]
    },
    {
      id: 14,
      category: "Project Submission",
      icon: MessageCircle,
      question: "What happens after my project is approved or rejected?",
      answer: "Approved projects will receive a confirmation email to the provided email address. If rejected, you'll receive feedback explaining the reasons. Read the feedback carefully and resubmit correctly if needed. After submission, you may review your entry on the platform.",
      tags: ["approval", "rejection", "feedback", "confirmation"]
    },
    {
      id: 15,
      category: "Project Submission",
      icon: AlertTriangle,
      question: "What are the consequences of providing false information?",
      answer: "Providing false information in your project submission is considered an offense and may result in rejection of your project, academic penalties (if applicable), and potential restrictions on future submissions. Always ensure all information is accurate and truthful.",
      tags: ["false", "information", "offense", "academic", "consequences"]
    },
    {
      id: 16,
      category: "Project Submission",
      icon: GraduationCap,
      question: "How does submission affect my academic marks?",
      answer: "Failure to submit your project may impact your academic marks if this platform is being used as part of your coursework. Contact your instructor or institution for specific grading criteria and submission requirements.",
      tags: ["academic", "marks", "grading", "coursework", "failure"]
    },
    {
      id: 17,
      category: "General",
      icon: Info,
      question: "Who created SDGP.LK?",
      answer: "SDGP.LK was collaboratively designed and developed by a group of dedicated contributors passionate about digital innovation and social impact. From user experience to visual identity, the platform was thoughtfully built to support meaningful collaboration around sustainable development goals.",
      tags: ["creators", "design", "development", "psycodeLab's", "team", "zion", "Agzaiyenth","Psycode Lab's"]
    },
    {
      id: 18,
      category: "Project Submission",
      icon: Upload,
      question: "How can I submit a project?",
      answer: `To submit a project, go to the 'Submit Project' section in the menu and complete the form with all required details. Make sure to include your project's cover image, a minimum of 3 gallery images, contact number, and email. Only one member per team should submit. Once submitted, your project will be reviewed within 0–2 days. Edits are not allowed post-submission, but you may resubmit if needed. Approved projects receive a confirmation email.`,
      tags: ["submit", "project", "form", "instructions", "cover image"]
    }

  ];


  const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <HelpCircle className="w-8 h-8" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
          >
            Frequently Asked Questions
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Find answers to common questions about SDGP.LK, our platform features, and how to get the most out of your sustainable development journey.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base rounded-full border-2 focus:border-primary/50"
            />
          </motion.div>

          {/* Category Filter */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full transition-all duration-200 hover:scale-105"
              >
                {category}
              </Button>
            ))}
          </motion.div>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          {filteredFaqs.length === 0 ? (
            <motion.div variants={itemVariants}>
              <Card className="p-8 text-center border-dashed">
                <div className="flex flex-col items-center gap-4">
                  <Search className="w-12 h-12 text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No results found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                variants={itemVariants}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary/60">
                  <Collapsible
                    open={openItems.includes(faq.id)}
                    onOpenChange={() => toggleFAQ(faq.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="p-6 cursor-pointer hover:bg-muted/30 transition-colors duration-200">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-grow">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                              <faq.icon className="w-5 h-5" />
                            </div>
                            <div className="text-left flex-grow">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  {faq.category}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-lg leading-tight">
                                {faq.question}
                              </h3>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {openItems.includes(faq.id) ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground transition-transform duration-200" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="px-6 pb-6 pt-0">
                        <div className="pl-14">
                          <div className="prose prose-sm max-w-none text-muted-foreground">
                            <p className="leading-relaxed">{faq.answer}</p>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            {faq.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => setSearchQuery(tag)}
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-16"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Can't find what you're looking for? Our support team is here to help you succeed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/contact">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full">
                    <Link href="/about">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learn More
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
