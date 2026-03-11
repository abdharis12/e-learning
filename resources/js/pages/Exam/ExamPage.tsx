import { Head, router } from '@inertiajs/react';
import React, { useEffect, useMemo, useState } from 'react';
import Timer from '@/components/timer';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { answersStore, examsIndex, examsSubmit } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import {
    Clock,
    Send,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    HelpCircle,
    BadgeCheck
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

type ExamOption = {
    id: number;
    option_text: string;
};

type ExamQuestion = {
    id: number;
    question_text: string;
    options: ExamOption[];
};

type ExamData = {
    id: number;
    title: string;
    duration_minutes: number;
    questions: ExamQuestion[];
};

interface Props {
    exam: ExamData;
    attemptId: number;
    answers: Record<string, number>;
    startedAt: string;
}

export default function ExamPage({ exam, attemptId, answers, startedAt }: Props) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] =
        useState<Record<string, number>>(answers);

    const questions = exam.questions;
    const currentQuestion = questions[currentQuestionIndex];

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: 'Ujian', href: examsIndex() },
            { title: exam.title, href: examsIndex() },
        ],
        [exam.title],
    );

    // Lock the exam in localStorage when the component mounts
    React.useEffect(() => {

        const key = `exam-lock-${attemptId}`

        if (localStorage.getItem(key)) {

            alert("Ujian sudah terbuka di tab lain.")

            router.visit(examsIndex().url)

            return
        }

        localStorage.setItem(key, "active")

        const handleUnload = () => {
            localStorage.removeItem(key)
        }

        window.addEventListener("beforeunload", handleUnload)

        return () => {
            localStorage.removeItem(key)
            window.removeEventListener("beforeunload", handleUnload)
        }

    }, [attemptId])

    // Listen for storage events to detect if the exam is opened in another tab
    useEffect(() => {

        const key = `exam-lock-${attemptId}`

        const handleStorage = (event: StorageEvent) => {

            if (event.key === key) {

                alert("Ujian dibuka di tab lain.")

                router.visit(examsIndex().url)
            }
        }

        window.addEventListener("storage", handleStorage)

        return () => window.removeEventListener("storage", handleStorage)

    }, [attemptId])

    // Prevent back navigation during the exam
    useEffect(() => {

        history.pushState(null, "", location.href)

        window.onpopstate = () => {
            history.go(1)
        }

    }, [])

    // Prevent the user from leaving the page accidentally
    useEffect(() => {

        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ""
        }

        window.addEventListener("beforeunload", handler)

        return () => window.removeEventListener("beforeunload", handler)

    }, [])

    // Calculate the exam deadline based on the startedAt time and exam duration
    const deadline = useMemo(() => {

        const start = new Date(startedAt).getTime()

        return start + exam.duration_minutes * 60 * 1000

    }, [startedAt, exam.duration_minutes])

    // Handle answer selection and synchronization with the server
    const answerQuestion = (optionId: number): void => {
        const questionKey = String(currentQuestion.id);
        setSelectedAnswers((previous) => ({
            ...previous,
            [questionKey]: optionId,
        }));

        router.post(
            answersStore().url,
            { attempt_id: attemptId, question_id: currentQuestion.id, option_id: optionId },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Progress disimpan', {
                        description: 'Jawaban berhasil di-sinkronisasi.',
                        duration: 1500,
                    });
                }
            }
        );
    };

    const submitExam = (): void => {
        router.post(examsSubmit(attemptId).url, {}, {
            onStart: () => {
                toast.loading('Mengirim hasil ujian...', { id: 'submit-exam' });
            },
            onSuccess: () => {
                toast.success('Ujian Selesai', {
                    id: 'submit-exam',
                    description: 'Seluruh jawaban telah berhasil direkapitulasi.'
                });
            },
            onError: () => {
                toast.error('Gagal mengumpulkan', { id: 'submit-exam' });
            }
        });
    };

    if (questions.length < 1) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={exam.title} />
                <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center p-6 text-center">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] p-16 ring-1 ring-slate-100">
                        <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-6">
                            <HelpCircle className="text-slate-200" size={40} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Kosong</h2>
                        <p className="text-slate-400 mt-2 font-medium">Modul ujian ini belum memiliki daftar pertanyaan.</p>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={exam.title} />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12">

                {/* Status Bar */}
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Active Session</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">{exam.title}</h1>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-100 pr-6 group hover:bg-white hover:shadow-xl transition-all duration-500">
                        <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <Clock size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Time Remaining</span>
                            <div className="font-black text-xl text-slate-900 tabular-nums leading-none">
                                <Timer deadline={deadline} attemptId={attemptId} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

                    {/* Question Content */}
                    <div className="space-y-6">
                        <Card className="border-none bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] ring-1 ring-slate-100 rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em]">Pertanyaan {currentQuestionIndex + 1}</CardTitle>
                                    <CardDescription className="font-bold text-slate-400 uppercase text-[10px]">Pilih jawaban paling presisi</CardDescription>
                                </div>
                                <div className="h-12 w-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs">
                                    {currentQuestionIndex + 1} / {questions.length}
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <p className="text-2xl font-extrabold text-slate-900 leading-relaxed tracking-tight">
                                    {currentQuestion.question_text}
                                </p>

                                <div className="space-y-4">
                                    {currentQuestion.options.map((option) => {
                                        const isSelected = selectedAnswers[String(currentQuestion.id)] === option.id;
                                        return (
                                            <Button
                                                key={option.id}
                                                variant="outline"
                                                className={`group relative h-auto w-full justify-start p-6 rounded-[1.5rem] border-none transition-all duration-300 ring-1 ${isSelected
                                                    ? 'ring-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-lg shadow-emerald-500/5'
                                                    : 'ring-slate-100 bg-white hover:ring-slate-300 hover:bg-slate-50 text-slate-700'
                                                    }`}
                                                onClick={() => answerQuestion(option.id)}
                                            >
                                                <div className="flex items-center gap-5 w-full">
                                                    <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isSelected ? 'border-emerald-500 bg-emerald-500 scale-110 shadow-lg shadow-emerald-500/40' : 'border-slate-200 bg-white group-hover:border-slate-300'}`}>
                                                        {isSelected && <BadgeCheck size={16} className="text-white" />}
                                                    </div>
                                                    <span className="flex-1 font-bold text-base leading-snug">{option.option_text}</span>
                                                </div>
                                            </Button>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-between gap-4 pt-6">
                                    <Button
                                        variant="ghost"
                                        disabled={currentQuestionIndex === 0}
                                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                                        className="px-8 rounded-2xl border-slate-100 font-black text-[11px] uppercase tracking-widest text-slate-900 hover:bg-slate-50 disabled:opacity-20 shadow-sm"
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Prev
                                    </Button>

                                    <Button
                                        variant="outline"
                                        disabled={currentQuestionIndex === questions.length - 1}
                                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                        className="px-8 rounded-2xl border-slate-100 font-black text-[11px] uppercase tracking-widest text-slate-900 hover:bg-slate-50 disabled:opacity-20 shadow-sm"
                                    >
                                        Next <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Controls */}
                    <div className="space-y-6">
                        <Card className="border-none bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden relative group min-h-[500px] flex flex-col">
                            <CardHeader className="p-8 pb-4 relative z-10 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <LayoutGrid size={18} className="text-emerald-400" />
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Navigation Map</CardTitle>
                                </div>
                                <div className="flex items-end justify-between">
                                    <span className="text-4xl font-black tracking-tighter tabular-nums">
                                        {Object.keys(selectedAnswers).length} / {questions.length}
                                    </span>
                                    <span className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mb-1">Answered</span>
                                </div>
                            </CardHeader>

                            <CardContent className="p-8 pt-4 space-y-8 relative z-10 flex-1 flex flex-col justify-between">
                                <div className="grid grid-cols-4 gap-3">
                                    {questions.map((question, index) => {
                                        const isCurrent = index === currentQuestionIndex;
                                        const isAnswered = Boolean(selectedAnswers[String(question.id)]);
                                        return (
                                            <button
                                                key={question.id}
                                                onClick={() => setCurrentQuestionIndex(index)}
                                                className={`h-12 w-full rounded-xl font-black text-xs transition-all duration-500 border-none ${isCurrent
                                                    ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-110 z-20'
                                                    : isAnswered
                                                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                                        : 'bg-white/5 text-white/20 hover:bg-white/10'
                                                    }`}
                                            >
                                                {index + 1}
                                            </button>
                                        );
                                    })}
                                </div>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/20 transition-all border-none group relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                Selesai Ujian
                                            </span>
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent className="rounded-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-lg font-black">
                                                Selesaikan Ujian?
                                            </AlertDialogTitle>

                                            <AlertDialogDescription className="text-sm leading-relaxed">
                                                Setelah ujian dikumpulkan:
                                                <br />
                                                • Anda tidak dapat mengubah jawaban
                                                <br />
                                                • Semua jawaban akan langsung direkap
                                                <br />
                                                • Waktu ujian akan dihentikan
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-xl">
                                                Batal
                                            </AlertDialogCancel>

                                            <AlertDialogAction
                                                onClick={submitExam}
                                                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                                            >
                                                Ya, Selesaikan
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>

                            {/* Decorative Text */}
                            <div className="absolute -bottom-8 -right-8 text-white/5 font-black text-8xl select-none group-hover:rotate-6 transition-transform duration-1000">
                                AHDA
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Footer Signature */}
                <footer className="mt-20 flex items-center justify-between border-t border-slate-200 pt-8 opacity-50">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">Diskominfo kabupaten muara enim</p>
                    <div className="flex h-2 items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-700 uppercase">Ahda Dev | v.1.0</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}
