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
import { examsIndex, participantResultsIndex } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

type ResultItem = {
    id: number;
    score: number | null;
    finished_at: string | null;
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
        title: 'Ujian',
        href: examsIndex(),
    },
    {
        title: 'Hasil Ujian',
        href: participantResultsIndex(),
    },
];

const formatDateTime = (value: string | null): string => {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

export default function MyResults({ results }: Props) {
    const hasPreviousPage = results.current_page > 1;
    const hasNextPage = results.current_page < results.last_page;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hasil Ujian Saya" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12 lg:p-16">
                {/* Modern Admin Header */}
                <header className="relative mb-12 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 items-center justify-center rounded-full bg-emerald-100 px-4 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                            Management Analytics
                        </div>
                        <span className="h-[1px] flex-1 bg-slate-200"></span>
                    </div>

                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-2">
                            <p className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                Hasil{' '}
                                <span className="text-emerald-500">
                                    Ujian Saya.
                                </span>
                            </p>
                            <p className="font-base max-w-md text-sm text-slate-400">
                                Rekapitulasi nilai real-time peserta seleksi
                                tenaga ahli.
                            </p>
                        </div>
                    </div>
                </header>
                <Card className="overflow-hidden rounded-[2.5rem] border-none bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                                    <Trophy
                                        className="text-emerald-600"
                                        size={24}
                                    />
                                </div>
                                <CardTitle className="text-xl leading-none font-black text-slate-900">
                                    Daftar Hasil Ujian
                                </CardTitle>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="w-full min-w-[640px]">
                                <thead>
                                    <tr className="bg-emerald-200 text-slate-900">
                                        <th className="px-4 py-4 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                            No
                                        </th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                            Mata Ujian
                                        </th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                            Perolehan Skor
                                        </th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                            Waktu Selesai
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.data.length > 0 ? (
                                        results.data.map((result, index) => (
                                            <tr
                                                key={result.id}
                                                className="group transition-all duration-300"
                                            >
                                                <td className="w-12 bg-slate-50/50 px-4 py-5 text-center text-sm font-bold text-slate-300 italic transition-colors group-hover:bg-slate-100 group-hover:text-slate-900">
                                                    {(results.from ?? 1) +
                                                        index}
                                                </td>
                                                <td className="bg-slate-50/50 px-6 py-5 transition-colors group-hover:bg-slate-100">
                                                    <span className="text-base font-extrabold tracking-tight text-slate-900">
                                                        {result.exam?.title ??
                                                            '-'}
                                                    </span>
                                                </td>
                                                <td className="bg-slate-50/50 px-6 py-5 transition-colors group-hover:bg-slate-100">
                                                    <span
                                                        className={`text-xl font-black ${(result.score ?? 0) >= 70 ? 'text-emerald-600' : 'text-rose-600'}`}
                                                    >
                                                        {result.score ?? 0}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase">
                                                        {' '}
                                                        Poin
                                                    </span>
                                                </td>
                                                <td className="bg-slate-50/50 px-6 py-5 transition-colors group-hover:bg-slate-100">
                                                    {formatDateTime(
                                                        result.finished_at,
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="py-24 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-50">
                                                        <Trophy
                                                            className="text-slate-200"
                                                            size={32}
                                                        />
                                                    </div>
                                                    <p className="text-[11px] font-black tracking-[0.3em] text-slate-300 uppercase">
                                                        Belum ada hasil ujian
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-10 sm:flex-row">
                            <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                Showing page{' '}
                                <span className="text-slate-900">
                                    {results.current_page}
                                </span>{' '}
                                of{' '}
                                <span className="text-slate-900">
                                    {results.last_page}
                                </span>
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    disabled={!hasPreviousPage}
                                    asChild={hasPreviousPage}
                                    className="h-14 rounded-2xl border-slate-100 px-6 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-slate-50"
                                >
                                    {hasPreviousPage ? (
                                        <Link
                                            href={participantResultsIndex({
                                                query: {
                                                    page:
                                                        results.current_page -
                                                        1,
                                                },
                                            })}
                                            preserveScroll
                                        >
                                            <ChevronLeft className="mr-2 h-4 w-4" />{' '}
                                            Prev
                                        </Link>
                                    ) : (
                                        <span className="opacity-20">Prev</span>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    disabled={!hasNextPage}
                                    asChild={hasNextPage}
                                    className="h-14 rounded-2xl border-slate-100 px-6 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-slate-50"
                                >
                                    {hasNextPage ? (
                                        <Link
                                            href={participantResultsIndex({
                                                query: {
                                                    page:
                                                        results.current_page +
                                                        1,
                                                },
                                            })}
                                            preserveScroll
                                        >
                                            Next{' '}
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <span className="opacity-20">Next</span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Secure Info Footer */}
                <footer className="mt-24 flex items-center justify-between border-t border-slate-200 pt-8">
                    <p className="text-[10px] font-black tracking-[0.4em] text-slate-700 uppercase">
                        Diskominfo Kabupaten Muara Enim
                    </p>
                    <div className="flex h-2 items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-700 uppercase">
                            AHDA Dev | V.1.0
                        </span>
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}
