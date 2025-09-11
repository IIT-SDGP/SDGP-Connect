// © 2025 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import React from 'react'
import { Card } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ExternalLink, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { IProjectSocialLink, IProjectTeam } from '@/types/project/type'
import Image from 'next/image'
import { socialPlatformMap } from '@/lib/types/mapping'

interface Props {
    teamEmail?: string
    teamPhone?: string
    projectTitle?: string
    teamMembers: IProjectTeam[]
    teamSocials: IProjectSocialLink[]

}

const Teamandsocial = ({ teamEmail, teamPhone, teamMembers, teamSocials, projectTitle }: Props) => {
    return (
        <Card className="mt-8 p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact & Team Details</h2>
            <Tabs defaultValue="contact" className="w-full">
                {/* Tabs List - horizontal like original */}
                <TabsList className="flex gap-2 w-full sm:w-auto">
                    <TabsTrigger
                        value="contact"
                        className="px-4 py-2 truncate text-center"
                    >
                        Contact
                    </TabsTrigger>
                    <TabsTrigger
                        value="team"
                        className="px-4 py-2 truncate text-center"
                    >
                        Team
                    </TabsTrigger>
                </TabsList>

                {/* Contact Tab */}
                <TabsContent value="contact">
                    <div className="grid gap-4 sm:grid-cols-2 mt-5">
                        <a
                            href={`mailto:${teamEmail || 'team@example.com'}`}
                            className="block rounded-lg transition hover:bg-muted/40 hover:scale-[1.01] duration-150"
                        >
                            <Card className="p-4 h-full cursor-pointer">
                                <h3 className="text-xl font-bold mb-2">Team Email</h3>
                                <p className="text-muted-foreground">
                                    {teamEmail || 'team@example.com'}
                                </p>
                            </Card>
                        </a>
                            {teamPhone && teamPhone !== '0000000000' && (
                            <a
                                href={`https://api.whatsapp.com/send?phone=${teamPhone.replace(/\D/g, '')}&text=${encodeURIComponent(
                                    `👋 Hey there! I'm interested in learning more about your project "${projectTitle}". Could you please share more details?`
                                )}`}
                                onClick={(e) => {
                                    // Optional fallback for non-WhatsApp users
                                    if (!navigator.userAgent.includes('Mobile')) {
                                        e.preventDefault();
                                        window.location.href = `tel:${teamPhone}`;
                                    }
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg transition hover:bg-muted/40 hover:scale-[1.01] duration-150"
                            >
                                <Card className="p-4 h-full cursor-pointer">
                                    <h3 className="text-xl font-bold mb-2">WhatsApp / Call</h3>
                                    <p className="text-muted-foreground">
                                        {teamPhone}
                                    </p>
                                </Card>
                            </a>
                        )}

                    </div>

                    <div className="grid gap-4 sm:grid-cols-6 mt-5">
                        {teamSocials.map((social, index) => {
                            const platform = socialPlatformMap[social.link_name];
                            if (!platform) return null;
                            const Icon = platform.icon;
                            return (
                                <Link
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="no-underline"
                                >
                                    <Card className="py-4 pr-4 pl-0 flex items-center hover:bg-muted/40 hover:scale-[1.01] transition duration-150 group cursor-pointer w-full">
                                        <div className="flex items-center gap-3 pl-4 flex-shrink-0">
                                            <Icon className="h-6 w-6 text-primary" />
                                            <span className="font-semibold text-lg">
                                                {platform.label}
                                            </span>
                                        </div>
                                        <div className="flex-1 flex justify-center">
                                            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                                        </div>
                                    </Card>

                                </Link>
                            );
                        })}
                    </div>
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value="team">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-5">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-4 flex flex-col items-center w-full transition hover:bg-muted/40 hover:scale-[1.01] duration-150"
                            >
                                <Image
                                    src={member.profile_image || "/user.png"}
                                    alt={member.name}
                                    className="w-20 h-20 rounded-full mb-4"
                                    width={80}
                                    height={80}
                                />
                                <h3
                                    className="text-xl font-bold truncate text-center w-full max-w-full"
                                    title={member.name}
                                >
                                    {member.name}
                                </h3>
                                {member.linkedin_url && (
                                    <Link
                                        href={member.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 mt-2 flex items-center gap-2"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </Card>
    )
}

export default Teamandsocial