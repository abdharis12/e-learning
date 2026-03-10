import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import {
    adminExamAssignmentsIndex,
    adminExamsCreate,
    adminExamsIndex,
} from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { BookOpen, ChevronLeft, ChevronRight, Clock, Plus, Settings2, Users2 } from 'lucide-react';

type ExamItem = {
    id: number;
    title: string;
    duration_minutes: number;
};

type ExamPagination = {
    data: ExamItem[];
    current_page: number;
    last_page: number;
    from: number | null;
    total: number;
};

interface Props {
    exams: ExamPagination;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Ujian',
        href: adminExamsIndex(),
    },
];

export default function AdminExamIndex({ exams }: Props) {
    const hasPreviousPage = exams.current_page > 1;
    const hasNextPage = exams.current_page < exams.last_page;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Ujian" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12 lg:p-16">

                {/* Hyper-Clean 26 Header */}
                <header className="relative mb-12 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 items-center justify-center rounded-full bg-emerald-100 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                            Exam Repository
                        </div>
                        <span className="h-[1px] flex-1 bg-slate-200"></span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="space-y-2">
                            <p className="text-4xl font-black tracking-tight text-slate-900 md:text-4xl">
                                Manajemen <span className="text-emerald-500">Ujian.</span>
                            </p>
                            <p className="max-w-md text-sm text-slate-400 font-normal">
                                Konfigurasi parameter evaluasi dan distribusi bank soal.
                            </p>
                        </div>

                        <Button asChild className="rounded-[1.8rem] bg-slate-900 text-white hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-slate-200 group">
                            <Link href={adminExamsCreate()} prefetch className="flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                Tambah Manajemen Ujian
                            </Link>
                        </Button>
                    </div>
                </header>

                {/* Main Content Card */}
                <Card className="border-none bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black text-slate-900 leading-none">
                                        Daftar Modul Ujian
                                    </CardTitle>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 px-8 pb-8">
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="w-full min-w-[760px]">
                                <thead>
                                    <tr className="text-slate-900 bg-emerald-200">
                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em]">No</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em]">Informasi Ujian</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em]">Durasi</th>
                                        <th className="px-4 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em]">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.data.length > 0 ? (
                                        exams.data.map((exam, index) => (
                                            <tr key={exam.id} className="group transition-all duration-300">
                                                <td className="px-4 py-5 text-sm font-bold text-slate-300 bg-slate-50/50 w-12 text-center group-hover:bg-slate-100 group-hover:text-slate-900 transition-colors italic">
                                                    {(exams.from ?? 1) + index}
                                                </td>
                                                <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-slate-100 transition-colors">
                                                    <span className="font-extrabold text-slate-900 tracking-tight text-base">
                                                        {exam.title}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-slate-100 transition-colors">
                                                    <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-tighter">
                                                        <Clock size={14} className="text-emerald-500" />
                                                        {exam.duration_minutes} Menit
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-slate-100 transition-colors text-right">
                                                    <Button
                                                        variant="outline"
                                                        asChild
                                                        className="h-11 px-6 rounded-xl border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300"
                                                    >
                                                        <Link href={adminExamAssignmentsIndex(exam.id)} className="flex items-center gap-2">
                                                            <Users2 size={14} /> Atur Peserta
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center mb-2">
                                                        <Settings2 className="text-slate-200" size={32} />
                                                    </div>
                                                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">Data belum tersedia</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination 26 Style */}
                        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-10 sm:flex-row">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Showing page <span className="text-slate-900">{exams.current_page}</span> of <span className="text-slate-900">{exams.last_page}</span>
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    disabled={!hasPreviousPage}
                                    asChild={hasPreviousPage}
                                    className="rounded-2xl h-14 px-6 border-slate-100 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest transition-all"
                                >
                                    {hasPreviousPage ? (
                                        <Link href={adminExamsIndex({ query: { page: exams.current_page - 1 } })} preserveScroll>
                                            <ChevronLeft className="mr-2 h-4 w-4" /> Prev
                                        </Link>
                                    ) : (
                                        <span className="opacity-20">Prev</span>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    disabled={!hasNextPage}
                                    asChild={hasNextPage}
                                    className="rounded-2xl h-14 px-6 border-slate-100 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest transition-all"
                                >
                                    {hasNextPage ? (
                                        <Link href={adminExamsIndex({ query: { page: exams.current_page + 1 } })} preserveScroll>
                                            Next <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <span className="opacity-20">Next</span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Signature */}
                <footer className="mt-20 flex items-center justify-between border-t border-slate-200 pt-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">
                        Diskominfo Muara Enim
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">AHDA Dev | V.1.0</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}
