// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

type ProjectSeed = {
    metadataId: string
    contentId: string
    title: string
    subtitle: string
    module: string
    website: string
    coverImage: string
    logo: string
    year: string
    group: string
    status: 'IDEA' | 'MVP' | 'RESEARCH' | 'DEPLOYED' | 'STARTUP'
    approval: 'PENDING' | 'APPROVED' | 'REJECTED'
    rejectedReason?: string
    featured: boolean
    domain: 'EDTECH' | 'FINTECH' | 'IOT'
    projectType: 'WEB' | 'MOBILE' | 'HARDWARE'
    sdg: 'QUALITY_EDUCATION' | 'DECENT_WORK' | 'SUSTAINABLE_CITIES'
    tech: 'TYPESCRIPT' | 'FLUTTER' | 'ARDUINO'
    problem: string
    solution: string
    features: string
    teamEmail: string
    teamPhone: string
}

type CompetitionSeed = {
    id: string
    name: string
    isFeatured: boolean
    startDate: string
    endDate: string
    description: string
    type: string
    logo: string
    coverImage: string
    schools: string
    module: string
    teamsParticipated: number
    projectsCompleted: number
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
}

type AwardSeed = {
    id: string
    name: string
    image: string
    competitionId: string
    projectId: string
    contentId: string
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
}

type BlogAuthorSeed = {
    id: string
    name: string
    email: string
    avatarUrl: string
    instagram: string
    twitter: string
    facebook: string
    linkedin: string
    medium: string
    website: string
}

type BlogSeed = {
    id: string
    title: string
    excerpt: string
    content: string
    imageUrl: string
    publishedAt: string
    authorId: string
    category: 'AI' | 'EDTECH' | 'FINTECH' | 'SUSTAINABILITY' | 'BLOCKCHAIN'
    featured: boolean
    approved: boolean
    rejected: boolean
    rejectedReason?: string
    module: string
}

async function main() {
    const adminUserId = await seedUsers()
    await seedProjects(adminUserId)
    await seedCompetitionsAndAwards(adminUserId)
    await seedBlogs(adminUserId)
    await runDataMigrations()
}

async function runDataMigrations() {
    console.log('No migrations to run currently.')
}

async function seedUsers() {
    const hashedPassword = await bcrypt.hash('12345678', 10)

    if (!(await prisma.user.findFirst({ where: { role: 'ADMIN' } }))) {
        await prisma.user.create({ data: { role: 'ADMIN', password: hashedPassword, name: 'Admin' } })
    }
    if (!(await prisma.user.findFirst({ where: { role: 'MODERATOR' } }))) {
        await prisma.user.create({ data: { role: 'MODERATOR', password: hashedPassword, name: 'Moderator' } })
    }
    if (!(await prisma.user.findFirst({ where: { role: 'DEVELOPER' } }))) {
        await prisma.user.create({ data: { role: 'DEVELOPER', password: hashedPassword, name: 'Developer' } })
    }

    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { user_id: true } })
    if (!admin) throw new Error('Admin user not found after seeding.')
    console.log('Users seeded successfully.')
    return admin.user_id
}

async function seedProjects(adminUserId: string) {
    const projects: ProjectSeed[] = [
        {
            metadataId: 'seed-project-approved-1',
            contentId: 'seed-content-approved-1',
            title: 'EduPulse Classroom Analytics',
            subtitle: 'Real-time classroom engagement analytics for lecturers',
            module: 'SE4010',
            website: 'https://edupulse-demo.example.com',
            coverImage: 'https://placehold.co/1600x900/png?text=EduPulse+Cover',
            logo: 'https://placehold.co/300x300/png?text=EP',
            year: '2026',
            group: 'Y4S1-G01',
            status: 'MVP',
            approval: 'APPROVED',
            featured: true,
            domain: 'EDTECH',
            projectType: 'WEB',
            sdg: 'QUALITY_EDUCATION',
            tech: 'TYPESCRIPT',
            problem: 'Educators cannot measure engagement quickly enough to intervene in struggling cohorts.',
            solution: 'EduPulse combines LMS activity and quiz outcomes into actionable dashboards.',
            features: '- Live engagement heatmaps\n- Cohort risk alerts\n- Weekly trend summaries',
            teamEmail: 'edupulse.team@sdgp.lk',
            teamPhone: '+94770000001',
        },
        {
            metadataId: 'seed-project-pending-1',
            contentId: 'seed-content-pending-1',
            title: 'FinTrack Student Budgeting',
            subtitle: 'Smart budgeting and bill reminders for university students',
            module: 'SE4030',
            website: 'https://fintrack-demo.example.com',
            coverImage: 'https://placehold.co/1600x900/png?text=FinTrack+Cover',
            logo: 'https://placehold.co/300x300/png?text=FT',
            year: '2026',
            group: 'Y4S1-G03',
            status: 'IDEA',
            approval: 'PENDING',
            featured: false,
            domain: 'FINTECH',
            projectType: 'MOBILE',
            sdg: 'DECENT_WORK',
            tech: 'FLUTTER',
            problem: 'Students miss payment cycles and overspend due to weak cost visibility.',
            solution: 'FinTrack offers adaptive budget plans with reminders and weekly spend insights.',
            features: '- Auto-tagging expenses\n- Weekly cashflow digest\n- Savings goal tracking',
            teamEmail: 'fintrack.team@sdgp.lk',
            teamPhone: '+94770000003',
        },
        {
            metadataId: 'seed-project-rejected-1',
            contentId: 'seed-content-rejected-1',
            title: 'CityFlow Parking Advisor',
            subtitle: 'Parking demand estimator for crowded city zones',
            module: 'SE4050',
            website: 'https://cityflow-demo.example.com',
            coverImage: 'https://placehold.co/1600x900/png?text=CityFlow+Cover',
            logo: 'https://placehold.co/300x300/png?text=CF',
            year: '2026',
            group: 'Y4S1-G05',
            status: 'RESEARCH',
            approval: 'REJECTED',
            rejectedReason: 'Insufficient validation metrics and unclear deployment scope.',
            featured: false,
            domain: 'IOT',
            projectType: 'HARDWARE',
            sdg: 'SUSTAINABLE_CITIES',
            tech: 'ARDUINO',
            problem: 'Drivers waste time searching for parking due to limited occupancy visibility.',
            solution: 'CityFlow estimates occupancy with sensor nodes and exposes a route-aware heatmap.',
            features: '- Occupancy sensors\n- Heatmap dashboard\n- Peak-hour forecasting',
            teamEmail: 'cityflow.team@sdgp.lk',
            teamPhone: '+94770000005',
        },
    ]

    for (const p of projects) {
        await prisma.projectMetadata.upsert({
            where: { project_id: p.metadataId },
            update: {
                sdgp_year: p.year,
                group_num: p.group,
                title: p.title,
                subtitle: p.subtitle,
                website: p.website,
                cover_image: p.coverImage,
                logo: p.logo,
                module: p.module,
                featured: p.featured,
                featured_by_userId: p.featured ? adminUserId : null,
            },
            create: {
                project_id: p.metadataId,
                sdgp_year: p.year,
                group_num: p.group,
                title: p.title,
                subtitle: p.subtitle,
                website: p.website,
                cover_image: p.coverImage,
                logo: p.logo,
                module: p.module,
                featured: p.featured,
                featured_by_userId: p.featured ? adminUserId : null,
            },
        })

        await prisma.projectContent.upsert({
            where: { metadata_id: p.metadataId },
            update: {},
            create: { content_id: p.contentId, metadata_id: p.metadataId },
        })

        const reviewed = p.approval !== 'PENDING'
        await prisma.projectStatus.upsert({
            where: { content_id: p.contentId },
            update: {
                status: p.status,
                approved_status: p.approval,
                approved_by_userId: reviewed ? adminUserId : null,
                approved_at: reviewed ? new Date() : null,
                rejected_reason: p.approval === 'REJECTED' ? p.rejectedReason ?? null : null,
            },
            create: {
                content_id: p.contentId,
                status: p.status,
                approved_status: p.approval,
                approved_by_userId: reviewed ? adminUserId : null,
                approved_at: reviewed ? new Date() : null,
                rejected_reason: p.approval === 'REJECTED' ? p.rejectedReason ?? null : null,
            },
        })

        await prisma.projectDetails.upsert({
            where: { content_id: p.contentId },
            update: {
                problem_statement: p.problem,
                solution: p.solution,
                features: p.features,
                team_email: p.teamEmail,
                team_phone: p.teamPhone,
            },
            create: {
                content_id: p.contentId,
                problem_statement: p.problem,
                solution: p.solution,
                features: p.features,
                team_email: p.teamEmail,
                team_phone: p.teamPhone,
            },
        })

        await prisma.projectAssociation.deleteMany({ where: { content_id: p.contentId } })
        await prisma.projectTeam.deleteMany({ where: { content_id: p.contentId } })
        await prisma.projectSlide.deleteMany({ where: { content_id: p.contentId } })
        await prisma.projectSocialLink.deleteMany({ where: { content_id: p.contentId } })

        await prisma.projectAssociation.createMany({
            data: [
                { content_id: p.contentId, type: 'PROJECT_TYPE', value: p.projectType, projectType: p.projectType },
                { content_id: p.contentId, type: 'PROJECT_DOMAIN', value: p.domain, domain: p.domain },
                { content_id: p.contentId, type: 'PROJECT_SDG', value: p.sdg, sdgGoal: p.sdg },
                { content_id: p.contentId, type: 'PROJECT_TECH', value: p.tech, techStack: p.tech },
            ],
        })

        await prisma.projectTeam.createMany({
            data: [
                { content_id: p.contentId, name: `${p.title} Member 1`, linkedin_url: 'https://linkedin.com', profile_image: 'https://placehold.co/120x120/png?text=M1' },
                { content_id: p.contentId, name: `${p.title} Member 2`, linkedin_url: 'https://linkedin.com', profile_image: 'https://placehold.co/120x120/png?text=M2' },
            ],
        })

        await prisma.projectSlide.createMany({
            data: [
                { content_id: p.contentId, slides_content: `https://placehold.co/1280x720/png?text=${encodeURIComponent(p.title)}+Slide+1` },
                { content_id: p.contentId, slides_content: `https://placehold.co/1280x720/png?text=${encodeURIComponent(p.title)}+Slide+2` },
            ],
        })

        await prisma.projectSocialLink.createMany({
            data: [
                { content_id: p.contentId, link_name: 'LINKEDIN', url: 'https://www.linkedin.com/company/sdgp' },
                { content_id: p.contentId, link_name: 'YOUTUBE', url: 'https://www.youtube.com' },
            ],
        })
    }

    console.log('Projects seeded successfully with non-empty details.')
}

