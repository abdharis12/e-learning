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
import { Trophy } from 'lucide-react';

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
                        <div className="flex h-8 items-center justify-center rounded-full bg-emerald-100 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            Management Analytics
                        </div>
                        <span className="h-[1px] flex-1 bg-slate-200"></span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="space-y-2">
                            <p className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                Hasil <span className="text-emerald-500">Ujian Saya.</span>
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
                                    Daftar Hasil Ujian
                                </CardTitle>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="w-full min-w-[640px]">
                                <thead>
                                    <tr className="text-slate-900 bg-emerald-200">
                                        <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.1em]">No</th>
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
                                                className="border-b hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-3 text-sm">
                                                    {(results.from ?? 1) +
                                                        index}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {result.exam?.title ?? '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`text-xl font-black ${(result.score ?? 0) >= 70 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {result.score ?? 0}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase"> Poin</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
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
                                                className="px-4 py-8 text-center text-sm text-muted-foreground"
                                            >
                                                Belum ada hasil ujian.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <Button
                                variant="outline"
                                disabled={!hasPreviousPage}
                                asChild={hasPreviousPage}
                            >
                                {hasPreviousPage ? (
                                    <Link
                                        href={participantResultsIndex({
                                            query: {
                                                page: results.current_page - 1,
                                            },
                                        })}
                                        preserveScroll
                                    >
                                        Sebelumnya
                                    </Link>
                                ) : (
                                    <span>Sebelumnya</span>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                disabled={!hasNextPage}
                                asChild={hasNextPage}
                            >
                                {hasNextPage ? (
                                    <Link
                                        href={participantResultsIndex({
                                            query: {
                                                page: results.current_page + 1,
                                            },
                                        })}
                                        preserveScroll
                                    >
                                        Berikutnya
                                    </Link>
                                ) : (
                                    <span>Berikutnya</span>
                                )}
                            </Button>
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
