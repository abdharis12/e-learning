import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { adminExamsCreate } from '@/routes';
import {
    create as questionsCreate,
    index as questionsIndex,
    store as questionsStore,
} from '@/routes/questions';
import type { BreadcrumbItem } from '@/types';

type OptionInput = {
    text: string;
    correct: boolean;
};

interface Props {
    exams: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bank Soal',
        href: questionsIndex(),
    },
    {
        title: 'Tambah Soal',
        href: questionsCreate(),
    },
];

export default function QuestionCreate({ exams }: Props) {
    const form = useForm<{
        exam_id: string;
        question_text: string;
        options: OptionInput[];
    }>({
        exam_id: '',
        question_text: '',
        options: [
            { text: '', correct: true },
            { text: '', correct: false },
            { text: '', correct: false },
            { text: '', correct: false },
        ],
    });

    const examOptions = Object.entries(exams);
    const hasExamOptions = examOptions.length > 0;

    const addOption = (): void => {
        form.setData('options', [
            ...form.data.options,
            { text: '', correct: false },
        ]);
    };

    const removeOption = (index: number): void => {
        if (form.data.options.length <= 2) {
            return;
        }

        const nextOptions = form.data.options.filter(
            (_, itemIndex) => itemIndex !== index,
        );

        if (!nextOptions.some((option) => option.correct)) {
            nextOptions[0].correct = true;
        }

        form.setData('options', nextOptions);
    };

    const updateOptionText = (index: number, text: string): void => {
        const nextOptions = [...form.data.options];
        nextOptions[index] = {
            ...nextOptions[index],
            text,
        };
        form.setData('options', nextOptions);
    };

    const setCorrectOption = (index: number): void => {
        const nextOptions = form.data.options.map((option, itemIndex) => ({
            ...option,
            correct: itemIndex === index,
        }));

        form.setData('options', nextOptions);
    };

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.post(questionsStore().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Soal" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Tambah Soal
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Buat pertanyaan baru dan tentukan satu jawaban benar.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Pertanyaan</CardTitle>
                        <CardDescription>
                            Isi pertanyaan beserta pilihan jawabannya.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <Label htmlFor="exam_id">Ujian</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link href={adminExamsCreate()}>
                                            Buat Ujian Baru
                                        </Link>
                                    </Button>
                                </div>
                                <select
                                    id="exam_id"
                                    value={form.data.exam_id}
                                    onChange={(event) =>
                                        form.setData(
                                            'exam_id',
                                            event.target.value,
                                        )
                                    }
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40"
                                    required
                                    disabled={!hasExamOptions}
                                >
                                    <option value="">Pilih ujian</option>
                                    {examOptions.map(([id, title]) => (
                                        <option key={id} value={id}>
                                            {title}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={form.errors.exam_id} />
                                {!hasExamOptions && (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada ujian. Buat ujian terlebih
                                        dahulu sebelum menambah soal.
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="question_text">
                                    Pertanyaan
                                </Label>
                                <Input
                                    id="question_text"
                                    value={form.data.question_text}
                                    onChange={(event) =>
                                        form.setData(
                                            'question_text',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Contoh: Apa ibu kota Indonesia?"
                                    required
                                />
                                <InputError
                                    message={form.errors.question_text}
                                />
                            </div>

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
                                        key={`option-${index}`}
                                        className="grid gap-2 rounded-lg border p-3 md:grid-cols-[1fr_auto_auto]"
                                    >
                                        <Input
                                            value={option.text}
                                            onChange={(event) =>
                                                updateOptionText(
                                                    index,
                                                    event.target.value,
                                                )
                                            }
                                            placeholder={`Opsi ${index + 1}`}
                                            required
                                        />

                                        <Button
                                            type="button"
                                            variant={
                                                option.correct
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            onClick={() =>
                                                setCorrectOption(index)
                                            }
                                        >
                                            {option.correct
                                                ? 'Jawaban Benar'
                                                : 'Jadikan Benar'}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => removeOption(index)}
                                            disabled={
                                                form.data.options.length <= 2
                                            }
                                        >
                                            Hapus
                                        </Button>

                                        <InputError
                                            className="md:col-span-3"
                                            message={
                                                form.errors[
                                                    `options.${index}.text`
                                                ] as string | undefined
                                            }
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    type="submit"
                                    disabled={
                                        form.processing || !hasExamOptions
                                    }
                                >
                                    Simpan Soal
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={questionsIndex()}>Batal</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
