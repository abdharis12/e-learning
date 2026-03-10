import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { adminResultsIndex } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Users, GraduationCap, Calendar, ChevronLeft, ChevronRight, FileSpreadsheet, Trophy } from 'lucide-react';

type ResultItem = {
    id: number;
    score: number | null;
    finished_at: string | null;
    user: {
        id: number;
        name: string;
    } | null;
    exam: {
        id: number;
        title: string;
    } | null;
};

type ResultPagination = {
    data: ResultItem[];
    current_page: number;
    last_page: number;
    from: number | null;
    total: number;
};

interface Props {
    results: ResultPagination;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Hasil Ujian',
        href: adminResultsIndex(),
    },
];

const formatDateTime = (value: string | null): string => {
    if (!value) return '-';
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
};

export default function AdminResultIndex({ results }: Props) {
    const hasPreviousPage = results.current_page > 1;
    const hasNextPage = results.current_page < results.last_page;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hasil Ujian - Admin" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12 lg:p-16">

                {/* Modern Admin Header */}
                <header className="relative mb-12 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 items-center justify-center rounded-full bg-emerald-100 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            Management Analytics
                        </div>
                        <span className="h-[1px] flex-1 bg-slate-200"></span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="space-y-2">
                            <p className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                Hasil <span className="text-emerald-500">Ujian.</span>
                            </p>
                            <p className="max-w-md text-sm text-slate-400 font-base">
                                Rekapitulasi nilai real-time peserta seleksi tenaga ahli.
                            </p>
                        </div>
                    </div>
                </header>

                <Card className="border-none bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                    <Trophy className="text-emerald-600" size={24} />
                                </div>
                                <CardTitle className="text-xl font-black text-slate-900 leading-none">
                                    Daftar Peserta Ujian
                                </CardTitle>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 px-8 pb-8">
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="w-full min-w-[760px]">
                                <thead>
                                    <tr className="text-slate-900 bg-emerald-200">
                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.1em]">No</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.1em]">Peserta</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.1em]">Mata Ujian</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.1em]">Perolehan Skor</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.1em]">Waktu Selesai</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.data.length > 0 ? (
                                        results.data.map((result, index) => (
                                            <tr
                                                key={result.id}
                                                className="group transition-all duration-300"
                                            >
                                                <td className="px-4 py-5 text-sm font-bold text-slate-300 bg-slate-50/50 w-12 text-center group-hover:bg-slate-100 group-hover:text-slate-900 transition-colors">
                                                    {(results.from ?? 1) + index}
                                                </td>
                                                <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-slate-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                                            <Users size={16} className="text-slate-400" />
                                                        </div>
                                                        <span className="font-extrabold text-slate-900 tracking-tight">{result.user?.name ?? '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-slate-100 transition-colors">
                                                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm italic">
                                                        <GraduationCap size={16} className="text-emerald-500" />
                                                        {result.exam?.title ?? '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-slate-100 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xl font-black ${(result.score ?? 0) >= 70 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                            {result.score ?? 0}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-300 uppercase">Poin</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-slate-100 transition-colors">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                        <Calendar size={14} />
                                                        {formatDateTime(result.finished_at)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                                                        <Users className="text-slate-200" size={24} />
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Belum ada hasil</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Modern Pagination */}
                        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-10 sm:flex-row">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                Page <span className="text-slate-900">{results.current_page}</span> of <span className="text-slate-900">{results.last_page}</span>
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    disabled={!hasPreviousPage}
                                    asChild={hasPreviousPage}
                                    className="rounded-2xl h-14 px-6 border-slate-100 hover:bg-slate-50 font-black text-[11px] uppercase tracking-widest transition-all"
                                >
                                    {hasPreviousPage ? (
                                        <Link
                                            href={adminResultsIndex({ query: { page: results.current_page - 1 } })}
                                            preserveScroll
                                        >
                                            <ChevronLeft className="mr-2 h-4 w-4" /> PREV
                                        </Link>
                                    ) : (
                                        <span className="opacity-30">PREV</span>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    disabled={!hasNextPage}
                                    asChild={hasNextPage}
                                    className="rounded-2xl h-14 px-6 border-slate-100 hover:bg-slate-50 font-black text-[11px] uppercase tracking-widest transition-all"
                                >
                                    {hasNextPage ? (
                                        <Link
                                            href={adminResultsIndex({ query: { page: results.current_page + 1 } })}
                                            preserveScroll
                                        >
                                            NEXT <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <span className="opacity-30">NEXT</span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Secure Info Footer */}
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
