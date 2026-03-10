import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import {
    adminExamAssignmentsIndex,
    adminExamAssignmentsStore,
    adminExamsIndex,
} from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Users2, Plus, Trash2, Calendar, Hash, Save, ArrowLeft, ShieldCheck } from 'lucide-react';

// ... (Types tetap sama)

export default function AdminExamAssignments({ exam, pesertaUsers, assignments }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Manajemen Ujian', href: adminExamsIndex() },
        { title: `Peserta - ${exam.title}`, href: adminExamAssignmentsIndex(exam.id) },
    ];

    const form = useForm<{ assignments: AssignmentItem[] }>({
        assignments: assignments.length > 0 ? assignments : [
            { user_id: 0, max_attempts: 1, available_from: null, available_until: null },
        ],
    });

    const addRow = (): void => {
        form.setData('assignments', [
            ...form.data.assignments,
            { user_id: 0, max_attempts: 1, available_from: null, available_until: null },
        ]);
    };

    const removeRow = (index: number): void => {
        form.setData('assignments', form.data.assignments.filter((_, i) => i !== index));
    };

    const updateRow = <K extends keyof AssignmentItem>(index: number, key: K, value: AssignmentItem[K]): void => {
        const nextRows = [...form.data.assignments];
        nextRows[index] = { ...nextRows[index], [key]: value };
        form.setData('assignments', nextRows);
    };

    const submit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        form.post(adminExamAssignmentsStore(exam.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Atur Peserta ${exam.title}`} />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12 lg:p-16">

                {/* Header Section */}
                <header className="relative mb-12 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 items-center justify-center rounded-full bg-emerald-100 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                            Assignment Matrix
                        </div>
                        <span className="h-[1px] flex-1 bg-slate-100"></span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="space-y-2">
                            <p className="text-4xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                Atur <span className="text-emerald-500">Peserta.</span>
                            </p>
                            <p className="max-w-md text-sm text-slate-400 font-normal">
                                Mengatur hak akses dan jadwal spesifik untuk ujian: <br />
                                <span className="text-slate-900 font-bold">{exam.title}</span>
                            </p>
                        </div>
                    </div>
                </header>

                <form onSubmit={submit} className="space-y-8">
                    <Card className="border-none bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <Users2 size={24} />
                                    </div>
                                    <CardTitle className="text-xl font-black text-slate-900">Konfigurasi Akses</CardTitle>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addRow}
                                    className="h-12 px-6 rounded-xl border-emerald-100 bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                                >
                                    <Plus size={16} className="mr-2" /> Tambah Baris
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 pt-4 space-y-6">
                            {form.data.assignments.map((assignment, index) => (
                                <div key={`assignment-${index}`} className="group relative flex flex-col gap-6 p-6 rounded-[2rem] bg-slate-50/50 border border-transparent hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">

                                    {/* Grid Input */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-end">

                                        {/* Select Peserta */}
                                        <div className="lg:col-span-4 space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Peserta</Label>
                                            <div className="relative">
                                                <select
                                                    value={assignment.user_id}
                                                    onChange={(e) => updateRow(index, 'user_id', Number(e.target.value))}
                                                    className="w-full h-14 pl-4 pr-10 bg-white border-none ring-1 ring-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-400 outline-none transition-all appearance-none"
                                                    required
                                                >
                                                    <option value={0}>Pilih Peserta...</option>
                                                    {pesertaUsers.map((user) => (
                                                        <option key={user.id} value={user.id}>{user.name} — {user.email}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                                    <Users2 size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Max Attempt */}
                                        <div className="lg:col-span-2 space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 italic">Attempt</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={assignment.max_attempts}
                                                    onChange={(e) => updateRow(index, 'max_attempts', Number(e.target.value))}
                                                    className="h-14 bg-white border-none ring-1 ring-slate-200 rounded-2xl font-black text-center focus:ring-2 focus:ring-emerald-400"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Start Date */}
                                        <div className="lg:col-span-3 space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Mulai</Label>
                                            <Input
                                                type="datetime-local"
                                                value={assignment.available_from ?? ''}
                                                onChange={(e) => updateRow(index, 'available_from', e.target.value || null)}
                                                className="h-14 bg-white border-none ring-1 ring-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-400"
                                            />
                                        </div>

                                        {/* End Date */}
                                        <div className="lg:col-span-2 space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Selesai</Label>
                                            <Input
                                                type="datetime-local"
                                                value={assignment.available_until ?? ''}
                                                onChange={(e) => updateRow(index, 'available_until', e.target.value || null)}
                                                className="h-14 bg-white border-none ring-1 ring-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-400"
                                            />
                                        </div>

                                        {/* Remove Action */}
                                        <div className="lg:col-span-1 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeRow(index)}
                                                className="h-14 w-14 flex items-center justify-center rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 group-hover:scale-110 shadow-sm"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <InputError message={form.errors[`assignments.${index}.user_id`] as string | undefined} className="mt-1 ml-1" />
                                </div>
                            ))}

                            <InputError message={form.errors.assignments} />
                        </CardContent>
                    </Card>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden relative">
                        {/* Decorative Background Icon */}
                        <ShieldCheck size={180} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />

                        <div className="flex items-center gap-4 z-10">
                            <Button
                                variant="outline"
                                asChild
                                className="rounded-2xl bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
                            >
                                <Link href={adminExamsIndex()} className="flex items-center gap-2">
                                    <ArrowLeft size={16} /> Kembali
                                </Link>
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="rounded-[1.5rem] bg-emerald-500 text-white hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3"
                            >
                                {form.processing ? 'Memproses...' : (
                                    <>
                                        <Save size={18} /> Simpan Pengaturan
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Secure Info Footer */}
                <footer className="mt-20 flex items-center justify-between border-t border-slate-200 pt-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-700">Diskominfo Kabupaten Muara Enim</p>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold text-slate-700 uppercase tracking-tighter italic">AHDA Dev | V.1.0</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}
