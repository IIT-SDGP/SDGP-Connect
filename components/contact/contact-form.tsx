// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2, CheckCircle2, Zap, Phone, Mail,MapPin } from "lucide-react"

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = "Please enter your name."
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address."
    }
    
    if (!formData.interest || formData.interest.length < 5) {
      newErrors.interest = "Let us know your interest."
    }
    
    if (!formData.message || formData.message.length < 20) {
      newErrors.message = "Please describe your inquiry."
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleCall = () => {
    window.open('tel:+94777781061', '_self')
  }

  const handleMail = () => {
    window.open('mailto:banu.a@iit.ac.lk?subject=Inquiry&body=Hello, I would like to get in touch regarding...', '_self')
  }

  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white overflow-hidden">
      <div className="h-full max-w-7xl mx-auto px-8 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full h-full items-center">
          
          {/* Left Section - Title and Info */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-5 py-2.5 w-fit">
              <Zap className="size-5 text-primary" />
              <span className="text-base font-medium">Contact Us</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Let's Connect & <span className="text-primary">Collaborate</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
              Ready to explore partnerships, investments, or collaborations? We'd love to hear from you and discuss how we can work together.
            </p>
            {/* Address */}
            <div className="flex items-center space-x-1 pl-2">
              <MapPin className="opacity-80" />
              <span className="opacity-80">
              IIT Address: 57 Ramakrishna Rd, Colombo 00600
              </span>
            </div>
           
            {/* Buttons */}
            <div className=" flex w-full flex-col justify-center gap-3 sm:gap-4 sm:flex-row lg:justify-start">
              
              {/* Call Button */}
              <Button
                variant="outline"
                className="group relative w-full overflow-hidden sm:w-auto lg:text-base xl:text-lg"
                size="lg"
                onClick={handleCall}
              >
                <div className="absolute inset-0 bg-primary/10 transition-transform group-hover:translate-y-full" />
                <Phone className="mr-2 size-4 lg:size-5" />
                Call Us -  (+94) 777781061
              </Button>

              {/* Email Button */}
              <Button
                size="lg"
                className="group w-full sm:w-auto lg:text-base xl:text-lg"
                onClick={handleMail}
              >
                <Mail className="ml-2 size-4 lg:size-5 transition-transform group-hover:translate-x-1" />
                Email Us - sdgp@iit.ac.lk
              </Button>
            </div>

            


          </div>
          {/* Right Section - Contact Form */}
          <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-lg bg-background border">
              <CardHeader>
                <h3 className="text-2xl font-semibold">Get in Touch</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name</label>
                  <Input 
                    placeholder="John Doe" 
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Company / Organization</label>
                  <Input 
                    placeholder="Your Company or Organization Name" 
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Interest</label>
                  <Input 
                    placeholder="Investment, collaboration, talent acquisition..." 
                    value={formData.interest}
                    onChange={(e) => handleInputChange('interest', e.target.value)}
                  />
                  {errors.interest && <p className="text-red-500 text-sm mt-1">{errors.interest}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <Textarea 
                    placeholder="Tell us more about how you'd like to collaborate..." 
                    rows={4} 
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="resize-none" 
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start space-y-3 pt-4">
                <Button 
                  onClick={handleSubmit}
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
                {isSuccess && (
                  <div className="flex items-center gap-2 text-green-500 text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Thank you for reaching out!
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}