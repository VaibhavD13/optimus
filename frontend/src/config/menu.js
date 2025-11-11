// src/config/menu.js
import {
  HomeIcon, FolderOpenIcon, UsersIcon, ChartBarIcon, Cog6ToothIcon,
  CalendarIcon, DocumentTextIcon, CreditCardIcon, PuzzlePieceIcon, ChatBubbleBottomCenterTextIcon,
  CurrencyDollarIcon, ShieldCheckIcon
} from '@heroicons/react/24/outline';

export const MENUS = {
  employer: [
    { id: 'dashboard', title: 'Dashboard', to: '/employer', icon: HomeIcon },
    { id: 'jobs', title: 'Jobs / Postings', to: '/employer/jobs', icon: DocumentTextIcon },
    { id: 'applicants', title: 'Applicants', to: '/employer/applicants', icon: UsersIcon },
    { id: 'schedule', title: 'Interview Calendar', to: '/employer/schedule', icon: CalendarIcon },
    { id: 'analytics', title: 'Analytics & Reports', to: '/employer/analytics', icon: ChartBarIcon },
    { id: 'team', title: 'Team / Users', to: '/employer/team', icon: UsersIcon },
    { id: 'billing', title: 'Billing & Subscription', to: '/employer/billing', icon: CreditCardIcon },
    { id: 'integrations', title: 'Integrations', to: '/employer/integrations', icon: PuzzlePieceIcon },
    { id: 'settings', title: 'Company Settings', to: '/employer/settings', icon: Cog6ToothIcon },

    // optional/secondary
    { id: 'templates', title: 'Templates / Snippets', to: '/employer/templates', icon: DocumentTextIcon, optional: true },
    { id: 'messages', title: 'Jobs Inbox / Messages', to: '/employer/messages', icon: ChatBubbleBottomCenterTextIcon, optional: true }
  ],

  admin: [
    { id: 'admin_dashboard', title: 'Admin Dashboard', to: '/admin', icon: HomeIcon },
    { id: 'companies', title: 'Companies / Tenants', to: '/admin/companies', icon: FolderOpenIcon },
    { id: 'users', title: 'Users', to: '/admin/users', icon: UsersIcon },
    { id: 'moderation', title: 'Jobs & Content Moderation', to: '/admin/moderation', icon: ShieldCheckIcon },
    { id: 'billing_admin', title: 'Billing & Plans', to: '/admin/billing', icon: CurrencyDollarIcon },
    { id: 'audit', title: 'System Logs & Audit', to: '/admin/audit', icon: ChartBarIcon },
    { id: 'settings_admin', title: 'Platform Settings', to: '/admin/settings', icon: Cog6ToothIcon },

    // optional
    { id: 'support', title: 'Support Tickets', to: '/admin/support', icon: ChatBubbleBottomCenterTextIcon, optional: true },
    { id: 'flags', title: 'Feature Flags', to: '/admin/flags', icon: PuzzlePieceIcon, optional: true }
  ],

  applicant: [
    { id: 'discover', title: 'Discover Jobs', to: '/jobs', icon: HomeIcon },
    { id: 'saved', title: 'Saved Jobs', to: '/saved', icon: FolderOpenIcon },
    { id: 'applications', title: 'My Applications', to: '/applications', icon: DocumentTextIcon },
    { id: 'profile', title: 'Profile / Resume', to: '/profile', icon: UsersIcon },
    { id: 'notifications', title: 'Notifications', to: '/notifications', icon: ChatBubbleBottomCenterTextIcon },
    { id: 'settings', title: 'Settings', to: '/settings', icon: Cog6ToothIcon },
    { id: 'resources', title: 'Career Center', to: '/help/career', icon: ChartBarIcon },

    // optional
    { id: 'following', title: 'Company Following', to: '/following', icon: UsersIcon, optional: true },
    { id: 'referrals', title: 'Referrals', to: '/referrals', icon: CurrencyDollarIcon, optional: true }
  ]
};