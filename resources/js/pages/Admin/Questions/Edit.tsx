import { Head, Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { adminExamsCreate } from "@/routes";
import {
    index as questionsIndex,
    update as questionsUpdate,
} from "@/routes/questions";
import type { BreadcrumbItem } from "@/types";

type OptionInput = {
    text: string;
    correct: boolean;
};

interface Question {
    id: number;
    exam_id: number;
    question_text: string;
    score: number;
    options: {
        id: number;
        option_text: string;
        is_correct: boolean;
    }[];
}

interface Props {
    exams: Record<string, string>;
    question: Question;
}

export default function QuestionEdit({ exams, question }: Props) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Bank Soal", href: questionsIndex() },
        { title: "Edit Soal", href: "#" },
    ];

    const form = useForm<{
        exam_id: string;
        question_text: string;
        score: number;
        options: OptionInput[];
    }>({
        exam_id: String(question.exam_id),
        question_text: question.question_text,
        score: question.score,
        options: question.options.map((opt) => ({
            text: opt.option_text,
            correct: opt.is_correct,
        })),
    });

    const examOptions = Object.entries(exams);
    const hasExamOptions = examOptions.length > 0;

    const addOption = () => {
        form.setData("options", [
            ...form.data.options,
            { text: "", correct: false },
        ]);
    };

    const removeOption = (index: number) => {

        if (form.data.options.length <= 2) return;

        const nextOptions = form.data.options.filter(
            (_, i) => i !== index
        );

        if (!nextOptions.some((opt) => opt.correct)) {
            nextOptions[0].correct = true;
        }

        form.setData("options", nextOptions);
    };

    const updateOptionText = (index: number, text: string) => {

        const next = [...form.data.options];

        next[index] = {
            ...next[index],
            text,
        };

        form.setData("options", next);
    };

    const setCorrectOption = (index: number) => {

        const next = form.data.options.map((opt, i) => ({
            ...opt,
            correct: i === index,
        }));

        form.setData("options", next);
    };

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.put(questionsUpdate(question.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Soal" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Edit Soal
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Perbarui pertanyaan dan opsi jawaban.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Soal</CardTitle>
                        <CardDescription>
                            Ubah pertanyaan dan tentukan jawaban benar.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">

                            {/* Exam */}
                            <div className="grid gap-2">

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="exam_id">Ujian</Label>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link href={adminExamsCreate()}>
                                            Buat Ujian
                                        </Link>
                                    </Button>

                                </div>

                                <select
                                    id="exam_id"
                                    value={form.data.exam_id}
                                    onChange={(e) =>
                                        form.setData("exam_id", e.target.value)
                                    }
                                    className="flex h-9 w-full rounded-md border px-3 py-2 text-sm"
                                    required
                                >

                                    <option value="">Pilih ujian</option>

                                    {examOptions.map(([id, title]) => (
                                        <option key={id} value={id}>
                                            {title}
                                        </option>
                                    ))}

                                </select>

                                <InputError message={form.errors.exam_id} />

                            </div>

                            {/* Question */}
                            <div className="grid gap-2">

                                <Label htmlFor="question_text">
                                    Pertanyaan
                                </Label>

                                <Input
                                    id="question_text"
                                    value={form.data.question_text}
                                    onChange={(e) =>
                                        form.setData(
                                            "question_text",
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                                <InputError message={form.errors.question_text} />
                            </div>

                            {/* Score */}
                            <div className="grid gap-2">
                                <Label htmlFor="score">Bobot Nilai</Label>

                                <Input
                                    id="score"
                                    type="number"
                                    min="1"
                                    value={form.data.score}
                                    onChange={(e) =>
                                        form.setData('score', Number(e.target.value))
                                    }
                                    required
                                />

                                <InputError message={form.errors.score} />
                            </div>

                            {/* Options */}
                            <div className="space-y-3">

                                <div className="flex items-center justify-between">

                                    <Label>Pilihan Jawaban</Label>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addOption}
                                    >
                                        Tambah Opsi
                                    </Button>

                                </div>

                                {form.data.options.map((option, index) => (

                                    <div
                                        key={index}
                                        className="grid gap-2 rounded-lg border p-3 md:grid-cols-[1fr_auto_auto]"
                                    >

                                        <Input
                                            value={option.text}
                                            onChange={(e) =>
                                                updateOptionText(index, e.target.value)
                                            }
                                            required
                                        />

                                        <Button
                                            type="button"
                                            variant={option.correct ? "default" : "outline"}
                                            onClick={() => setCorrectOption(index)}
                                        >
                                            {option.correct
                                                ? "Jawaban Benar"
                                                : "Jadikan Benar"}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => removeOption(index)}
                                            disabled={form.data.options.length <= 2}
                                        >
                                            Hapus
                                        </Button>

                                    </div>

                                ))}

                            </div>

                            {/* Action */}
                            <div className="flex items-center gap-3">

                                <Button type="submit" disabled={form.processing}>
                                    Update Soal
                                </Button>

                                <Button variant="outline" asChild>
                                    <Link href={questionsIndex()}>
                                        Batal
                                    </Link>
                                </Button>

                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
