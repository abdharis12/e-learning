import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavMainManagementExam } from '@/components/nav-main-management-exam';
import { NavUser } from '@/components/nav-user';
import { adminExamMenus, participantExamMenus } from '@/components/menu-sidebar';
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
    dashboard,
    examsIndex,
} from '@/routes';
import type { NavItem } from '@/types';
import { UserRole } from '@/enums/user-role';

export function AppSidebar() {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === UserRole.Admin;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    const managementExamNavItems = isAdmin
        ? adminExamMenus
        : participantExamMenus;

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
                <NavMainManagementExam groups={managementExamNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
