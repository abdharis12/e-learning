import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    ClipboardList,
    FileText,
    LayoutGrid,
    MonitorCheck,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    adminExamMonitor,
    adminExamsIndex,
    adminResultsIndex,
    dashboard,
    examsIndex,
    participantResultsIndex,
} from '@/routes';
import { index as questionsIndex } from '@/routes/questions';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const mainNavItems: NavItem[] = isAdmin
        ? [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
            {
                title: 'Kelola Ujian',
                href: adminExamsIndex(),
                icon: ClipboardList,
            },
            {
                title: 'Bank Soal',
                href: questionsIndex(),
                icon: FileText,
            },
            {
                title: 'Ujian',
                href: examsIndex(),
                icon: BookOpen,
            },
            {
                title: 'Hasil Ujian',
                href: adminResultsIndex(),
                icon: BarChart3,
            },
            {
                title: 'Monitoring Ujian',
                href: adminExamMonitor(),
                icon: MonitorCheck,
            },
        ]
        : [
            {
                title: 'Ujian',
                href: examsIndex(),
                icon: BookOpen,
            },
            {
                title: 'Hasil Ujian',
                href: participantResultsIndex(),
                icon: BarChart3,
            },
        ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={isAdmin ? dashboard() : examsIndex()}
                                prefetch
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
