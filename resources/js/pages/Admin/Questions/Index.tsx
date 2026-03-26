import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, type FormEvent } from 'react';
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
import {
    create as questionsCreate,
    index as questionsIndex,
    destroy as questionsDestroy,
    edit as questionsEdit,
    importMethod as questionsImport,
} from '@/routes/questions';
import type { BreadcrumbItem } from '@/types';
import {
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Database,
    FileSpreadsheet,
    PenIcon,
    Plus,
    Trash,
    UploadCloud,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

type QuestionItem = {
    id: number;
    question_text: string;
    score: number;
    exam: {
        id: number;
        title: string;
    } | null;
};

type QuestionPagination = {
    data: QuestionItem[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

interface Props {
    questions: QuestionPagination;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bank Soal',
        href: questionsIndex(),
    },
];

export default function QuestionIndex({ questions }: Props) {
    const { flash } = usePage<{ flash?: { success?: string } }>().props;

    const importForm = useForm<{ import_file: File | null }>({
        import_file: null,
    });

    const hasPreviousPage = questions.current_page > 1;
    const hasNextPage = questions.current_page < questions.last_page;

    useEffect(() => {
        if (flash?.success) {
            toast.success('Data Ter-import', {
                description: flash.success,
                icon: <CheckCircle2 className="text-emerald-500" />,
            });
        }
    }, [flash]);

    const submitImport = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        importForm.post(questionsImport().url, {
            onStart: () =>
                toast.loading('Memproses file CSV...', { id: 'import' }),
            onSuccess: () => {
                toast.success('Berhasil!', { id: 'import' });
                importForm.reset();
            },
            onError: () =>
                toast.error('Gagal mengimport file.', { id: 'import' }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Soal - Admin" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12 lg:p-16">
                {/* Header Section */}
                <header className="relative mb-12 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 items-center justify-center rounded-full bg-emerald-100 px-4 text-[10px] font-bold tracking-[0.2em] text-emerald-700 uppercase">
                            Knowledge Base
                        </div>
                        <span className="h-[1px] flex-1 bg-slate-200"></span>
                    </div>

                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                Bank{' '}
                                <span className="text-emerald-500">Soal.</span>
                            </h1>
                            <p className="max-w-md text-sm font-normal text-slate-400">
                                Total{' '}
                                <span className="font-bold text-slate-900">
                                    {questions.total}
                                </span>{' '}
                                pertanyaan terdaftar dalam sistem repositori.
                            </p>
                        </div>

                        <Button
                            asChild
                            className="flex items-center gap-3 rounded-[1.5rem] bg-slate-900 px-8 text-xs font-black tracking-[0.2em] text-white uppercase shadow-xl shadow-slate-200 transition-all duration-500 hover:bg-emerald-600"
                        >
                            <Link href={questionsCreate()} prefetch>
                                <Plus size={18} /> Tambah Soal
                            </Link>
                        </Button>
                    </div>
                </header>

                <div className="grid gap-8">
                    {/* Import Panel - Hyper Utility Style */}
                    <Card className="group overflow-hidden rounded-[2.5rem] border-none bg-emerald-50/50 ring-1 ring-slate-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50">
                        <CardContent className="p-8">
                            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center">
                                <div className="flex items-center gap-5 lg:w-1/3">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-sm transition-transform group-hover:scale-110">
                                        <FileSpreadsheet size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black tracking-widest text-slate-900 uppercase">
                                            Import CSV
                                        </h3>
                                        <p className="mt-1 text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
                                            Format: exam_title, question,
                                            score...
                                        </p>
                                    </div>
                                </div>

                                <form
                                    onSubmit={submitImport}
                                    className="flex w-full flex-1 flex-col gap-4 sm:flex-row"
                                >
                                    <div className="group/input relative flex-1">
                                        <input
                                            type="file"
                                            accept=".csv,text/csv"
                                            onChange={(e) =>
                                                importForm.setData(
                                                    'import_file',
                                                    e.target.files?.[0] ?? null,
                                                )
                                            }
                                            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                                            required
                                        />
                                        <div className="flex h-9 items-center gap-3 rounded-2xl bg-white px-6 text-sm font-bold text-slate-400 ring-1 ring-slate-200 transition-all group-hover/input:ring-emerald-400">
                                            <UploadCloud
                                                size={18}
                                                className="text-slate-300"
                                            />
                                            <span className="truncate">
                                                {importForm.data.import_file
                                                    ? importForm.data
                                                        .import_file.name
                                                    : 'Pilih file CSV...'}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={importForm.processing}
                                        className="rounded-2xl bg-emerald-500 px-8 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 disabled:opacity-50"
                                    >
                                        Execute Import
                                    </Button>
                                </form>
                            </div>

                            {importForm.errors.import_file && (
                                <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-rose-500">
                                    <AlertCircle size={14} />
                                    <span className="text-[10px] font-bold uppercase">
                                        {importForm.errors.import_file}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Table Section */}
                    <Card className="overflow-hidden rounded-[3rem] border-none bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] ring-1 ring-slate-100">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 p-10 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                                    <Database size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black text-slate-900">
                                        Data Bank Soal
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-[10px] leading-none font-bold tracking-widest text-slate-400 uppercase">
                                        Showing {questions.from} —{' '}
                                        {questions.to}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-emerald-200 text-slate-900">
                                            <th className="px-10 py-5 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                                Index
                                            </th>
                                            <th className="px-6 py-5 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                                Module Context
                                            </th>
                                            <th className="px-6 py-5 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                                Question Brief
                                            </th>
                                            <th className="px-10 py-5 text-right text-[10px] font-black tracking-[0.2em] uppercase">
                                                Score Weight
                                            </th>
                                            <th className="px-6 py-5 text-right text-[10px] font-black tracking-[0.2em] uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {questions.data.length > 0 ? (
                                            questions.data.map(
                                                (question, index) => (
                                                    <tr
                                                        key={question.id}
                                                        className="group transition-all duration-300"
                                                    >
                                                        <td className="bg-slate-50/50 px-10 py-6 text-sm font-black text-slate-300 tabular-nums transition-colors group-hover:bg-slate-100">
                                                            {String(
                                                                (questions.from ??
                                                                    1) + index,
                                                            ).padStart(2, '0')}
                                                        </td>
                                                        <td className="bg-slate-50/50 px-6 py-6 transition-colors group-hover:bg-slate-100">
                                                            <div className="flex flex-col">
                                                                <span className="max-w-[150px] truncate text-sm font-bold text-slate-900">
                                                                    {question
                                                                        .exam
                                                                        ?.title ??
                                                                        'Unassigned'}
                                                                </span>
                                                                <span className="text-[9px] font-bold tracking-tighter text-emerald-500 uppercase">
                                                                    Exam Module
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="max-w-md bg-slate-50/50 px-6 py-6 transition-colors group-hover:bg-slate-100">
                                                            <p className="line-clamp-2 text-sm leading-relaxed font-medium text-slate-600">
                                                                {
                                                                    question.question_text
                                                                }
                                                            </p>
                                                        </td>
                                                        <td className="bg-slate-50/50 px-10 py-6 text-right transition-colors group-hover:bg-slate-100">
                                                            <Badge className="rounded-lg border-slate-200 bg-white px-3 py-1 text-[10px] font-black text-slate-900 shadow-sm">
                                                                +
                                                                {question.score}
                                                            </Badge>
                                                        </td>
                                                        <td className="bg-slate-50/50 px-6 py-6 text-right transition-colors group-hover:bg-slate-100">
                                                            <div className="flex justify-end gap-2">
                                                                {/* EDIT */}
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="rounded-lg"
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={questionsEdit(
                                                                            question.id,
                                                                        )}
                                                                    >
                                                                        <PenIcon
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </Link>
                                                                </Button>

                                                                {/* DELETE */}
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            size="sm"
                                                                            variant="destructive"
                                                                            className="rounded-lg"
                                                                        >
                                                                            <Trash
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        </Button>
                                                                    </AlertDialogTrigger>

                                                                    <AlertDialogContent className="rounded-2xl">
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle className="text-lg font-black">
                                                                                Hapus
                                                                                Soal?
                                                                            </AlertDialogTitle>

                                                                            <AlertDialogDescription className="text-sm">
                                                                                Soal
                                                                                yang
                                                                                dihapus
                                                                                tidak
                                                                                dapat
                                                                                dikembalikan.
                                                                                Semua
                                                                                opsi
                                                                                jawaban
                                                                                juga
                                                                                akan
                                                                                ikut
                                                                                dihapus.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>

                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel className="rounded-xl">
                                                                                Batal
                                                                            </AlertDialogCancel>

                                                                            <AlertDialogAction
                                                                                onClick={() =>
                                                                                    router.delete(
                                                                                        questionsDestroy(
                                                                                            question.id,
                                                                                        )
                                                                                            .url,
                                                                                    )
                                                                                }
                                                                                className="rounded-xl bg-red-600 hover:bg-red-700"
                                                                            >
                                                                                Ya,
                                                                                Hapus
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-10 py-20 text-center"
                                                >
                                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                                        <Database size={48} />
                                                        <span className="text-sm font-black tracking-widest uppercase">
                                                            No Questions Found
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination - Standardized */}
                            <div className="mt-12 p-10 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-10 sm:flex-row">
                                <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                    Showing page{' '}
                                    <span className="text-slate-900">
                                        {questions.current_page}
                                    </span>{' '}
                                    of{' '}
                                    <span className="text-slate-900">
                                        {questions.last_page}
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
                                                href={questionsIndex({
                                                    query: {
                                                        page:
                                                            questions.current_page -
                                                            1,
                                                    },
                                                })}
                                                preserveScroll
                                                className="flex items-center gap-2"
                                            >
                                                <ChevronLeft size={14} /> Prev
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-2 opacity-20">
                                                <ChevronLeft size={14} /> Prev
                                            </span>
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
                                                href={questionsIndex({
                                                    query: {
                                                        page:
                                                            questions.current_page +
                                                            1,
                                                    },
                                                })}
                                                preserveScroll
                                                className="flex items-center gap-2"
                                            >
                                                Next <ChevronRight size={14} />
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-2 opacity-20">
                                                Next <ChevronRight size={14} />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Secure Footer Signature */}
                <footer className="mt-20 flex items-center justify-between border-t border-slate-200 pt-8">
                    <p className="text-[9px] font-black tracking-[0.4em] text-slate-700 uppercase">
                        diskominfo kabupaten muara enim
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold tracking-tighter text-slate-700 uppercase italic">
                            Ahda dev | v.1.0
                        </span>
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></div>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}
