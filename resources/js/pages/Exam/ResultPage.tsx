import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { examsIndex } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import {
    Trophy,
    CheckCircle2,
    XCircle,
    ArrowRight,
    BarChart3,
    BadgeCheck,
    RotateCcw
} from 'lucide-react';

interface Props {
    examTitle: string | null;
    score: number | null;
    correct: number;
    wrong: number;
    total: number;
}

export default function ResultPage({
    examTitle,
    score,
    correct,
    wrong,
    total,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Ujian', href: examsIndex() },
        { title: 'Hasil', href: '#' },
    ];

    // Persentase untuk visual progress (opsional)
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hasil Ujian" />

            <div className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col items-center justify-center p-6 md:p-12">

                {/* Achievement Badge */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-20"></div>
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-slate-900 text-emerald-400 shadow-2xl">
                        <Trophy size={40} />
                    </div>
                </div>

                <div className="mb-12 text-center space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                        Ujian <span className="text-emerald-500">Selesai.</span>
                    </h1>
                    <p className="text-base font-medium text-slate-400">
                        {examTitle ?? 'Modul Evaluasi'} telah berhasil direkapitulasi.
                    </p>
                </div>

                <Card className="w-full border-none bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-100 rounded-[3.5rem] overflow-hidden">
                    <CardHeader className="p-10 pb-0 text-center">
                        <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            Final Performance Score
                        </CardDescription>
                        <div className="mt-4 flex flex-col items-center">
                            <span className="text-8xl font-black tracking-tighter text-slate-900 tabular-nums">
                                {score ?? 0}
                            </span>
                            <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-50 px-4 py-1 border border-slate-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Indeks Prestasi</span>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-10 space-y-10">
                        {/* Stats Grid */}
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="group rounded-[2rem] bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 ring-1 ring-transparent hover:ring-slate-100">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm transition-transform group-hover:scale-110">
                                    <CheckCircle2 size={20} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Benar</p>
                                <p className="text-2xl font-black text-slate-900 tabular-nums">{correct}</p>
                            </div>

                            <div className="group rounded-[2rem] bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 ring-1 ring-transparent hover:ring-slate-100">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm transition-transform group-hover:scale-110">
                                    <XCircle size={20} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Salah</p>
                                <p className="text-2xl font-black text-slate-900 tabular-nums">{wrong}</p>
                            </div>

                            <div className="group rounded-[2rem] bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 ring-1 ring-transparent hover:ring-slate-100">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-500 shadow-sm transition-transform group-hover:scale-110">
                                    <BarChart3 size={20} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Soal</p>
                                <p className="text-2xl font-black text-slate-900 tabular-nums">{total}</p>
                            </div>
                        </div>

                        {/* Analysis Note */}
                        <div className="flex items-start gap-4 rounded-[2rem] bg-emerald-50/30 p-6 border border-emerald-50">
                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-500 shadow-sm">
                                <BadgeCheck size={18} />
                            </div>
                            <p className="text-xs font-medium leading-relaxed text-emerald-800">
                                Hasil ini telah disimpan secara permanen di basis data pusat. Anda dapat melihat detail riwayat nilai di halaman dashboard peserta kapan saja.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button asChild className="flex-1 rounded-[1.5rem] bg-slate-900 text-white hover:bg-emerald-600 shadow-2xl shadow-slate-200 font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 group">
                                <Link href={examsIndex()} className="flex items-center justify-center gap-3">
                                    Selesai & Keluar <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Signature */}
                <footer className="mt-20 flex items-center justify-between border-t border-slate-200 pt-8 opacity-50">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">Diskominfo kabupaten muara enim</p>
                </footer>
            </div>
        </AppLayout>
    );
}
