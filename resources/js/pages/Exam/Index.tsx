import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { examsIndex, examsStart } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Clock, BookOpen, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type Exam = {
    id: number;
    title: string;
    duration_minutes: number;
    questions_count: number;
    max_attempts: number;
    attempts_used: number;
    attempts_left: number;
    available_from: string | null;
    available_until: string | null;
    can_start: boolean;
};

interface Props {
    exams: Exam[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ujian',
        href: examsIndex(),
    },
];

export default function ExamIndex({ exams }: Props) {
    const formatWindow = (from: string | null, until: string | null): string => {
        if (!from && !until) return 'Terbuka Umum';
        const formatter = new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
        return `${from ? formatter.format(new Date(from)) : '-'} — ${until ? formatter.format(new Date(until)) : '-'}`;
    };

    const startExam = (examId: number) => {
        router.post(examsStart(examId).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Ujian" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12 lg:p-16">
                {/* Modern Header Section */}
                <header className="relative mb-16 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 items-center justify-center rounded-full bg-emerald-50 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                            Professional Assessment
                        </div>
                        <span className="h-[1px] flex-1 bg-slate-200"></span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="space-y-2">
                            <p className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-4xl">
                                Daftar <span className="text-emerald-500">Ujian.</span>
                            </p>
                            <p className="max-w-md text-sm leading-relaxed text-slate-400">
                                Pilih modul evaluasi untuk memulai sertifikasi kompetensi Anda hari ini.
                            </p>
                        </div>
                        <div className="hidden lg:block text-right text-[10px] font-medium text-slate-700 uppercase tracking-widest">
                            Portal Resmi <br /> Kab. Muara Enim
                        </div>
                    </div>
                </header>

                <hr className="border-slate-200 mb-20" />

                {/* Grid Section with Bento-inspired spacing */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {exams.map((exam) => (
                        <Card
                            key={exam.id}
                            className="group flex flex-col border-none bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:ring-emerald-200 rounded-[2.5rem] p-4"
                        >
                            <CardHeader className="space-y-4 pb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-slate-50 text-slate-900 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                                        <Sparkles size={20} />
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                        ID-{exam.id.toString().padStart(3, '0')}
                                    </div>
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-extrabold leading-tight text-slate-900">
                                        {exam.title}
                                    </CardTitle>
                                    <CardDescription className="mt-2 flex items-center gap-2 font-semibold text-emerald-600">
                                        <Clock size={14} className="stroke-[3px]" />
                                        {exam.duration_minutes} Mins limit
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <CardContent className="flex flex-1 flex-col justify-between space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-[1.5rem] bg-emerald-50 p-4 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Soal</p>
                                        <p className="text-lg font-black text-slate-700">{exam.questions_count}</p>
                                    </div>
                                    <div className="rounded-[1.5rem] bg-emerald-50 p-4 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attempt</p>
                                        <p className="text-lg font-black text-slate-700">{exam.attempts_used}/{exam.max_attempts}</p>
                                    </div>
                                </div>

                                <div className="space-y-1 px-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Calendar size={12} /> Jadwal Akses
                                    </span>
                                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                                        {formatWindow(exam.available_from, exam.available_until)}
                                    </p>
                                </div>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            disabled={!exam.can_start}
                                            className={`h-16 w-full rounded-[1.8rem] text-sm font-black transition-all duration-300 group-hover:gap-4 ${exam.can_start
                                                ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-xl shadow-slate-200 cursor-pointer'
                                                : 'bg-slate-50 text-slate-300 border border-slate-100 pointer-events-none'
                                                }`}
                                        >
                                            {exam.can_start ? (
                                                <>
                                                    MULAI UJIAN SEKARANG <ArrowRight size={18} className="stroke-[3px]" />
                                                </>
                                            ) : (
                                                'BELUM TERSEDIA'
                                            )}
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Apakah Anda sudah siap untuk mulai ujian?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Anda akan memulai ujian <strong>{exam.title}</strong>.
                                                Pastikan koneksi internet stabil dan Anda tidak menutup halaman ujian selama berlangsung.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => startExam(exam.id)}
                                                className="bg-emerald-600 hover:bg-emerald-700"
                                            >
                                                Ya, Mulai Ujian
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {exams.length < 1 && (
                    <div className="flex flex-col items-center justify-center rounded-[3rem] border border-slate-200 bg-slate-50/30 py-32 text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                            <BookOpen size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Antrian Kosong</h3>
                        <p className="text-sm text-slate-500">Semua ujian Anda telah selesai atau belum diterbitkan.</p>
                    </div>
                )}

                {/* Minimalist Footer */}
                <footer className="mt-24 flex items-center justify-between border-t border-slate-200 pt-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
                        Diskominfo Kabupaten Muara Enim
                    </p>
                    <div className="flex h-2 items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-700 uppercase">AHDA Dev | V.1.0</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}
