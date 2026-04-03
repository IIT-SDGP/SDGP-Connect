// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ActionCard, { type ActionCardProps } from '@/components/dashboard/ActionCard'
import RecentActivityTable from '@/components/dashboard/RecentActivityTable'
import useGetActivity from '@/hooks/dashboard/useGetActivity'

function getTimeGreeting(date: Date) {
    const hour = date.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
}

interface StudentDashboardClientProps {
    actionCards: ActionCardProps[]
}

export default function StudentDashboardClient({ actionCards }: StudentDashboardClientProps) {
    const { data: session } = useSession()
    const { activities, isLoading, error } = useGetActivity()

    const [greeting, setGreeting] = useState(() => getTimeGreeting(new Date()))

    useEffect(() => {
        const id = window.setInterval(() => setGreeting(getTimeGreeting(new Date())), 60_000)
        return () => window.clearInterval(id)
    }, [])

    const userName = session?.user?.name?.trim() || 'there'

    return (
        <>
            <div className='mb-8 animate-fade-in'>
                <h1 className='text-3xl font-bold tracking-tight'>
                    {greeting}, {userName}
                </h1>
                <p className='text-muted-foreground mt-2'>Here's what's been happening recently.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in'>
                {actionCards.map((card, i) => (
                    <ActionCard key={i} {...card} />
                ))}
            </div>

            <RecentActivityTable activities={activities} isLoading={isLoading} error={error} />
        </>
    )
}