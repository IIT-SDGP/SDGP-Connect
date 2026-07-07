// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import Link from 'next/link'

export interface ActionCardProps {
    icon: React.ReactNode
    title: string
    description: string
    buttonLabel: string
    href: string
}

export default function ActionCard({ icon, title, description, buttonLabel, href }: ActionCardProps) {
    return (
        <div className='rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow'>
            <div className='text-primary'>{icon}</div>
            <div className='flex-1'>
                <h3 className='text-lg font-bold tracking-tight mb-1'>{title}</h3>
                <p className='text-sm text-muted-foreground leading-relaxed'>{description}</p>
            </div>
            <Link
                href={href}
                className='inline-flex items-center justify-center rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity w-fit'
            >
                {buttonLabel}
            </Link>
        </div>
    )
}