async function seedCompetitionsAndAwards(adminUserId: string) {
    const competitions: CompetitionSeed[] = [
        {
            id: 'seed-competition-approved',
            name: 'Innovation Sprint 2026',
            isFeatured: true,
            startDate: '2026-05-10T00:00:00.000Z',
            endDate: '2026-06-15T00:00:00.000Z',
            description: 'A six-week innovation sprint focused on practical software solutions with measurable impact.',
            type: 'Hackathon',
            logo: 'https://placehold.co/300x300/png?text=IS',
            coverImage: 'https://placehold.co/1600x600/png?text=Innovation+Sprint+2026',
            schools: 'Computing, Engineering',
            module: 'SE4500',
            teamsParticipated: 48,
            projectsCompleted: 42,
            approvalStatus: 'APPROVED',
        },
        {
            id: 'seed-competition-pending',
            name: 'GreenTech Challenge 2026',
            isFeatured: false,
            startDate: '2026-07-01T00:00:00.000Z',
            endDate: '2026-08-01T00:00:00.000Z',
            description: 'Competition for sustainability-first digital products aligned with SDG outcomes.',
            type: 'Challenge',
            logo: 'https://placehold.co/300x300/png?text=GT',
            coverImage: 'https://placehold.co/1600x600/png?text=GreenTech+Challenge+2026',
            schools: 'Computing, Business',
            module: 'SE4510',
            teamsParticipated: 30,
            projectsCompleted: 0,
            approvalStatus: 'PENDING',
        },
    ]

    for (const c of competitions) {
        await prisma.competition.upsert({
            where: { id: c.id },
            update: {
                name: c.name, is_featured: c.isFeatured, start_date: new Date(c.startDate), end_date: new Date(c.endDate),
                description: c.description, type: c.type, logo: c.logo, cover_image: c.coverImage,
                schools: c.schools, module: c.module, teamsParticipated: c.teamsParticipated, projectsCompleted: c.projectsCompleted,
                approval_status: c.approvalStatus, accepted_by_id: c.approvalStatus === 'APPROVED' ? adminUserId : null,
            },
            create: {
                id: c.id, name: c.name, is_featured: c.isFeatured, start_date: new Date(c.startDate), end_date: new Date(c.endDate),
                description: c.description, type: c.type, logo: c.logo, cover_image: c.coverImage,
                schools: c.schools, module: c.module, teamsParticipated: c.teamsParticipated, projectsCompleted: c.projectsCompleted,
                approval_status: c.approvalStatus, accepted_by_id: c.approvalStatus === 'APPROVED' ? adminUserId : null,
            },
        })
    }

    const awards: AwardSeed[] = [
        {
            id: 'seed-award-approved',
            name: 'Best Educational Innovation',
            image: 'https://placehold.co/300x300/png?text=Award+1',
            competitionId: 'seed-competition-approved',
            projectId: 'seed-project-approved-1',
            contentId: 'seed-content-approved-1',
            approvalStatus: 'APPROVED',
        },
        {
            id: 'seed-award-pending',
            name: 'Emerging Impact Product',
            image: 'https://placehold.co/300x300/png?text=Award+2',
            competitionId: 'seed-competition-pending',
            projectId: 'seed-project-pending-1',
            contentId: 'seed-content-pending-1',
            approvalStatus: 'PENDING',
        },
    ]

    for (const a of awards) {
        await prisma.award.upsert({
            where: { id: a.id },
            update: {
                name: a.name, image: a.image, competition_id: a.competitionId, project_id: a.projectId, approval_status: a.approvalStatus,
                accepted_by_id: a.approvalStatus === 'APPROVED' ? adminUserId : null,
            },
            create: {
                id: a.id, name: a.name, image: a.image, competition_id: a.competitionId, project_id: a.projectId, approval_status: a.approvalStatus,
                accepted_by_id: a.approvalStatus === 'APPROVED' ? adminUserId : null,
            },
        })
    }

    console.log('Competitions and awards seeded successfully.')
}

