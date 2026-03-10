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
        {
            title: 'Ujian',
            href: examsIndex(),
        },
        {
            title: 'Hasil Ujian',
            href: examsIndex(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hasil Ujian" />

            <div className="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Hasil Ujian</CardTitle>
                        <CardDescription>
                            {examTitle ?? 'Ujian'} telah selesai dikerjakan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Nilai
                                </p>
                                <p className="text-3xl font-semibold">
                                    {score ?? 0}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Total Soal Dijawab
                                </p>
                                <p className="text-3xl font-semibold">
                                    {total}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Benar
                                </p>
                                <p className="text-2xl font-semibold text-green-600">
                                    {correct}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Salah
                                </p>
                                <p className="text-2xl font-semibold text-red-600">
                                    {wrong}
                                </p>
                            </div>
                        </div>

                        <Button asChild>
                            <Link href={examsIndex()}>
                                Kembali ke Daftar Ujian
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
