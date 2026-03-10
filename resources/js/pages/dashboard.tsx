import { Head } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle2,
    Clock3,
    FileText,
    TrendingUp,
    Users,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type DashboardRole = 'admin' | 'peserta';

type AdminSummary = {
    totalPeserta: number;
    totalUjian: number;
    totalSoal: number;
    totalAttemptSelesai: number;
};

type PesertaSummary = {
    totalPenugasan: number;
    attemptSelesai: number;
    rataRataNilai: number;
    sisaAttempt: number;
};

type DistributionItem = {
    label: string;
    value: number;
};

type TrendItem = {
    label: string;
    attempts: number;
    avg_score: number;
};

type LatestResult = {
    exam_title: string;
    score: number;
    finished_at: string;
};

type Props = {
    role: DashboardRole;
    summary: AdminSummary | PesertaSummary;
    examDistribution?: DistributionItem[];
    dailyTrend: TrendItem[];
    latestResults?: LatestResult[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

function TrendLineChart({ points }: { points: TrendItem[] }) {
    const maxScore = Math.max(1, ...points.map((point) => point.avg_score));

    const coordinates = points
        .map((point, index) => {
            const x = (index / Math.max(1, points.length - 1)) * 100;
            const y = 100 - (point.avg_score / maxScore) * 100;

            return `${x},${y}`;
        })
        .join(' ');

    return (
        <div className="space-y-2">
            <div className="h-44 rounded-lg border bg-muted/30 p-3">
                <svg
                    viewBox="0 0 100 100"
                    className="size-full"
                    preserveAspectRatio="none"
                >
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        points={coordinates}
                        className="text-primary"
                    />
                </svg>
            </div>
            <div className="grid grid-cols-7 text-xs text-muted-foreground">
                {points.map((point) => (
                    <span key={point.label} className="text-center">
                        {point.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

function DistributionBars({ items }: { items: DistributionItem[] }) {
    const maxValue = Math.max(1, ...items.map((item) => item.value));

    return (
        <div className="space-y-3">
            {items.map((item) => {
                const width = (item.value / maxValue) * 100;

                return (
                    <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                            <span className="truncate pr-4">{item.label}</span>
                            <span className="font-medium">{item.value}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                            <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${width}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function Dashboard({
    role,
    summary,
    examDistribution = [],
    dailyTrend,
    latestResults = [],
}: Props) {
    const isAdmin = role === 'admin';

    const adminSummary = summary as AdminSummary;
    const pesertaSummary = summary as PesertaSummary;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isAdmin
                            ? 'Ringkasan performa platform ujian dan aktivitas peserta.'
                            : 'Ringkasan progres ujian dan performa nilai kamu.'}
                    </p>
                </div>

                {isAdmin ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm">
                                    Total Peserta
                                </CardTitle>
                                <Users className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold">
                                    {adminSummary.totalPeserta}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm">
                                    Total Ujian
                                </CardTitle>
                                <BookOpen className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold">
                                    {adminSummary.totalUjian}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm">
                                    Total Soal
                                </CardTitle>
                                <FileText className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold">
                                    {adminSummary.totalSoal}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm">
                                    Attempt Selesai
                                </CardTitle>
                                <CheckCircle2 className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold">
                                    {adminSummary.totalAttemptSelesai}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm">
                                    Penugasan Ujian
                                </CardTitle>
                                <BookOpen className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold">
                                    {pesertaSummary.totalPenugasan}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm">
                                    Attempt Selesai
                                </CardTitle>
                                <CheckCircle2 className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold">
                                    {pesertaSummary.attemptSelesai}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm">
                                    Rata-rata Nilai
                                </CardTitle>
                                <TrendingUp className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold">
                                    {pesertaSummary.rataRataNilai}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm">
                                    Sisa Attempt
                                </CardTitle>
                                <Clock3 className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold">
                                    {pesertaSummary.sisaAttempt}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tren Nilai 7 Hari</CardTitle>
                            <CardDescription>
                                Rata-rata nilai per hari.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TrendLineChart points={dailyTrend} />
                        </CardContent>
                    </Card>

                    {isAdmin ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Distribusi Attempt per Ujian
                                </CardTitle>
                                <CardDescription>
                                    Ujian dengan attempt terbanyak.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {examDistribution.length > 0 ? (
                                    <DistributionBars
                                        items={examDistribution}
                                    />
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada data attempt.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Hasil Terbaru</CardTitle>
                                <CardDescription>
                                    5 hasil ujian terakhir kamu.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {latestResults.length > 0 ? (
                                    <div className="space-y-3">
                                        {latestResults.map((result) => (
                                            <div
                                                key={`${result.exam_title}-${result.finished_at}`}
                                                className="rounded-lg border p-3"
                                            >
                                                <p className="text-sm font-medium">
                                                    {result.exam_title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Nilai: {result.score} •{' '}
                                                    {result.finished_at}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada hasil ujian.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Aktivitas Harian</CardTitle>
                        <CardDescription>
                            Jumlah attempt selesai per hari.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
                            {dailyTrend.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-lg border bg-muted/20 p-3"
                                >
                                    <p className="text-xs text-muted-foreground">
                                        {item.label}
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {item.attempts}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Attempt
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
