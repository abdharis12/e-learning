import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
    importMethod as questionsImport,
} from '@/routes/questions';
import type { BreadcrumbItem } from '@/types';
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Database, FileSpreadsheet, Plus, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

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
                icon: <CheckCircle2 className="text-emerald-500" />
            });
        }
    }, [flash]);

    const submitImport = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        importForm.post(questionsImport().url, {
            onStart: () => toast.loading('Memproses file CSV...', { id: 'import' }),
            onSuccess: () => {
                toast.success('Berhasil!', { id: 'import' });
                importForm.reset();
            },
            onError: () => toast.error('Gagal mengimport file.', { id: 'import' })
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Soal - Admin" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12 lg:p-16">

                {/* Header Section */}
                <header className="relative mb-12 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 items-center justify-center rounded-full bg-emerald-100 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                            Knowledge Base
                        </div>
                        <span className="h-[1px] flex-1 bg-slate-200"></span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                Bank <span className="text-emerald-500">Soal.</span>
                            </h1>
                            <p className="max-w-md text-sm text-slate-400 font-normal">
                                Total <span className="text-slate-900 font-bold">{questions.total}</span> pertanyaan terdaftar dalam sistem repositori.
                            </p>
                        </div>

                        <Button asChild className="px-8 rounded-[1.5rem] bg-slate-900 text-white hover:bg-emerald-600 shadow-xl shadow-slate-200 font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3">
                            <Link href={questionsCreate()} prefetch>
                                <Plus size={18} /> Tambah Soal
                            </Link>
                        </Button>
                    </div>
                </header>

                <div className="grid gap-8">

                    {/* Import Panel - Hyper Utility Style */}
                    <Card className="border-none bg-emerald-50/50 ring-1 ring-slate-100 rounded-[2.5rem] overflow-hidden group transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50">
                        <CardContent className="p-8">
                            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                                <div className="flex items-center gap-5 lg:w-1/3">
                                    <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                        <FileSpreadsheet size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Import CSV</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Format: exam_title, question, score...</p>
                                    </div>
                                </div>

                                <form onSubmit={submitImport} className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
                                    <div className="relative flex-1 group/input">
                                        <input
                                            type="file"
                                            accept=".csv,text/csv"
                                            onChange={(e) => importForm.setData('import_file', e.target.files?.[0] ?? null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            required
                                        />
                                        <div className="h-9 px-6 rounded-2xl bg-white ring-1 ring-slate-200 flex items-center gap-3 text-sm font-bold text-slate-400 group-hover/input:ring-emerald-400 transition-all">
                                            <UploadCloud size={18} className="text-slate-300" />
                                            <span className="truncate">{importForm.data.import_file ? importForm.data.import_file.name : 'Pilih file CSV...'}</span>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={importForm.processing}
                                        className="px-8 rounded-2xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                    >
                                        Execute Import
                                    </Button>
                                </form>
                            </div>

                            {importForm.errors.import_file && (
                                <div className="mt-4 flex items-center gap-2 text-rose-500 px-4 py-2 bg-rose-50 rounded-xl">
                                    <AlertCircle size={14} />
                                    <span className="text-[10px] font-bold uppercase">{importForm.errors.import_file}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Table Section */}
                    <Card className="border-none bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] ring-1 ring-slate-100 rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-10 pb-6 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                                    <Database size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black text-slate-900">Data Repertoire</CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                                        Showing {questions.from} — {questions.to}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Index</th>
                                            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Module Context</th>
                                            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Question Brief</th>
                                            <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Score Weight</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {questions.data.length > 0 ? (
                                            questions.data.map((question, index) => (
                                                <tr key={question.id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-10 py-6 text-sm font-black text-slate-300 tabular-nums">
                                                        {String((questions.from ?? 1) + index).padStart(2, '0')}
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-900 truncate max-w-[150px]">
                                                                {question.exam?.title ?? 'Unassigned'}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Exam Module</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 max-w-md">
                                                        <p className="text-sm font-medium text-slate-600 line-clamp-2 leading-relaxed">
                                                            {question.question_text}
                                                        </p>
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                        <Badge className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-lg px-3 py-1 font-black text-[10px]">
                                                            +{question.score}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-10 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                                        <Database size={48} />
                                                        <span className="text-sm font-black uppercase tracking-widest">No Questions Found</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination - Hyper Styled */}
                            <div className="p-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                        Page <span className="text-slate-900">{questions.current_page}</span> of {questions.last_page}
                                    </span>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        disabled={!hasPreviousPage}
                                        asChild={hasPreviousPage}
                                        className="h-12 px-6 rounded-xl border-slate-100 font-bold text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        {hasPreviousPage ? (
                                            <Link href={questionsIndex({ query: { page: questions.current_page - 1 } })} preserveScroll className="flex items-center gap-2">
                                                <ChevronLeft size={14} /> Previous
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-2 opacity-30"><ChevronLeft size={14} /> Previous</span>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        disabled={!hasNextPage}
                                        asChild={hasNextPage}
                                        className="h-12 px-6 rounded-xl border-slate-100 font-bold text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        {hasNextPage ? (
                                            <Link href={questionsIndex({ query: { page: questions.current_page + 1 } })} preserveScroll className="flex items-center gap-2">
                                                Next <ChevronRight size={14} />
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-2 opacity-30">Next <ChevronRight size={14} /></span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Secure Footer Signature */}
                <footer className="mt-20 flex items-center justify-between border-t border-slate-200 pt-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">diskominfo kabupaten muara enim</p>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold text-slate-700 uppercase tracking-tighter italic">Ahda dev | v.1.0</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}
