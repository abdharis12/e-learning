import type { NavGroup } from '@/types';
import {
    BarChart3,
    BookOpen,
    ClipboardList,
    FileInput,
    FileText,
    MonitorCheck,
} from 'lucide-react';
import {
    adminExamMonitor,
    adminExamsIndex,
    adminResultsIndex,
    examsIndex,
    participantIndex,
    participantResultsIndex,
} from '@/routes';
import { index as questionsIndex } from '@/routes/questions';

// ✅ Admin Menu
export const adminExamMenus: NavGroup[] = [
    {
        label: 'Management Soal',
        items: [
            {
                title: 'Kelola Soal',
                href: adminExamsIndex(),
                icon: ClipboardList,
            },
            {
                title: 'Bank Soal',
                href: questionsIndex(),
                icon: FileText,
            },
        ],
    },
    {
        label: 'Management Ujian',
        items: [
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
        ],
    },
    {
        label: 'Management Pendaftaran',
        items: [
            {
                title: 'Persyaratan',
                href: participantIndex(),
                icon: FileInput,
            },
        ],
    }
];

// ✅ Participant Menu
export const participantExamMenus: NavGroup[] = [
    {
        label: 'Management Ujian',
        items: [
            {
                title: 'Ujian',
                href: examsIndex(),
                icon: BookOpen,
            },
        ],
    },
    {
        label: 'Management Hasil Ujian',
        items: [
            {
                title: 'Hasil Ujian',
                href: participantResultsIndex(),
                icon: BarChart3,
            },
        ],
    },
    {
        label: 'Management Pendaftaran',
        items: [
            {
                title: 'Persyaratan',
                href: participantIndex(),
                icon: FileInput,
            },
        ],
    },
];
