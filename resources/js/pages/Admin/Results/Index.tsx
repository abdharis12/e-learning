import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { adminResultsIndex } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Users, GraduationCap, Calendar, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

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

    const getRank = (index: number): number => {
        return (results.from ?? 1) + index;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hasil Ujian - Admin" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12 lg:p-16">

                {/* HEADER */}
                <header className="relative mb-12 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 items-center justify-center rounded-full bg-emerald-100 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            Management Analytics
                        </div>
                        <span className="h-[1px] flex-1 bg-slate-200"></span>
                    </div>

                    <div className="space-y-2">
                        <p className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                            Hasil <span className="text-emerald-500">Ujian.</span>
                        </p>
                        <p className="max-w-md text-sm text-slate-400">
                            Rekapitulasi nilai peserta ujian.
                        </p>
                    </div>
                </header>

                <Card className="border-none bg-white shadow ring-1 ring-slate-200 rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                <Trophy className="text-emerald-600" size={24} />
                            </div>

                            <CardTitle className="text-xl font-black text-slate-900">
                                Ranking Peserta
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 px-8 pb-8">

                        <div className="overflow-x-auto rounded-lg border">

                            <table className="w-full min-w-[760px]">

                                <thead>
                                    <tr className="text-slate-900 bg-emerald-200">

                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.1em]">
                                            Rank
                                        </th>

                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.1em]">
                                            Peserta
                                        </th>

                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.1em]">
                                            Mata Ujian
                                        </th>

                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.1em]">
                                            Skor
                                        </th>

                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.1em]">
                                            Waktu Selesai
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {results.data.length > 0 ? (

                                        results.data.map((result, index) => {

                                            const rank = getRank(index);

                                            return (
                                                <tr
                                                    key={result.id}
                                                    className="group transition-all duration-300"
                                                >

                                                    {/* RANK */}
                                                    <td className="px-4 py-5 text-center bg-slate-50/50">

                                                        {rank === 1 ? (
                                                            <Trophy className="text-yellow-500 mx-auto" size={18} />
                                                        ) : rank === 2 ? (
                                                            <Trophy className="text-gray-400 mx-auto" size={18} />
                                                        ) : rank === 3 ? (
                                                            <Trophy className="text-amber-700 mx-auto" size={18} />
                                                        ) : (
                                                            <span className="font-bold text-slate-600">
                                                                {rank}
                                                            </span>
                                                        )}

                                                    </td>

                                                    {/* PESERTA */}
                                                    <td className="px-6 py-5 bg-slate-50/50">

                                                        <div className="flex items-center gap-3">

                                                            <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                                                <Users size={16} className="text-slate-400" />
                                                            </div>

                                                            <span className="font-extrabold text-slate-900">
                                                                {result.user?.name ?? '-'}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    {/* UJIAN */}
                                                    <td className="px-6 py-5 bg-slate-50/50">

                                                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm italic">
                                                            <GraduationCap size={16} className="text-emerald-500" />
                                                            {result.exam?.title ?? '-'}
                                                        </div>

                                                    </td>

                                                    {/* SCORE */}
                                                    <td className="px-6 py-5 bg-slate-50/50">

                                                        <div className="flex items-center gap-2">

                                                            <span
                                                                className={`text-xl font-black ${(result.score ?? 0) >= 70
                                                                    ? 'text-emerald-600'
                                                                    : 'text-rose-600'
                                                                    }`}
                                                            >
                                                                {result.score ?? 0}
                                                            </span>

                                                            <span className="text-[10px] font-bold text-slate-300 uppercase">
                                                                Poin
                                                            </span>

                                                        </div>

                                                    </td>

                                                    {/* FINISHED TIME */}
                                                    <td className="px-6 py-5 bg-slate-50/50">

                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                            <Calendar size={14} />
                                                            {formatDateTime(result.finished_at)}
                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        })

                                    ) : (

                                        <tr>

                                            <td colSpan={5} className="py-20 text-center">

                                                <div className="flex flex-col items-center gap-2">

                                                    <Users className="text-slate-200" size={24} />

                                                    <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                                                        Belum ada hasil
                                                    </p>

                                                </div>

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* PAGINATION */}

                        <div className="mt-12 flex justify-between items-center border-t border-slate-200 pt-10">

                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                Page {results.current_page} of {results.last_page}
                            </p>

                            <div className="flex gap-3">

                                <Button
                                    variant="outline"
                                    disabled={!hasPreviousPage}
                                    asChild={hasPreviousPage}
                                >
                                    {hasPreviousPage ? (

                                        <Link
                                            href={adminResultsIndex({ query: { page: results.current_page - 1 } })}
                                            preserveScroll
                                        >
                                            <ChevronLeft className="mr-2 h-4 w-4" />
                                            PREV
                                        </Link>

                                    ) : (
                                        <span>PREV</span>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    disabled={!hasNextPage}
                                    asChild={hasNextPage}
                                >
                                    {hasNextPage ? (

                                        <Link
                                            href={adminResultsIndex({ query: { page: results.current_page + 1 } })}
                                            preserveScroll
                                        >
                                            NEXT
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>

                                    ) : (
                                        <span>NEXT</span>
                                    )}

                                </Button>

                            </div>

                        </div>

                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
