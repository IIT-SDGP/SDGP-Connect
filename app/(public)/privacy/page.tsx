// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Cookie, Eye, FileText, Globe, Lock, Mail, Settings, Shield, Users } from 'lucide-react';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  const lastUpdated = "June 5, 2025";

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: Shield,
      content: `This Privacy Policy explains how SDGP.LK ("we", "our", or "us") collects, uses, stores, and protects the personal information of users who visit or interact with our platform. By using our platform, you consent to the practices described in this policy. SDGP.LK is committed to protecting your privacy and ensuring transparency about our data practices.`
    },
    {
      id: "information-collected",
      title: "What Information We Collect",
      icon: Eye,
      content: `We collect various types of information to provide and improve our services:`,
      details: [
        "Personal Information: Name, email address, contact number",
        "Project Information: Project details, descriptions, methodologies, and attachments",
        "Media Content: Profile photos, project cover images, and gallery images",
        "Technical Data: IP address, browser type, device information, and usage patterns",
        "Team Information: Team member details and collaboration preferences",
        "Optional Data: Social media links, academic affiliations, and professional information"
      ]
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      icon: Settings,
      content: `Your information is used for the following purposes:`,
      details: [
        "Publishing and showcasing submitted projects on our platform",
        "Sending confirmation emails and project status updates",
        "Facilitating user login and account management",
        "Enabling collaboration and communication between users",
        "Improving platform performance and user experience",
        "Academic evaluation and grading (where applicable)",
        "Providing customer support and responding to inquiries",
        "Maintaining platform security and preventing misuse"
      ]
    },
    {
      id: "information-sharing",
      title: "How We Share Your Information",
      icon: Users,
      content: `We are committed to protecting your privacy and limiting data sharing:`,
      details: [
        "Public Display: Project details (excluding private contact information) are displayed publicly",
        "Collaboration: Contact information is shared only with collaborators you approve",
        "Academic Partners: Information may be shared with educational institutions for evaluation purposes",
        "No Third-Party Sales: We never sell your personal data to third parties",
        "Legal Requirements: Information may be disclosed when required by law or to protect our rights",
        "Service Providers: Trusted partners who help us operate the platform under strict confidentiality agreements"
      ]
    },
    {
      id: "cookies-tracking",
      title: "Cookies & Tracking",
      icon: Cookie,
      content: `We use cookies and similar technologies to enhance your experience:`,
      details: [
        "Essential Cookies: Required for login functionality and platform performance",
        "Analytics: Anonymized usage data to understand user behavior and improve services",
        "Browser Control: You can manage cookie settings through your browser preferences",
        "Third-Party Analytics: Google Analytics and similar services may collect anonymized data"
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: `We implement robust security measures to protect your information:`,
      details: [
        "Encryption: All data transmission uses HTTPS encryption",
        "Secure Storage: Data is stored on secured cloud infrastructure with encryption at rest",
        "Access Control: Strict access controls limit who can view sensitive information",
        "Regular Audits: We conduct security assessments and updates regularly",
        "Data Backup: Regular backups ensure data availability and recovery capabilities"
      ]
    },
    {
      id: "user-rights",
      title: "Your Rights",
      icon: FileText,
      content: `You have several rights regarding your personal data:`,
      details: [
        "Access: Request a copy of all personal data we hold about you",
        "Correction: Request correction of inaccurate or incomplete information",
        "Deletion: Request removal of your personal data (subject to legal requirements)",
        "Withdrawal: Withdraw consent for data processing at any time",
        "Support: Contact our support team for privacy-related concerns"
      ]
    },
    {
      id: "data-retention",
      title: "Data Retention",
      icon: Clock,
      content: `Our data retention practices are designed to balance service provision with privacy:`,
      details: [
        "Project Data: Public project submissions are retained indefinitely unless removal is requested",
        "Personal Contact Information: Retained only as long as necessary for account verification and communication",
        "Academic Records: May be retained longer for educational evaluation and verification purposes",
        "Technical Logs: Automatically deleted after a reasonable period unless required for security or legal purposes",
        "Inactive Accounts: Data from inactive accounts may be archived or deleted after extended periods of inactivity"
      ]
    },
    {
      id: "policy-changes",
      title: "Changes to This Policy",
      icon: AlertTriangle,
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make significant changes, we will notify users through email or prominent platform announcements. The "Last Updated" date at the top of this policy indicates when it was most recently revised. We encourage you to review this policy periodically to stay informed about our privacy practices.`
    }
  ];

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
              <Shield className="w-8 h-8" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6"
          >
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Badge variant="secondary" className="text-sm">
              Last Updated: {lastUpdated}
            </Badge>
          </motion.div>
        </motion.div>

        {/* Policy Sections */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              variants={itemVariants}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <section.icon className="w-5 h-5" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {section.content}
                    </p>
                    {section.details && (
                      <ul className="space-y-2">
                        {section.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0"></div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
                    <Mail className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Questions About Your Privacy?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  If you have any questions about this Privacy Policy or how we handle your data, please don't hesitate to contact us.
                </p>
                <div className="space-y-4">
                  <div className="text-muted-foreground">
                    <strong>Contact Information:</strong>
                    <br />
                    Email: <a href="mailto:support@sdgp.lk" className="text-primary hover:underline">support@sdgp.lk</a>
                    <br />
                    Platform: SDGP.LK
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="rounded-full">
                      <Link href="/contact">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Support
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full">
                      <Link href="/faq">
                        <FileText className="w-4 h-4 mr-2" />
                        View FAQ
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Navigation - Mobile Responsive */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-12"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5" />
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {sections.slice(0, 8).map((section) => (
                    <Button
                      key={section.id}
                      variant="ghost"
                      size="sm"
                      asChild
                      className="justify-start text-left h-auto py-3 px-4 whitespace-normal"
                    >
                      <a href={`#${section.id}`} className="flex items-start gap-2">
                        <section.icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-tight">{section.title}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;