async function seedBlogs(adminUserId: string) {
    const author: BlogAuthorSeed = {
        id: 'seed-blog-author-1',
        name: 'Sachini Weerasekara',
        email: 'sachini.weerasekara@sdgp.lk',
        avatarUrl: 'https://placehold.co/200x200/png?text=SW',
        instagram: 'https://instagram.com/sachini.sdgp',
        twitter: 'https://x.com/sachini_sdgp',
        facebook: 'https://facebook.com/sachini.sdgp',
        linkedin: 'https://linkedin.com/in/sachini-weerasekara',
        medium: 'https://medium.com/@sachini.sdgp',
        website: 'https://sachini-sdgp.example.com',
    }

    await prisma.blogAuthor.upsert({ where: { id: author.id }, update: author, create: author })

    const blogs: BlogSeed[] = [
        {
            id: 'seed-blog-approved-1',
            title: 'How Student Teams Built an AI Tutor in 8 Weeks',
            excerpt: 'A practical breakdown of roadmap planning, delivery pacing, and demo readiness.',
            content: 'Building an AI tutor required weekly validation milestones and continuous feedback loops.',
            imageUrl: 'https://placehold.co/1200x700/png?text=AI+Tutor+Journey',
            publishedAt: '2026-04-01T08:00:00.000Z',
            authorId: author.id,
            category: 'AI',
            featured: true,
            approved: true,
            rejected: false,
            module: 'SE4700',
        },
        {
            id: 'seed-blog-pending-1',
            title: 'Fintech UX Patterns for Student Budget Apps',
            excerpt: 'Patterns we tested to improve spend awareness and retention.',
            content: 'We tested budgeting cards, reminder nudges, and adaptive weekly summaries.',
            imageUrl: 'https://placehold.co/1200x700/png?text=Fintech+UX+Patterns',
            publishedAt: '2026-04-10T08:00:00.000Z',
            authorId: author.id,
            category: 'FINTECH',
            featured: false,
            approved: false,
            rejected: false,
            module: 'SE4702',
        },
    ]

    for (const b of blogs) {
        await prisma.blogPost.upsert({
            where: { id: b.id },
            update: {
                title: b.title, excerpt: b.excerpt, content: b.content, imageUrl: b.imageUrl,
                publishedAt: new Date(b.publishedAt), authorId: b.authorId, category: b.category, featured: b.featured,
                approved: b.approved, approvedById: b.approved ? adminUserId : null,
                rejectedById: b.rejected ? adminUserId : null, rejectedReason: b.rejected ? b.rejectedReason ?? null : null,
                module: b.module,
            },
            create: {
                id: b.id, title: b.title, excerpt: b.excerpt, content: b.content, imageUrl: b.imageUrl,
                publishedAt: new Date(b.publishedAt), authorId: b.authorId, category: b.category, featured: b.featured,
                approved: b.approved, approvedById: b.approved ? adminUserId : null,
                rejectedById: b.rejected ? adminUserId : null, rejectedReason: b.rejected ? b.rejectedReason ?? null : null,
                module: b.module,
            },
        })
    }

    console.log('Blogs seeded successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('Seeding completed successfully.')
    })
    .catch(async (e) => {
        console.error('Error during seeding:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
/*
// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

type ProjectApprovalSeed = {
    metadataId: string
    contentId: string
    title: string
    subtitle: string
    module: string
    website: string
    coverImage: string
    logo: string
    year: string
    groupNumber: string
    projectStatus: 'IDEA' | 'MVP' | 'RESEARCH' | 'DEPLOYED' | 'STARTUP'
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
    rejectedReason?: string
    featured: boolean
    domain: 'EDTECH' | 'AGRITECH' | 'FINTECH' | 'HEALTHTECH' | 'IOT' | 'SECURITY'
    projectType: 'WEB' | 'MOBILE' | 'HARDWARE'
    sdg: 'QUALITY_EDUCATION' | 'ZERO_HUNGER' | 'DECENT_WORK' | 'GOOD_HEALTH' | 'SUSTAINABLE_CITIES' | 'PEACE_JUSTICE'
    techStack: 'TYPESCRIPT' | 'PYTHON' | 'FLUTTER' | 'REACT' | 'ARDUINO' | 'NODE'
    problemStatement: string
    solution: string
    features: string
    teamEmail: string
    teamPhone: string
    slides: string[]
    teamMembers: Array<{ name: string; linkedin: string; profileImage: string }>
    socials: Array<{ type: 'LINKEDIN' | 'TWITTER' | 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE'; url: string }>
}

type CompetitionSeed = {
    id: string
    name: string
    isFeatured: boolean
    startDate: string
    endDate: string
    description: string
    type: string
    logo: string
    coverImage: string
    schools: string
    module: string
    teamsParticipated: number
    projectsCompleted: number
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
    rejectedReason?: string
}

type AwardSeed = {
    id: string
    name: string
    image: string
    competitionId: string
    projectId: string
    contentId: string
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
    rejectedReason?: string
}

type BlogAuthorSeed = {
    id: string
    name: string
    email: string
    avatarUrl: string
    instagram: string
    twitter: string
    facebook: string
    linkedin: string
    medium: string
    website: string
}

type BlogSeed = {
    id: string
    title: string
    excerpt: string
    content: string
    imageUrl: string
    publishedAt: string
    authorId: string
    category: 'AI' | 'EDTECH' | 'FINTECH' | 'SUSTAINABILITY' | 'BLOCKCHAIN'
    featured: boolean
    approved: boolean
    rejected: boolean
    rejectedReason?: string
    module: string
}

async function main() {
    await seedData()
    await runDataMigrations()
}

async function seedData() {
    const adminUserId = await seedUsers()
    await seedProjects(adminUserId)
    await seedCompetitionsAndAwards(adminUserId)
    await seedBlogs(adminUserId)
}

async function runDataMigrations() {
    console.log('No migrations to run currently.')
}

async function seedUsers() {
    const hashedPassword = await bcrypt.hash('12345678', 10)

    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    const moderator = await prisma.user.findFirst({ where: { role: 'MODERATOR' } })
    const developer = await prisma.user.findFirst({ where: { role: 'DEVELOPER' } })

    if (!admin) await prisma.user.create({ data: { role: 'ADMIN', password: hashedPassword, name: 'Admin' } })
    if (!moderator) await prisma.user.create({ data: { role: 'MODERATOR', password: hashedPassword, name: 'Moderator' } })
    if (!developer) await prisma.user.create({ data: { role: 'DEVELOPER', password: hashedPassword, name: 'Developer' } })

    const currentAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { user_id: true } })
    if (!currentAdmin) throw new Error('Unable to resolve admin user for seed links.')

    console.log('Core users seeded successfully (admin, moderator, developer).')
    return currentAdmin.user_id
}

async function seedProjectDetailsData(seed: ProjectApprovalSeed) {
    await prisma.projectDetails.upsert({
        where: { content_id: seed.contentId },
        update: {
            problem_statement: seed.problemStatement,
            solution: seed.solution,
            features: seed.features,
            team_email: seed.teamEmail,
            team_phone: seed.teamPhone,
        },
        create: {
            content_id: seed.contentId,
            problem_statement: seed.problemStatement,
            solution: seed.solution,
            features: seed.features,
            team_email: seed.teamEmail,
            team_phone: seed.teamPhone,
        },
    })

    await prisma.projectAssociation.deleteMany({ where: { content_id: seed.contentId } })
    await prisma.projectTeam.deleteMany({ where: { content_id: seed.contentId } })
    await prisma.projectSlide.deleteMany({ where: { content_id: seed.contentId } })
    await prisma.projectSocialLink.deleteMany({ where: { content_id: seed.contentId } })

    await prisma.projectAssociation.createMany({
        data: [
            { content_id: seed.contentId, type: 'PROJECT_TYPE', value: seed.projectType, projectType: seed.projectType },
            { content_id: seed.contentId, type: 'PROJECT_DOMAIN', value: seed.domain, domain: seed.domain },
            { content_id: seed.contentId, type: 'PROJECT_SDG', value: seed.sdg, sdgGoal: seed.sdg },
            { content_id: seed.contentId, type: 'PROJECT_TECH', value: seed.techStack, techStack: seed.techStack },
        ],
    })

    await prisma.projectTeam.createMany({
        data: seed.teamMembers.map((member) => ({
            content_id: seed.contentId,
            name: member.name,
            linkedin_url: member.linkedin,
            profile_image: member.profileImage,
        })),
    })

    await prisma.projectSlide.createMany({
        data: seed.slides.map((slide) => ({ content_id: seed.contentId, slides_content: slide })),
    })

    await prisma.projectSocialLink.createMany({
        data: seed.socials.map((social) => ({
            content_id: seed.contentId,
            link_name: social.type,
            url: social.url,
        })),
    })
}

async function seedProjects(adminUserId: string) {
    const seeds: ProjectApprovalSeed[] = [
        {
            metadataId: 'seed-project-approved-1',
            contentId: 'seed-content-approved-1',
            title: 'EduPulse Classroom Analytics',
            subtitle: 'Real-time classroom engagement analytics for lecturers',
            module: 'SE4010',
            website: 'https://edupulse-demo.example.com',
            coverImage: 'https://placehold.co/1600x900/png?text=EduPulse+Cover',
            logo: 'https://placehold.co/400x400/png?text=EP',
            year: '2026',
            groupNumber: 'Y4S1-G01',
            projectStatus: 'MVP',
            approvalStatus: 'APPROVED',
            featured: true,
            domain: 'EDTECH',
            projectType: 'WEB',
            sdg: 'QUALITY_EDUCATION',
            techStack: 'TYPESCRIPT',
            problemStatement: 'Lecturers cannot measure class engagement quickly enough to intervene on time.',
            solution: 'EduPulse aggregates LMS behavior and quiz outcomes into actionable dashboards for instructors.',
            features: '- Live engagement heatmaps\n- Cohort risk alerts\n- Weekly trend summaries\n- Downloadable reports',
            teamEmail: 'edupulse.team@sdgp.lk',
            teamPhone: '+94770000001',
            slides: [
                'https://placehold.co/1280x720/png?text=EduPulse+Dashboard',
                'https://placehold.co/1280x720/png?text=EduPulse+Analytics+Charts',
            ],
            teamMembers: [
                { name: 'Nimal Perera', linkedin: 'https://www.linkedin.com/in/nimal-perera', profileImage: 'https://placehold.co/120x120/png?text=NP' },
                { name: 'Shehani Fernando', linkedin: 'https://www.linkedin.com/in/shehani-fernando', profileImage: 'https://placehold.co/120x120/png?text=SF' },
            ],
            socials: [
                { type: 'LINKEDIN', url: 'https://www.linkedin.com/company/edupulse-lk' },
                { type: 'YOUTUBE', url: 'https://www.youtube.com/watch?v=edupulse-demo' },
            ],
        },
        {
            metadataId: 'seed-project-pending-1',
            contentId: 'seed-content-pending-1',
            title: 'FinTrack Student Budgeting',
            subtitle: 'Smart budgeting and bill reminders for university students',
            module: 'SE4030',
            website: 'https://fintrack-demo.example.com',
            coverImage: 'https://placehold.co/1600x900/png?text=FinTrack+Cover',
            logo: 'https://placehold.co/400x400/png?text=FT',
            year: '2026',
            groupNumber: 'Y4S1-G03',
            projectStatus: 'IDEA',
            approvalStatus: 'PENDING',
            featured: false,
            domain: 'FINTECH',
            projectType: 'MOBILE',
            sdg: 'DECENT_WORK',
            techStack: 'FLUTTER',
            problemStatement: 'Students miss payment cycles and overspend due to weak visibility into recurring costs.',
            solution: 'FinTrack offers adaptive budget plans with reminders and short weekly spend insights.',
            features: '- Auto-tagging expenses\n- Weekly cashflow digest\n- Shared budgets\n- Savings milestone tracker',
            teamEmail: 'fintrack.team@sdgp.lk',
            teamPhone: '+94770000003',
            slides: [
                'https://placehold.co/1280x720/png?text=FinTrack+Wallet+View',
                'https://placehold.co/1280x720/png?text=FinTrack+Savings+Goals',
            ],
            teamMembers: [
                { name: 'Yohan Madushanka', linkedin: 'https://www.linkedin.com/in/yohan-madushanka', profileImage: 'https://placehold.co/120x120/png?text=YM' },
                { name: 'Ayesha Niroshini', linkedin: 'https://www.linkedin.com/in/ayesha-niroshini', profileImage: 'https://placehold.co/120x120/png?text=AN' },
            ],
            socials: [
                { type: 'TWITTER', url: 'https://x.com/fintrack_lk' },
                { type: 'LINKEDIN', url: 'https://www.linkedin.com/company/fintrack-lk' },
            ],
        },
        {
            metadataId: 'seed-project-rejected-1',
            contentId: 'seed-content-rejected-1',
            title: 'CityFlow Parking Advisor',
            subtitle: 'Parking demand estimator for crowded city zones',
            module: 'SE4050',
            website: 'https://cityflow-demo.example.com',
            coverImage: 'https://placehold.co/1600x900/png?text=CityFlow+Cover',
            logo: 'https://placehold.co/400x400/png?text=CF',
            year: '2026',
            groupNumber: 'Y4S1-G05',
            projectStatus: 'RESEARCH',
            approvalStatus: 'REJECTED',
            rejectedReason: 'Insufficient validation metrics and unclear deployment scope.',
            featured: false,
            domain: 'IOT',
            projectType: 'HARDWARE',
            sdg: 'SUSTAINABLE_CITIES',
            techStack: 'ARDUINO',
            problemStatement: 'Urban drivers spend excessive time searching for parking in peak hours.',
            solution: 'CityFlow estimates occupancy with sensor nodes and exposes a navigation heatmap service.',
            features: '- IoT occupancy sensors\n- Heatmap dashboard\n- Peak-hour forecasting\n- Driver routing suggestions',
            teamEmail: 'cityflow.team@sdgp.lk',
            teamPhone: '+94770000005',
            slides: [
                'https://placehold.co/1280x720/png?text=CityFlow+Node+Design',
                'https://placehold.co/1280x720/png?text=CityFlow+Heatmap',
            ],
            teamMembers: [
                { name: 'Amila Senanayake', linkedin: 'https://www.linkedin.com/in/amila-senanayake', profileImage: 'https://placehold.co/120x120/png?text=AS' },
                { name: 'Nethmi Weerasinghe', linkedin: 'https://www.linkedin.com/in/nethmi-weerasinghe', profileImage: 'https://placehold.co/120x120/png?text=NW' },
            ],
            socials: [
                { type: 'LINKEDIN', url: 'https://www.linkedin.com/company/cityflow-lk' },
                { type: 'FACEBOOK', url: 'https://www.facebook.com/cityflow.lk' },
            ],
        },
    ]

    for (const seed of seeds) {
        await prisma.projectMetadata.upsert({
            where: { project_id: seed.metadataId },
            update: {
                sdgp_year: seed.year,
                group_num: seed.groupNumber,
                title: seed.title,
                subtitle: seed.subtitle,
                website: seed.website,
                cover_image: seed.coverImage,
                logo: seed.logo,
                module: seed.module,
                featured: seed.featured,
                featured_by_userId: seed.featured ? adminUserId : null,
            },
            create: {
                project_id: seed.metadataId,
                sdgp_year: seed.year,
                group_num: seed.groupNumber,
                title: seed.title,
                subtitle: seed.subtitle,
                website: seed.website,
                cover_image: seed.coverImage,
                logo: seed.logo,
                module: seed.module,
                featured: seed.featured,
                featured_by_userId: seed.featured ? adminUserId : null,
            },
        })

        await prisma.projectContent.upsert({
            where: { metadata_id: seed.metadataId },
            update: {},
            create: { content_id: seed.contentId, metadata_id: seed.metadataId },
        })

        const approvedBy = seed.approvalStatus === 'APPROVED' || seed.approvalStatus === 'REJECTED' ? adminUserId : null

        await prisma.projectStatus.upsert({
            where: { content_id: seed.contentId },
            update: {
                status: seed.projectStatus,
                approved_status: seed.approvalStatus,
                approved_by_userId: approvedBy,
                approved_at: approvedBy ? new Date() : null,
                rejected_reason: seed.approvalStatus === 'REJECTED' ? seed.rejectedReason ?? null : null,
            },
            create: {
                content_id: seed.contentId,
                status: seed.projectStatus,
                approved_status: seed.approvalStatus,
                approved_by_userId: approvedBy,
                approved_at: approvedBy ? new Date() : null,
                rejected_reason: seed.approvalStatus === 'REJECTED' ? seed.rejectedReason ?? null : null,
            },
        })

        await seedProjectDetailsData(seed)
    }

    console.log('Projects seeded successfully with non-empty details and media.')
}

async function seedCompetitionsAndAwards(adminUserId: string) {
    const competitions: CompetitionSeed[] = [
        {
            id: 'seed-competition-approved',
            name: 'Innovation Sprint 2026',
            isFeatured: true,
            startDate: '2026-05-10T00:00:00.000Z',
            endDate: '2026-06-15T00:00:00.000Z',
            description: 'A six-week innovation sprint focused on practical software solutions with measurable impact.',
            type: 'Hackathon',
            logo: 'https://placehold.co/300x300/png?text=IS',
            coverImage: 'https://placehold.co/1600x600/png?text=Innovation+Sprint+2026',
            schools: 'Computing, Engineering',
            module: 'SE4500',
            teamsParticipated: 48,
            projectsCompleted: 42,
            approvalStatus: 'APPROVED',
        },
        {
            id: 'seed-competition-pending',
            name: 'GreenTech Challenge 2026',
            isFeatured: false,
            startDate: '2026-07-01T00:00:00.000Z',
            endDate: '2026-08-01T00:00:00.000Z',
            description: 'Competition for sustainability-first digital products aligned with SDG outcomes.',
            type: 'Challenge',
            logo: 'https://placehold.co/300x300/png?text=GT',
            coverImage: 'https://placehold.co/1600x600/png?text=GreenTech+Challenge+2026',
            schools: 'Computing, Business',
            module: 'SE4510',
            teamsParticipated: 30,
            projectsCompleted: 0,
            approvalStatus: 'PENDING',
        },
        {
            id: 'seed-competition-rejected',
            name: 'Legacy Idea Marathon',
            isFeatured: false,
            startDate: '2026-03-01T00:00:00.000Z',
            endDate: '2026-03-20T00:00:00.000Z',
            description: 'Draft competition concept retained for rejected-state UI testing.',
            type: 'Ideathon',
            logo: 'https://placehold.co/300x300/png?text=LM',
            coverImage: 'https://placehold.co/1600x600/png?text=Legacy+Idea+Marathon',
            schools: 'Computing',
            module: 'SE4490',
            teamsParticipated: 12,
            projectsCompleted: 5,
            approvalStatus: 'REJECTED',
            rejectedReason: 'Schedule and judging rubric were incomplete for public launch.',
        },
    ]

    for (const competition of competitions) {
        await prisma.competition.upsert({
            where: { id: competition.id },
            update: {
                name: competition.name,
                is_featured: competition.isFeatured,
                start_date: new Date(competition.startDate),
                end_date: new Date(competition.endDate),
                description: competition.description,
                type: competition.type,
                logo: competition.logo,
                cover_image: competition.coverImage,
                schools: competition.schools,
                module: competition.module,
                teamsParticipated: competition.teamsParticipated,
                projectsCompleted: competition.projectsCompleted,
                approval_status: competition.approvalStatus,
                accepted_by_id: competition.approvalStatus === 'APPROVED' ? adminUserId : null,
                rejected_by_id: competition.approvalStatus === 'REJECTED' ? adminUserId : null,
                rejected_reason: competition.approvalStatus === 'REJECTED' ? competition.rejectedReason ?? null : null,
            },
            create: {
                id: competition.id,
                name: competition.name,
                is_featured: competition.isFeatured,
                start_date: new Date(competition.startDate),
                end_date: new Date(competition.endDate),
                description: competition.description,
                type: competition.type,
                logo: competition.logo,
                cover_image: competition.coverImage,
                schools: competition.schools,
                module: competition.module,
                teamsParticipated: competition.teamsParticipated,
                projectsCompleted: competition.projectsCompleted,
                approval_status: competition.approvalStatus,
                accepted_by_id: competition.approvalStatus === 'APPROVED' ? adminUserId : null,
                rejected_by_id: competition.approvalStatus === 'REJECTED' ? adminUserId : null,
                rejected_reason: competition.approvalStatus === 'REJECTED' ? competition.rejectedReason ?? null : null,
            },
        })
    }

    const awards: AwardSeed[] = [
        {
            id: 'seed-award-approved',
            name: 'Best Educational Innovation',
            image: 'https://placehold.co/300x300/png?text=Award+1',
            competitionId: 'seed-competition-approved',
            projectId: 'seed-project-approved-1',
            contentId: 'seed-content-approved-1',
            approvalStatus: 'APPROVED',
        },
        {
            id: 'seed-award-pending',
            name: 'Emerging Impact Product',
            image: 'https://placehold.co/300x300/png?text=Award+2',
            competitionId: 'seed-competition-pending',
            projectId: 'seed-project-pending-1',
            contentId: 'seed-content-pending-1',
            approvalStatus: 'PENDING',
        },
        {
            id: 'seed-award-rejected',
            name: 'Technical Excellence',
            image: 'https://placehold.co/300x300/png?text=Award+3',
            competitionId: 'seed-competition-rejected',
            projectId: 'seed-project-rejected-1',
            contentId: 'seed-content-rejected-1',
            approvalStatus: 'REJECTED',
            rejectedReason: 'Judging scores were below the acceptance threshold.',
        },
    ]

    for (const award of awards) {
        await prisma.award.upsert({
            where: { id: award.id },
            update: {
                name: award.name,
                image: award.image,
                competition_id: award.competitionId,
                project_id: award.projectId,
                approval_status: award.approvalStatus,
                accepted_by_id: award.approvalStatus === 'APPROVED' ? adminUserId : null,
                rejected_by_id: award.approvalStatus === 'REJECTED' ? adminUserId : null,
                rejected_reason: award.approvalStatus === 'REJECTED' ? award.rejectedReason ?? null : null,
            },
            create: {
                id: award.id,
                name: award.name,
                image: award.image,
                competition_id: award.competitionId,
                project_id: award.projectId,
                approval_status: award.approvalStatus,
                accepted_by_id: award.approvalStatus === 'APPROVED' ? adminUserId : null,
                rejected_by_id: award.approvalStatus === 'REJECTED' ? adminUserId : null,
                rejected_reason: award.approvalStatus === 'REJECTED' ? award.rejectedReason ?? null : null,
            },
        })
    }

    await prisma.projectAssociation.deleteMany({
        where: { type: 'AWARD', content_id: { in: awards.map((award) => award.contentId) } },
    })
    await prisma.projectAssociation.createMany({
        data: awards.map((award) => ({
            content_id: award.contentId,
            type: 'AWARD',
            value: award.name,
            award_id: award.id,
        })),
    })

    console.log('Competitions and awards seeded successfully.')
}

async function seedBlogs(adminUserId: string) {
    const authors: BlogAuthorSeed[] = [
        {
            id: 'seed-blog-author-1',
            name: 'Sachini Weerasekara',
            email: 'sachini.weerasekara@sdgp.lk',
            avatarUrl: 'https://placehold.co/200x200/png?text=SW',
            instagram: 'https://instagram.com/sachini.sdgp',
            twitter: 'https://x.com/sachini_sdgp',
            facebook: 'https://facebook.com/sachini.sdgp',
            linkedin: 'https://linkedin.com/in/sachini-weerasekara',
            medium: 'https://medium.com/@sachini.sdgp',
            website: 'https://sachini-sdgp.example.com',
        },
        {
            id: 'seed-blog-author-2',
            name: 'Tharindu Kulatunga',
            email: 'tharindu.kulatunga@sdgp.lk',
            avatarUrl: 'https://placehold.co/200x200/png?text=TK',
            instagram: 'https://instagram.com/tharindu.sdgp',
            twitter: 'https://x.com/tharindu_sdgp',
            facebook: 'https://facebook.com/tharindu.sdgp',
            linkedin: 'https://linkedin.com/in/tharindu-kulatunga',
            medium: 'https://medium.com/@tharindu.sdgp',
            website: 'https://tharindu-sdgp.example.com',
        },
    ]

    for (const author of authors) {
        await prisma.blogAuthor.upsert({
            where: { id: author.id },
            update: author,
            create: author,
        })
    }

    const blogs: BlogSeed[] = [
        {
            id: 'seed-blog-approved-1',
            title: 'How Student Teams Built an AI Tutor in 8 Weeks',
            excerpt: 'A practical breakdown of roadmap planning, delivery pacing, and demo readiness.',
            content: 'Building an AI tutor required weekly validation milestones and continuous feedback loops.',
            imageUrl: 'https://placehold.co/1200x700/png?text=AI+Tutor+Journey',
            publishedAt: '2026-04-01T08:00:00.000Z',
            authorId: 'seed-blog-author-1',
            category: 'AI',
            featured: true,
            approved: true,
            rejected: false,
            module: 'SE4700',
        },
        {
            id: 'seed-blog-pending-1',
            title: 'Fintech UX Patterns for Student Budget Apps',
            excerpt: 'Patterns we tested to improve spend awareness and retention.',
            content: 'We tested budgeting cards, reminder nudges, and adaptive weekly summaries.',
            imageUrl: 'https://placehold.co/1200x700/png?text=Fintech+UX+Patterns',
            publishedAt: '2026-04-10T08:00:00.000Z',
            authorId: 'seed-blog-author-1',
            category: 'FINTECH',
            featured: false,
            approved: false,
            rejected: false,
            module: 'SE4702',
        },
        {
            id: 'seed-blog-rejected-1',
            title: 'Early Draft: Blockchain in Every Student Product',
            excerpt: 'A rejected draft retained for moderation workflow testing.',
            content: 'This article is intentionally retained for rejected-state UI testing.',
            imageUrl: 'https://placehold.co/1200x700/png?text=Rejected+Draft+Blog',
            publishedAt: '2026-03-20T08:00:00.000Z',
            authorId: 'seed-blog-author-2',
            category: 'BLOCKCHAIN',
            featured: false,
            approved: false,
            rejected: true,
            rejectedReason: 'Claims were not evidence-backed and required substantial revision.',
            module: 'SE4704',
        },
    ]

    for (const blog of blogs) {
        await prisma.blogPost.upsert({
            where: { id: blog.id },
            update: {
                title: blog.title,
                excerpt: blog.excerpt,
                content: blog.content,
                imageUrl: blog.imageUrl,
                publishedAt: new Date(blog.publishedAt),
                authorId: blog.authorId,
                category: blog.category,
                featured: blog.featured,
                approved: blog.approved,
                approvedById: blog.approved ? adminUserId : null,
                rejectedById: blog.rejected ? adminUserId : null,
                rejectedReason: blog.rejected ? blog.rejectedReason ?? null : null,
                module: blog.module,
            },
            create: {
                id: blog.id,
                title: blog.title,
                excerpt: blog.excerpt,
                content: blog.content,
                imageUrl: blog.imageUrl,
                publishedAt: new Date(blog.publishedAt),
                authorId: blog.authorId,
                category: blog.category,
                featured: blog.featured,
                approved: blog.approved,
                approvedById: blog.approved ? adminUserId : null,
                rejectedById: blog.rejected ? adminUserId : null,
                rejectedReason: blog.rejected ? blog.rejectedReason ?? null : null,
                module: blog.module,
            },
        })
    }

    console.log('Blog authors and posts seeded successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('Seeding completed successfully.')
    })
    .catch(async (e) => {
        console.error('Error during seeding:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    await seedData()
    await runDataMigrations()
}

async function seedData() {
    const adminUserId = await seedUsers()
    await seedProjectApprovalStatuses(adminUserId)
    await seedCompetitionsAndAwards(adminUserId)
    await seedBlogs(adminUserId)
}

async function runDataMigrations() {
    console.log('No migrations to run currently.')
}

async function seedUsers() {
    const hashedPassword = await bcrypt.hash('12345678', 10)

    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    const moderator = await prisma.user.findFirst({ where: { role: 'MODERATOR' } })
    const developer = await prisma.user.findFirst({ where: { role: 'DEVELOPER' } })

    if (!admin) {
        await prisma.user.create({
            data: {
                role: 'ADMIN',
                password: hashedPassword,
                name: 'Admin',
            },
        })
    }

    if (!moderator) {
        await prisma.user.create({
            data: {
                role: 'MODERATOR',
                password: hashedPassword,
                name: 'Moderator',
            },
        })
    }

    if (!developer) {
        await prisma.user.create({
            data: {
                role: 'DEVELOPER',
                password: hashedPassword,
                name: 'Developer',
            },
        })
    }

    const currentAdmin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { user_id: true },
    })

    if (!currentAdmin) {
        throw new Error('Unable to resolve admin user for seed links.')
    }

    console.log('Core users seeded successfully (admin, moderator, developer).')
    return currentAdmin.user_id
}

type ProjectStatusType = 'IDEA' | 'MVP' | 'RESEARCH' | 'DEPLOYED' | 'STARTUP'
type ProjectApprovalType = 'PENDING' | 'APPROVED' | 'REJECTED'
type ProjectDomainType =
    | 'AI'
    | 'ML'
    | 'AR_VR'
    | 'BLOCKCHAIN'
    | 'IOT'
    | 'HEALTHTECH'
    | 'FINTECH'
    | 'EDTECH'
    | 'AGRITECH'
    | 'ECOMMERCE'
    | 'SOCIAL'
    | 'GAMING'
    | 'SECURITY'
    | 'DATA_ANALYTICS'
    | 'ENTERTAINMENT'
    | 'SUSTAINABILITY'
type ProjectType = 'MOBILE' | 'WEB' | 'HARDWARE' | 'DESKTOP' | 'WEARABLE' | 'EXTENSION'
type SDGType =
    | 'NO_POVERTY'
    | 'ZERO_HUNGER'
    | 'GOOD_HEALTH'
    | 'QUALITY_EDUCATION'
    | 'GENDER_EQUALITY'
    | 'CLEAN_WATER'
    | 'AFFORDABLE_ENERGY'
    | 'DECENT_WORK'
    | 'INDUSTRY_INNOVATION'
    | 'REDUCED_INEQUALITIES'
    | 'SUSTAINABLE_CITIES'
    | 'RESPONSIBLE_CONSUMPTION'
    | 'CLIMATE_ACTION'
    | 'LIFE_BELOW_WATER'
    | 'LIFE_ON_LAND'
    | 'PEACE_JUSTICE'
    | 'PARTNERSHIPS'
type TechType =
    | 'REACT'
    | 'ANGULAR'
    | 'VUE'
    | 'NODE'
    | 'PYTHON'
    | 'DJANGO'
    | 'FLASK'
    | 'JAVA'
    | 'SPRING'
    | 'DOTNET'
    | 'PHP'
    | 'LARAVEL'
    | 'ANDROID'
    | 'IOS'
    | 'FLUTTER'
    | 'REACT_NATIVE'
    | 'FIREBASE'
    | 'AWS'
    | 'MONGODB'
    | 'MYSQL'
    | 'POSTGRESQL'
    | 'TENSORFLOW'
    | 'PYTORCH'
    | 'ARDUINO'
    | 'RASPBERRY_PI'
    | 'SVELTE'
    | 'KOTLIN'
    | 'SWIFT'
    | 'RUBY'
    | 'JAVASCRIPT'
    | 'TYPESCRIPT'
    | 'C_SHARP'
    | 'C_PLUS_PLUS'
    | 'C'
type SocialType = 'LINKEDIN' | 'TWITTER' | 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK'
type ApprovalType = 'PENDING' | 'APPROVED' | 'REJECTED'

type ProjectApprovalSeed = {
    metadataId: string
    contentId: string
    title: string
    subtitle: string
    module: string
    website: string
    coverImage: string
    logo: string
    year: string
    groupNumber: string
    projectStatus: ProjectStatusType
    approvalStatus: ProjectApprovalType
    rejectedReason?: string
    featured: boolean
    domain: ProjectDomainType
    projectType: ProjectType
    sdg: SDGType
    techStack: TechType
    problemStatement: string
    solution: string
    features: string
    teamEmail: string
    teamPhone: string
    slides: string[]
    teamMembers: Array<{
        name: string
        linkedin: string
        profileImage: string
    }>
    socials: Array<{
        type: SocialType
        url: string
    }>
}

async function seedProjectDetailsData(seed: ProjectApprovalSeed) {
    await prisma.projectDetails.upsert({
        where: { content_id: seed.contentId },
        data: {
            problem_statement: seed.problemStatement,
            solution: seed.solution,
            features: seed.features,
            team_email: seed.teamEmail,
            team_phone: seed.teamPhone,
        },
        update: {
            problem_statement: seed.problemStatement,
            solution: seed.solution,
            features: seed.features,
            team_email: seed.teamEmail,
            team_phone: seed.teamPhone,
        },
        create: {
            content_id: seed.contentId,
            problem_statement: seed.problemStatement,
            solution: seed.solution,
            features: seed.features,
            team_email: seed.teamEmail,
            team_phone: seed.teamPhone,
        },
    })

    // Keep child collections idempotent by clearing old seeded rows before inserting.
    await prisma.projectAssociation.deleteMany({ where: { content_id: seed.contentId } })
    await prisma.projectTeam.deleteMany({ where: { content_id: seed.contentId } })
    await prisma.projectSlide.deleteMany({ where: { content_id: seed.contentId } })
    await prisma.projectSocialLink.deleteMany({ where: { content_id: seed.contentId } })

    await prisma.projectAssociation.createMany({
        data: [
            {
                content_id: seed.contentId,
                type: 'PROJECT_TYPE',
                value: seed.projectType,
                projectType: seed.projectType,
            },
            {
                content_id: seed.contentId,
                type: 'PROJECT_DOMAIN',
                value: seed.domain,
                domain: seed.domain,
            },
            {
                content_id: seed.contentId,
                type: 'PROJECT_SDG',
                value: seed.sdg,
                sdgGoal: seed.sdg,
            },
            {
                content_id: seed.contentId,
                type: 'PROJECT_TECH',
                value: seed.techStack,
                techStack: seed.techStack,
            },
        ],
    })

    await prisma.projectTeam.createMany({
        data: seed.teamMembers.map((member) => ({
                content_id: seed.contentId,
                name: member.name,
                linkedin_url: member.linkedin,
                profile_image: member.profileImage,
            })),
    })

    await prisma.projectSlide.createMany({
        data: seed.slides.map((slide) => ({
                content_id: seed.contentId,
                slides_content: slide,
            })),
    })

    await prisma.projectSocialLink.createMany({
        data: seed.socials.map((social) => ({
                content_id: seed.contentId,
                link_name: social.type,
                url: social.url,
            })),
    })
}

async function seedProjectApprovalStatuses(adminUserId: string) {
    const approvalSeeds: ProjectApprovalSeed[] = [
        {
            metadataId: 'seed-project-approved-1',
            contentId: 'seed-content-approved-1',
            title: 'EduPulse Classroom Analytics',
            subtitle: 'Real-time classroom engagement analytics for lecturers',
            module: 'SE4010',
            website: 'https://edupulse-demo.example.com',
            coverImage: 'https://placehold.co/1600x900/png?text=EduPulse+Cover',
            logo: 'https://placehold.co/400x400/png?text=EP',
            year: '2026',
            groupNumber: 'Y4S1-G01',
            projectStatus: 'MVP',
            approvalStatus: 'APPROVED',
            featured: true,
            domain: 'EDTECH',
            projectType: 'WEB',
            sdg: 'QUALITY_EDUCATION',
            techStack: 'TYPESCRIPT',
            problemStatement:
                'Educators currently rely on manual feedback loops to estimate class understanding, which delays intervention and impacts learning outcomes.',
            solution:
                'EduPulse combines LMS signals, quiz outcomes, and activity tracking into a single dashboard that highlights struggling topics and student groups.',
            features:
                '- Live engagement heatmaps\n- Risk alerts for low-performing cohorts\n- Weekly trend summaries for instructors\n- Downloadable reports for module coordinators',
            teamEmail: 'edupulse.team@sdgp.lk',
            teamPhone: '+94770000001',
            slides: [
                'https://placehold.co/1280x720/png?text=EduPulse+Dashboard',
                'https://placehold.co/1280x720/png?text=EduPulse+Analytics+Charts',
                'https://placehold.co/1280x720/png?text=EduPulse+Alert+Flow',
            ],
            teamMembers: [
                {
                    name: 'Nimal Perera',
                    linkedin: 'https://www.linkedin.com/in/nimal-perera',
                    profileImage: 'https://placehold.co/120x120/png?text=NP',
                },
                {
                    name: 'Shehani Fernando',
                    linkedin: 'https://www.linkedin.com/in/shehani-fernando',
                    profileImage: 'https://placehold.co/120x120/png?text=SF',
                },
                {
                    name: 'Dilan Rajapaksha',
                    linkedin: 'https://www.linkedin.com/in/dilan-rajapaksha',
                    profileImage: 'https://placehold.co/120x120/png?text=DR',
                },
            ],
            socials: [
                { type: 'LINKEDIN', url: 'https://www.linkedin.com/company/edupulse-lk' },
                { type: 'YOUTUBE', url: 'https://www.youtube.com/watch?v=edupulse-demo' },
                { type: 'FACEBOOK', url: 'https://www.facebook.com/edupulse.lk' },
            ],
        },
        {
            metadataId: 'seed-project-approved-2',
            contentId: 'seed-content-approved-2',
            title: 'AgriSense Yield Predictor',
            subtitle: 'Data-assisted yield prediction for smallholder farmers',
            module: 'SE4020',
            website: 'https://agrisense-demo.example.com',
            coverImage: 'https://placehold.co/1600x900/png?text=AgriSense+Cover',
            logo: 'https://placehold.co/400x400/png?text=AS',
            year: '2026',
            groupNumber: 'Y4S1-G02',
            projectStatus: 'DEPLOYED',
            approvalStatus: 'APPROVED',
            featured: false,
            domain: 'AGRITECH',
            projectType: 'MOBILE',
            sdg: 'ZERO_HUNGER',
            techStack: 'PYTHON',
            problemStatement:
                'Farmers often make crop planning decisions with limited historical insight and weak weather-linked risk visibility.',
            solution:
                'AgriSense uses seasonal weather trends and field records to predict crop yield scenarios and suggest crop cycles.',
            features:
                '- Crop calendar recommendations\n- Weather anomaly warnings\n- Soil condition capture and visualization\n- Multi-language farmer interface',
            teamEmail: 'agrisense.team@sdgp.lk',
            teamPhone: '+94770000002',
            slides: [
                'https://placehold.co/1280x720/png?text=AgriSense+Mobile+App',
                'https://placehold.co/1280x720/png?text=AgriSense+Prediction+Engine',
            ],
            teamMembers: [
                {
                    name: 'Kavindu Silva',
                    linkedin: 'https://www.linkedin.com/in/kavindu-silva',
                    profileImage: 'https://placehold.co/120x120/png?text=KS',
                },
                {
                    name: 'Piumi Jayasuriya',
                    linkedin: 'https://www.linkedin.com/in/piumi-jayasuriya',
                    profileImage: 'https://placehold.co/120x120/png?text=PJ',
                },
            ],
            socials: [
                { type: 'LINKEDIN', url: 'https://www.linkedin.com/company/agrisense-lk' },
                { type: 'INSTAGRAM', url: 'https://www.instagram.com/agrisense.lk' },
            ],
        },
        {
            metadataId: 'seed-project-pending-1',
            contentId: 'seed-content-pending-1',
            title: 'FinTrack Student Budgeting',
            subtitle: 'Smart budgeting and bill reminders for university students',
            module: 'SE4030',
            website: 'https://fintrack-demo.example.com',
            coverImage: 'https://placehold.co/1600x900/png?text=FinTrack+Cover',
            logo: 'https://placehold.co/400x400/png?text=FT',
            year: '2026',
            groupNumber: 'Y4S1-G03',
            projectStatus: 'IDEA',
            approvalStatus: 'PENDING',
            featured: false,
            domain: 'FINTECH',
            projectType: 'MOBILE',
            sdg: 'DECENT_WORK',
            techStack: 'FLUTTER',
            problemStatement:
                'Students struggle to track recurring expenses, which leads to overspending and missed utility or rental payments.',
            solution:
                'FinTrack provides category-based budgeting with recurring reminder automation and weekly spend analysis.',
            features:
                '- Auto-tagging of spending categories\n- Weekly cashflow digest\n- Shared budget circles for roommates\n- Savings milestone tracking',
            teamEmail: 'fintrack.team@sdgp.lk',
            teamPhone: '+94770000003',
            slides: [
                'https://placehold.co/1280x720/png?text=FinTrack+Wallet+View',
                'https://placehold.co/1280x720/png?text=FinTrack+Savings+Goals',
            ],
            teamMembers: [
                {
                    name: 'Yohan Madushanka',
                    linkedin: 'https://www.linkedin.com/in/yohan-madushanka',
                    profileImage: 'https://placehold.co/120x120/png?text=YM',
                },
                {
                    name: 'Ayesha Niroshini',
                    linkedin: 'https://www.linkedin.com/in/ayesha-niroshini',
                    profileImage: 'https://placehold.co/120x120/png?text=AN',
                },
            ],
            socials: [
                { type: 'TWITTER', url: 'https://x.com/fintrack_lk' },
                { type: 'LINKEDIN', url: 'https://www.linkedin.com/company/fintrack-lk' },
            ],
        },
        {
            metadataId: 'seed-project-pending-2',
            contentId: 'seed-content-pending-2',
            title: 'HealthBridge Remote Follow-Up',
            subtitle: 'Post-clinic patient follow-up and medication compliance tracker',
            module: 'SE4040',
            website: 'https://healthbridge-demo.example.com',
            coverImage: 'https://placehold.co/1600x900/png?text=HealthBridge+Cover',
            logo: 'https://placehold.co/400x400/png?text=HB',
            year: '2026',
            groupNumber: 'Y4S1-G04',
            projectStatus: 'RESEARCH',
            approvalStatus: 'PENDING',
            featured: false,
            domain: 'HEALTHTECH',
            projectType: 'WEB',
            sdg: 'GOOD_HEALTH',
            techStack: 'REACT',
            problemStatement:
                'Clinics have limited visibility into whether patients adhere to treatment plans after discharge.',
            solution:
                'HealthBridge supports appointment reminders, medication check-ins, and escalation alerts to clinical teams.',
            features:
                '- Medication adherence timeline\n- Follow-up appointment queue\n- Nurse escalation dashboard\n- SMS and email reminders',
            teamEmail: 'healthbridge.team@sdgp.lk',
            teamPhone: '+94770000004',
            slides: [
                'https://placehold.co/1280x720/png?text=HealthBridge+Patient+Timeline',
                'https://placehold.co/1280x720/png?text=HealthBridge+Clinic+Dashboard',
            ],
            teamMembers: [
                {
                    name: 'Ranudi De Silva',
                    linkedin: 'https://www.linkedin.com/in/ranudi-desilva',
                    profileImage: 'https://placehold.co/120x120/png?text=RD',
                },
                {
                    name: 'Charuka Peris',
                    linkedin: 'https://www.linkedin.com/in/charuka-peris',
                    profileImage: 'https://placehold.co/120x120/png?text=CP',
                },
            ],
            socials: [{ type: 'FACEBOOK', url: 'https://www.facebook.com/healthbridge.lk' }],
        },
        {
            metadataId: 'seed-project-rejected-1',
            contentId: 'seed-content-rejected-1',
            title: 'CityFlow Parking Advisor',
            subtitle: 'Parking demand estimator for crowded city zones',
            module: 'SE4050',
            website: 'https://cityflow-demo.example.com',
            coverImage: 'https://placehold.co/1600x900/png?text=CityFlow+Cover',
            logo: 'https://placehold.co/400x400/png?text=CF',
            year: '2026',
            groupNumber: 'Y4S1-G05',
            projectStatus: 'RESEARCH',
            approvalStatus: 'REJECTED',
            rejectedReason: 'Insufficient validation metrics and unclear deployment scope.',
            featured: false,
            domain: 'IOT',
            projectType: 'HARDWARE',
            sdg: 'SUSTAINABLE_CITIES',
            techStack: 'ARDUINO',
            problemStatement:
                'Urban drivers spend excessive time searching for parking due to poor real-time occupancy visibility.',
            solution:
                'CityFlow proposes an IoT sensor network and heatmap service to estimate parking occupancy and direct drivers efficiently.',
            features:
                '- Parking occupancy sensor nodes\n- Live occupancy heatmap\n- Peak-hour prediction\n- Driver routing suggestions',
            teamEmail: 'cityflow.team@sdgp.lk',
            teamPhone: '+94770000005',
            slides: [
                'https://placehold.co/1280x720/png?text=CityFlow+IoT+Node+Design',
                'https://placehold.co/1280x720/png?text=CityFlow+Heatmap+Prototype',
            ],
            teamMembers: [
                {
                    name: 'Amila Senanayake',
                    linkedin: 'https://www.linkedin.com/in/amila-senanayake',
                    profileImage: 'https://placehold.co/120x120/png?text=AS',
                },
                {
                    name: 'Nethmi Weerasinghe',
                    linkedin: 'https://www.linkedin.com/in/nethmi-weerasinghe',
                    profileImage: 'https://placehold.co/120x120/png?text=NW',
                },
            ],
            socials: [{ type: 'LINKEDIN', url: 'https://www.linkedin.com/company/cityflow-lk' }],
        },
        {
            metadataId: 'seed-project-rejected-2',
            contentId: 'seed-content-rejected-2',
            title: 'SecureVote Campus Polling',
            subtitle: 'Blockchain-backed student union election platform',
            module: 'SE4060',
            website: 'https://securevote-demo.example.com',
            coverImage: 'https://placehold.co/1600x900/png?text=SecureVote+Cover',
            logo: 'https://placehold.co/400x400/png?text=SV',
            year: '2026',
            groupNumber: 'Y4S1-G06',
            projectStatus: 'MVP',
            approvalStatus: 'REJECTED',
            rejectedReason: 'Security threat model and accessibility requirements were not complete.',
            featured: false,
            domain: 'SECURITY',
            projectType: 'WEB',
            sdg: 'PEACE_JUSTICE',
            techStack: 'NODE',
            problemStatement:
                'Manual campus elections are difficult to audit and vulnerable to process errors.',
            solution:
                'SecureVote introduces verifiable ballots with transparency logs and strong role-based election administration.',
            features:
                '- Voter identity verification\n- Ballot encryption workflow\n- Audit-ready immutable logs\n- Election analytics dashboard',
            teamEmail: 'securevote.team@sdgp.lk',
            teamPhone: '+94770000006',
            slides: [
                'https://placehold.co/1280x720/png?text=SecureVote+Voting+Portal',
                'https://placehold.co/1280x720/png?text=SecureVote+Audit+Trail',
            ],
            teamMembers: [
                {
                    name: 'Ishan Wickramarathna',
                    linkedin: 'https://www.linkedin.com/in/ishan-wickramarathna',
                    profileImage: 'https://placehold.co/120x120/png?text=IW',
                },
                {
                    name: 'Hashini Dissanayake',
                    linkedin: 'https://www.linkedin.com/in/hashini-dissanayake',
                    profileImage: 'https://placehold.co/120x120/png?text=HD',
                },
            ],
            socials: [
                { type: 'YOUTUBE', url: 'https://www.youtube.com/watch?v=securevote-demo' },
                { type: 'TWITTER', url: 'https://x.com/securevote_lk' },
            ],
        },
    ]

    for (const seed of approvalSeeds) {
        await prisma.projectMetadata.upsert({
            where: { project_id: seed.metadataId },
            update: {
                sdgp_year: seed.year,
                group_num: seed.groupNumber,
                title: seed.title,
                subtitle: seed.subtitle,
                website: seed.website,
                cover_image: seed.coverImage,
                logo: seed.logo,
                module: seed.module,
                featured: seed.featured,
                featured_by_userId: seed.featured ? adminUserId : null,
            },
            create: {
                project_id: seed.metadataId,
                sdgp_year: seed.year,
                group_num: seed.groupNumber,
                title: seed.title,
                subtitle: seed.subtitle,
                website: seed.website,
                cover_image: seed.coverImage,
                logo: seed.logo,
                module: seed.module,
                featured: seed.featured,
                featured_by_userId: seed.featured ? adminUserId : null,
            },
        })

        await prisma.projectContent.upsert({
            where: { metadata_id: seed.metadataId },
            update: {},
            create: {
                content_id: seed.contentId,
                metadata_id: seed.metadataId,
            },
        })

        await prisma.projectStatus.upsert({
            where: { content_id: seed.contentId },
            update: {
                status: seed.projectStatus,
                approved_status: seed.approvalStatus,
                approved_by_userId:
                    seed.approvalStatus === 'APPROVED' || seed.approvalStatus === 'REJECTED'
                        ? adminUserId
                        : null,
                approved_at:
                    seed.approvalStatus === 'APPROVED' || seed.approvalStatus === 'REJECTED'
                        ? new Date()
                        : null,
                rejected_reason: seed.approvalStatus === 'REJECTED' ? seed.rejectedReason ?? null : null,
            },
            create: {
                content_id: seed.contentId,
                status: seed.projectStatus,
                approved_status: seed.approvalStatus,
                approved_by_userId:
                    seed.approvalStatus === 'APPROVED' || seed.approvalStatus === 'REJECTED'
                        ? adminUserId
                        : null,
                approved_at:
                    seed.approvalStatus === 'APPROVED' || seed.approvalStatus === 'REJECTED'
                        ? new Date()
                        : null,
                rejected_reason: seed.approvalStatus === 'REJECTED' ? seed.rejectedReason ?? null : null,
            },
        })

        await seedProjectDetailsData(seed)
    }

    console.log('Project approval statuses and details seeded successfully (approved, pending, rejected).')
}

type CompetitionSeed = {
    id: string
    name: string
    isFeatured: boolean
    startDate: string
    endDate: string
    description: string
    type: string
    logo: string
    coverImage: string
    schools: string
    module: string
    teamsParticipated: number
    projectsCompleted: number
    approvalStatus: ApprovalType
    rejectedReason?: string
}

type AwardSeed = {
    id: string
    name: string
    image: string
    competitionId: string
    projectId: string
    contentId: string
    approvalStatus: ApprovalType
    rejectedReason?: string
}

async function seedCompetitionsAndAwards(adminUserId: string) {
    const competitions: CompetitionSeed[] = [
        {
            id: 'seed-competition-approved',
            name: 'Innovation Sprint 2026',
            isFeatured: true,
            startDate: '2026-05-10T00:00:00.000Z',
            endDate: '2026-06-15T00:00:00.000Z',
            description:
                'A six-week innovation sprint focused on practical software solutions with measurable community impact.',
            type: 'Hackathon',
            logo: 'https://placehold.co/300x300/png?text=IS',
            coverImage: 'https://placehold.co/1600x600/png?text=Innovation+Sprint+2026',
            schools: 'Computing, Engineering',
            module: 'SE4500',
            teamsParticipated: 48,
            projectsCompleted: 42,
            approvalStatus: 'APPROVED',
        },
        {
            id: 'seed-competition-pending',
            name: 'GreenTech Challenge 2026',
            isFeatured: false,
            startDate: '2026-07-01T00:00:00.000Z',
            endDate: '2026-08-01T00:00:00.000Z',
            description:
                'Competition for sustainability-first digital products aligned with SDG impact tracking.',
            type: 'Challenge',
            logo: 'https://placehold.co/300x300/png?text=GT',
            coverImage: 'https://placehold.co/1600x600/png?text=GreenTech+Challenge+2026',
            schools: 'Computing, Business',
            module: 'SE4510',
            teamsParticipated: 30,
            projectsCompleted: 0,
            approvalStatus: 'PENDING',
        },
        {
            id: 'seed-competition-rejected',
            name: 'Legacy Idea Marathon',
            isFeatured: false,
            startDate: '2026-03-01T00:00:00.000Z',
            endDate: '2026-03-20T00:00:00.000Z',
            description:
                'A draft competition concept retained for local UI testing of rejected submissions.',
            type: 'Ideathon',
            logo: 'https://placehold.co/300x300/png?text=LM',
            coverImage: 'https://placehold.co/1600x600/png?text=Legacy+Idea+Marathon',
            schools: 'Computing',
            module: 'SE4490',
            teamsParticipated: 12,
            projectsCompleted: 5,
            approvalStatus: 'REJECTED',
            rejectedReason: 'Schedule and judging rubric were incomplete for public launch.',
        },
    ]

    for (const competition of competitions) {
        await prisma.competition.upsert({
            where: { id: competition.id },
            update: {
                name: competition.name,
                is_featured: competition.isFeatured,
                start_date: new Date(competition.startDate),
                end_date: new Date(competition.endDate),
                description: competition.description,
                type: competition.type,
                logo: competition.logo,
                cover_image: competition.coverImage,
                schools: competition.schools,
                module: competition.module,
                teamsParticipated: competition.teamsParticipated,
                projectsCompleted: competition.projectsCompleted,
                approval_status: competition.approvalStatus,
                accepted_by_id: competition.approvalStatus === 'APPROVED' ? adminUserId : null,
                rejected_by_id: competition.approvalStatus === 'REJECTED' ? adminUserId : null,
                rejected_reason: competition.approvalStatus === 'REJECTED' ? competition.rejectedReason ?? null : null,
            },
            create: {
                id: competition.id,
                name: competition.name,
                is_featured: competition.isFeatured,
                start_date: new Date(competition.startDate),
                end_date: new Date(competition.endDate),
                description: competition.description,
                type: competition.type,
                logo: competition.logo,
                cover_image: competition.coverImage,
                schools: competition.schools,
                module: competition.module,
                teamsParticipated: competition.teamsParticipated,
                projectsCompleted: competition.projectsCompleted,
                approval_status: competition.approvalStatus,
                accepted_by_id: competition.approvalStatus === 'APPROVED' ? adminUserId : null,
                rejected_by_id: competition.approvalStatus === 'REJECTED' ? adminUserId : null,
                rejected_reason: competition.approvalStatus === 'REJECTED' ? competition.rejectedReason ?? null : null,
            },
        })
    }

    const awards: AwardSeed[] = [
        {
            id: 'seed-award-approved',
            name: 'Best Educational Innovation',
            image: 'https://placehold.co/300x300/png?text=Award+1',
            competitionId: 'seed-competition-approved',
            projectId: 'seed-project-approved-1',
            contentId: 'seed-content-approved-1',
            approvalStatus: 'APPROVED',
        },
        {
            id: 'seed-award-pending',
            name: 'Emerging Impact Product',
            image: 'https://placehold.co/300x300/png?text=Award+2',
            competitionId: 'seed-competition-pending',
            projectId: 'seed-project-pending-1',
            contentId: 'seed-content-pending-1',
            approvalStatus: 'PENDING',
        },
        {
            id: 'seed-award-rejected',
            name: 'Technical Excellence',
            image: 'https://placehold.co/300x300/png?text=Award+3',
            competitionId: 'seed-competition-rejected',
            projectId: 'seed-project-rejected-1',
            contentId: 'seed-content-rejected-1',
            approvalStatus: 'REJECTED',
            rejectedReason: 'Judging scores were below the acceptance threshold.',
        },
    ]

    for (const award of awards) {
        await prisma.award.upsert({
            where: { id: award.id },
            update: {
                name: award.name,
                image: award.image,
                competition_id: award.competitionId,
                project_id: award.projectId,
                approval_status: award.approvalStatus,
                accepted_by_id: award.approvalStatus === 'APPROVED' ? adminUserId : null,
                rejected_by_id: award.approvalStatus === 'REJECTED' ? adminUserId : null,
                rejected_reason: award.approvalStatus === 'REJECTED' ? award.rejectedReason ?? null : null,
            },
            create: {
                id: award.id,
                name: award.name,
                image: award.image,
                competition_id: award.competitionId,
                project_id: award.projectId,
                approval_status: award.approvalStatus,
                accepted_by_id: award.approvalStatus === 'APPROVED' ? adminUserId : null,
                rejected_by_id: award.approvalStatus === 'REJECTED' ? adminUserId : null,
                rejected_reason: award.approvalStatus === 'REJECTED' ? award.rejectedReason ?? null : null,
            },
        })
    }

    await prisma.projectAssociation.deleteMany({
        where: {
            type: 'AWARD',
            content_id: { in: awards.map((award) => award.contentId) },
        },
    })

    await prisma.projectAssociation.createMany({
        data: awards.map((award) => ({
            content_id: award.contentId,
            type: 'AWARD',
            value: award.name,
            award_id: award.id,
        })),
    })

    console.log('Competitions and awards seeded successfully.')
}

type BlogAuthorSeed = {
    id: string
    name: string
    email: string
    avatarUrl: string
    instagram: string
    twitter: string
    facebook: string
    linkedin: string
    medium: string
    website: string
}

type BlogSeed = {
    id: string
    title: string
    excerpt: string
    content: string
    imageUrl: string
    publishedAt: string
    authorId: string
    category: ProjectDomainType
    featured: boolean
    approved: boolean
    rejected: boolean
    rejectedReason?: string
    module: string
}

async function seedBlogs(adminUserId: string) {
    const authors: BlogAuthorSeed[] = [
        {
            id: 'seed-blog-author-1',
            name: 'Sachini Weerasekara',
            email: 'sachini.weerasekara@sdgp.lk',
            avatarUrl: 'https://placehold.co/200x200/png?text=SW',
            instagram: 'https://instagram.com/sachini.sdgp',
            twitter: 'https://x.com/sachini_sdgp',
            facebook: 'https://facebook.com/sachini.sdgp',
            linkedin: 'https://linkedin.com/in/sachini-weerasekara',
            medium: 'https://medium.com/@sachini.sdgp',
            website: 'https://sachini-sdgp.example.com',
        },
        {
            id: 'seed-blog-author-2',
            name: 'Tharindu Kulatunga',
            email: 'tharindu.kulatunga@sdgp.lk',
            avatarUrl: 'https://placehold.co/200x200/png?text=TK',
            instagram: 'https://instagram.com/tharindu.sdgp',
            twitter: 'https://x.com/tharindu_sdgp',
            facebook: 'https://facebook.com/tharindu.sdgp',
            linkedin: 'https://linkedin.com/in/tharindu-kulatunga',
            medium: 'https://medium.com/@tharindu.sdgp',
            website: 'https://tharindu-sdgp.example.com',
        },
    ]

    for (const author of authors) {
        await prisma.blogAuthor.upsert({
            where: { id: author.id },
            update: {
                name: author.name,
                email: author.email,
                avatarUrl: author.avatarUrl,
                instagram: author.instagram,
                twitter: author.twitter,
                facebook: author.facebook,
                linkedin: author.linkedin,
                medium: author.medium,
                website: author.website,
            },
            create: author,
        })
    }

    const blogs: BlogSeed[] = [
        {
            id: 'seed-blog-approved-1',
            title: 'How Student Teams Built an AI Tutor in 8 Weeks',
            excerpt: 'A practical breakdown of roadmap planning, delivery pacing, and demo readiness.',
            content:
                'Building an AI tutor required us to split scope into weekly validation milestones. We started with narrow problem hypotheses, tested quickly with users, and iterated on onboarding and feedback quality. By week six, we had confidence in our tutoring flow and shifted focus to reliability and reporting.\n\nThe biggest lesson was to keep model complexity lower until product behavior is stable.',
            imageUrl: 'https://placehold.co/1200x700/png?text=AI+Tutor+Journey',
            publishedAt: '2026-04-01T08:00:00.000Z',
            authorId: 'seed-blog-author-1',
            category: 'AI',
            featured: true,
            approved: true,
            rejected: false,
            module: 'SE4700',
        },
        {
            id: 'seed-blog-approved-2',
            title: 'Designing Better Team Workflows for Final-Year Projects',
            excerpt: 'Communication structures that keep engineering teams focused and aligned.',
            content:
                'Most delivery delays in student teams are caused by unclear ownership and weak handoffs. We adopted a weekly operational ritual with short syncs, decision logs, and checklist-driven pull requests. This reduced blocker time and helped us ship demo-ready increments consistently.',
            imageUrl: 'https://placehold.co/1200x700/png?text=Team+Workflow+Playbook',
            publishedAt: '2026-04-05T08:00:00.000Z',
            authorId: 'seed-blog-author-2',
            category: 'EDTECH',
            featured: false,
            approved: true,
            rejected: false,
            module: 'SE4701',
        },
        {
            id: 'seed-blog-pending-1',
            title: 'Fintech UX Patterns for Student Budget Apps',
            excerpt: 'Patterns we tested to improve spend awareness and retention.',
            content:
                'We experimented with card layouts, budget progress bars, and reminder nudges to improve retention. Early results suggest that adaptive weekly summaries outperform static dashboards for student users.',
            imageUrl: 'https://placehold.co/1200x700/png?text=Fintech+UX+Patterns',
            publishedAt: '2026-04-10T08:00:00.000Z',
            authorId: 'seed-blog-author-1',
            category: 'FINTECH',
            featured: false,
            approved: false,
            rejected: false,
            module: 'SE4702',
        },
        {
            id: 'seed-blog-pending-2',
            title: 'Sustainability Metrics in Campus Innovation',
            excerpt: 'How to set measurable impact metrics from the first sprint.',
            content:
                'Teams often mention sustainability goals without measurable targets. We propose a baseline-impact framework that tracks adoption, behavioral shift, and efficiency impact for every release.',
            imageUrl: 'https://placehold.co/1200x700/png?text=Sustainability+Metrics',
            publishedAt: '2026-04-12T08:00:00.000Z',
            authorId: 'seed-blog-author-2',
            category: 'SUSTAINABILITY',
            featured: false,
            approved: false,
            rejected: false,
            module: 'SE4703',
        },
        {
            id: 'seed-blog-rejected-1',
            title: 'Early Draft: Blockchain in Every Student Product',
            excerpt: 'A rejected draft retained for moderation workflow testing.',
            content:
                'This article was intentionally left as an over-generalized claim set and is retained for local rejected-state UI testing.',
            imageUrl: 'https://placehold.co/1200x700/png?text=Rejected+Draft+Blog',
            publishedAt: '2026-03-20T08:00:00.000Z',
            authorId: 'seed-blog-author-1',
            category: 'BLOCKCHAIN',
            featured: false,
            approved: false,
            rejected: true,
            rejectedReason: 'Claims were not evidence-backed and required substantial revision.',
            module: 'SE4704',
        },
    ]

    for (const blog of blogs) {
        await prisma.blogPost.upsert({
            where: { id: blog.id },
            update: {
                title: blog.title,
                excerpt: blog.excerpt,
                content: blog.content,
                imageUrl: blog.imageUrl,
                publishedAt: new Date(blog.publishedAt),
                authorId: blog.authorId,
                category: blog.category,
                featured: blog.featured,
                approved: blog.approved,
                approvedById: blog.approved ? adminUserId : null,
                rejectedById: blog.rejected ? adminUserId : null,
                rejectedReason: blog.rejected ? blog.rejectedReason ?? null : null,
                module: blog.module,
            },
            create: {
                id: blog.id,
                title: blog.title,
                excerpt: blog.excerpt,
                content: blog.content,
                imageUrl: blog.imageUrl,
                publishedAt: new Date(blog.publishedAt),
                authorId: blog.authorId,
                category: blog.category,
                featured: blog.featured,
                approved: blog.approved,
                approvedById: blog.approved ? adminUserId : null,
                rejectedById: blog.rejected ? adminUserId : null,
                rejectedReason: blog.rejected ? blog.rejectedReason ?? null : null,
                module: blog.module,
            },
        })
    }

    console.log('Blog authors and posts seeded successfully.')
}


main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('Seeding completed successfully.')
    })
    .catch(async (e) => {
        console.error('Error during seeding:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
*/
