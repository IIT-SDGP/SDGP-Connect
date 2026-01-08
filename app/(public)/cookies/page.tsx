// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { AlertTriangle, BarChart3, Cookie, Eye, FileText, Globe, Lock, Mail, Server, Settings, Shield, Users } from 'lucide-react';
import Link from 'next/link';

const CookiePolicyPage = () => {
  const lastUpdated = "June 5, 2025";

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: Cookie,
      content: `This Cookie Policy explains how SDGP.LK ("we", "our", or "us") uses cookies and similar technologies to recognize you when you visit our website. It outlines what these technologies are, why we use them, and your rights to control their use. This policy works alongside our Privacy Policy to ensure you understand how your data is handled.`
    },
    {
      id: "what-are-cookies",
      title: "What Are Cookies?",
      icon: Eye,
      content: `Cookies are small text files stored on your device (computer, tablet, or smartphone) when you visit a website. They help the site function properly, remember your preferences, and improve your browsing experience. Cookies contain information that is transferred to your computer's hard drive and allow websites to recognize your browser and capture certain information.`,
      details: [
        "Session Cookies: Temporary cookies that are deleted when you close your browser",
        "Persistent Cookies: Remain on your device for a set period or until you delete them",
        "First-Party Cookies: Set directly by SDGP.LK",
        "Third-Party Cookies: Set by external services we use on our platform"
      ]
    },
    {
      id: "types-of-cookies",
      title: "Types of Cookies We Use",
      icon: Settings,
      content: `We use different categories of cookies to provide you with the best possible experience on SDGP.LK:`,
      subcategories: [
        {
          title: "Essential Cookies",
          icon: Shield,
          description: "These cookies are necessary for the website to function and cannot be switched off.",
          examples: [
            "Authentication cookies for secure login sessions",
            "Session tokens to maintain your logged-in state",
            "Security cookies to prevent cross-site request forgery",
            "Load balancing cookies to distribute traffic efficiently"
          ]
        },
        {
          title: "Performance & Analytics Cookies",
          icon: BarChart3,
          description: "These cookies help us understand how visitors interact with our website.",
          examples: [
            "Google Analytics cookies for anonymized usage statistics",
            "Page performance tracking cookies",
            "Error tracking and debugging cookies",
            "User journey analysis cookies"
          ]
        },
        {
          title: "Functionality Cookies",
          icon: Globe,
          description: "These cookies enable enhanced functionality and personalization.",
          examples: [
            "Language preference cookies",
            "Theme selection (dark/light mode) cookies",
            "Project filter and search preference cookies",
            "User interface customization cookies"
          ]
        },
        {
          title: "Third-Party Cookies",
          icon: Server,
          description: "These cookies are set by external services integrated into our platform.",
          examples: [
            "Cloudinary cookies for image optimization and delivery",
            "Vercel edge caching cookies for improved performance",
            "OAuth provider cookies for social login functionality",
            "CDN cookies for faster content delivery"
          ]
        }
      ]
    },
    {
      id: "how-we-use-cookies",
      title: "How We Use Cookies",
      icon: Users,
      content: `We use cookies to enhance your experience and improve our platform in the following ways:`,
      details: [
        "Authenticate users and manage secure login sessions",
        "Remember your preferences such as theme, language, and project filters",
        "Track and analyze platform performance to identify areas for improvement",
        "Detect and fix bugs or layout issues across different devices",
        "Provide personalized content and project recommendations",
        "Ensure platform security and prevent unauthorized access",
        "Enable social sharing and collaboration features",
        "Optimize page loading times and overall user experience"
      ]
    },
    {
      id: "cookie-control",
      title: "How You Can Control Cookies",
      icon: Lock,
      content: `You have several options to control how cookies are used on your device:`,
      details: [
        "Browser Settings: Most browsers allow you to refuse or delete cookies through their settings menu",
        "Cookie Preferences: You can manage non-essential cookies through our cookie banner (when available)",
        "Clear Data: You can clear existing cookies at any time through your browser",
        "Selective Blocking: Many browsers allow you to block specific types of cookies",
        "Privacy Extensions: Browser extensions can provide additional cookie control options"
      ],
      browserInstructions: [
        {
          browser: "Google Chrome",
          instructions: "Settings > Privacy and Security > Cookies and other site data"
        },
        {
          browser: "Mozilla Firefox",
          instructions: "Options > Privacy & Security > Cookies and Site Data"
        },
        {
          browser: "Safari",
          instructions: "Preferences > Privacy > Manage Website Data"
        },
        {
          browser: "Microsoft Edge",
          instructions: "Settings > Cookies and site permissions > Cookies and site data"
        }
      ]
    },
    {
      id: "cookie-impact",
      title: "Impact of Disabling Cookies",
      icon: AlertTriangle,
      content: `While you can disable cookies, please note that this may impact your experience on SDGP.LK:`,
      details: [
        "Essential Functionality: Disabling essential cookies may prevent login and core platform features",
        "Personalization: Your preferences and customizations may not be saved",
        "Performance: Some features may load slower or not work optimally",
        "Analytics: We may not be able to improve the platform based on usage patterns",
        "Security: Some security features may be compromised",
        "Remember: You can still browse public content without accepting non-essential cookies"
      ]
    },
    {
      id: "data-retention",
      title: "Cookie Data Retention",
      icon: FileText,
      content: `Different types of cookies are retained for varying periods:`,
      details: [
        "Session Cookies: Automatically deleted when you close your browser",
        "Authentication Cookies: Typically expire after 30 days of inactivity",
        "Preference Cookies: Stored for up to 1 year or until manually cleared",
        "Analytics Cookies: Google Analytics cookies expire after 24 months",
        "Performance Cookies: Usually expire after 1 year",
        "You can manually clear all cookies at any time through your browser settings"
      ]
    },
    {
      id: "updates",
      title: "Updates to This Policy",
      icon: AlertTriangle,
      content: `We may update this Cookie Policy from time to time to reflect changes in technology, law, or our services. When we make significant changes, we will notify users through email or prominent platform announcements. The "Last Updated" date at the top of this policy indicates when it was most recently revised. We encourage you to review this policy periodically to stay informed about our cookie practices.`
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
              <Cookie className="w-8 h-8" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
          >
            Cookie Policy
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6"
          >
            Learn how we use cookies to enhance your experience on SDGP.LK and how you can control them.
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

                    {/* Regular details list */}
                    {section.details && (
                      <ul className="space-y-2 mb-4">
                        {section.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0"></div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Subcategories for cookie types */}
                    {section.subcategories && (
                      <div className="space-y-6 mt-6">
                        {section.subcategories.map((subcat, idx) => (
                          <div key={idx} className="border-l-2 border-primary/20 pl-4">
                            <div className="flex items-center gap-2 mb-2">
                              <subcat.icon className="w-4 h-4 text-primary" />
                              <h4 className="font-semibold text-foreground">{subcat.title}</h4>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">{subcat.description}</p>
                            <ul className="space-y-1">
                              {subcat.examples.map((example, exIdx) => (
                                <li key={exIdx} className="flex items-start gap-2 text-muted-foreground text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 flex-shrink-0"></div>
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Browser instructions for cookie control */}
                    {section.browserInstructions && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-foreground mb-3">Browser-Specific Instructions:</h4>
                        <div className="grid gap-3">
                          {section.browserInstructions.map((instruction, idx) => (
                            <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-2">
                              <div className="font-medium text-sm text-foreground">{instruction.browser}</div>
                              <div className="text-muted-foreground text-sm break-words">{instruction.instructions}</div>
                            </div>
                          ))}
                        </div>
                      </div>
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
                <h3 className="text-2xl font-bold mb-3">Questions About Cookies?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  If you have any questions about our use of cookies or this Cookie Policy, please don't hesitate to contact us.
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
                      <Link href="/privacy">
                        <Shield className="w-4 h-4 mr-2" />
                        Privacy Policy
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

        {/* Quick Navigation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-12"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Related Policies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild variant="ghost" className="h-auto p-4 justify-start">
                    <Link href="/privacy">
                      <Shield className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Privacy Policy</div>
                        <div className="text-sm text-muted-foreground">How we protect your data</div>
                      </div>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="h-auto p-4 justify-start">
                    <Link href="/faq">
                      <FileText className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">FAQ</div>
                        <div className="text-sm text-muted-foreground">Common questions answered</div>
                      </div>
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

export default CookiePolicyPage;
