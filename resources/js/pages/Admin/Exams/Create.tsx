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
import { adminExamsCreate, adminExamsIndex, adminExamsStore } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { BookPlus, Timer, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manajemen Ujian', href: adminExamsIndex() },
    { title: 'Tambah Ujian', href: adminExamsCreate() },
];

export default function AdminExamCreate() {
    const form = useForm({
        title: '',
        duration_minutes: '60',
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.post(adminExamsStore().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Ujian - Admin" />

            <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col bg-white p-6 md:p-12 lg:p-16">

                {/* Modern Header Section */}
                <header className="relative mb-12 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 items-center justify-center rounded-full bg-emerald-100 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                            Creation Suite
                        </div>
                        <span className="h-[1px] flex-1 bg-slate-200"></span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="space-y-2">
                            <p className="text-4xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                Ujian <span className="text-emerald-500">Baru.</span>
                            </p>
                            <p className="max-w-md text-sm text-slate-400 font-normal">
                                Inisialisasi modul evaluasi baru untuk sistem bank soal.
                            </p>
                        </div>

                        <Button variant="outline" asChild className="rounded-2xl border-slate-200 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            <Link href={adminExamsIndex()} className="flex items-center gap-2">
                                <ArrowLeft size={16} /> Kembali
                            </Link>
                        </Button>
                    </div>
                </header>

                {/* Focused Form Card */}
                <Card className="border-none bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] ring-1 ring-slate-100 rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-4">
                        <div className="flex items-center gap-5">
                            <div className="flex h-16 w-16 items-center justify-center rounded-[1.8rem] bg-emerald-50 text-emerald-600 shadow-inner">
                                <BookPlus size={32} />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black text-slate-900 leading-tight">Parameter Modul</CardTitle>
                                <CardDescription className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                                    Informasi Dasar & Durasi
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-10 pt-6">
                        <form onSubmit={submit} className="space-y-10">

                            {/* Title Input */}
                            <div className="space-y-4 group">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="title" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                                        Judul Ujian
                                    </Label>
                                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter">Wajib Diisi</span>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="title"
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        placeholder="Contoh: Pemograman Web Dasar"
                                        className="px-6 bg-slate-50/50 border-none ring-1 ring-slate-200 rounded-2xl text-base font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all duration-300"
                                        required
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-emerald-200 transition-colors">
                                        <Sparkles size={20} />
                                    </div>
                                </div>
                                <InputError message={form.errors.title} className="ml-1" />
                            </div>

                            {/* Duration Input */}
                            <div className="space-y-4 group">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="duration_minutes" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                                        Durasi Pengerjaan
                                    </Label>
                                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter">Satuan Menit</span>
                                </div>
                                <div className="relative max-w-[240px]">
                                    <Input
                                        id="duration_minutes"
                                        type="number"
                                        min={1}
                                        value={form.data.duration_minutes}
                                        onChange={(e) => form.setData('duration_minutes', e.target.value)}
                                        className="pl-14 pr-6 bg-slate-50/50 border-none ring-1 ring-slate-200 rounded-2xl text-xl font-black text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all duration-300"
                                        required
                                    />
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                                        <Timer size={20} />
                                    </div>
                                </div>
                                <InputError message={form.errors.duration_minutes} className="ml-1" />
                            </div>

                            {/* Form Actions */}
                            <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-2xl bg-slate-900 text-white hover:bg-emerald-600 transition-all duration-500 shadow-xl shadow-slate-200 font-black text-xs uppercase tracking-[0.2em] flex-1 sm:flex-none"
                                >
                                    {form.processing ? 'Menyimpan...' : (
                                        <span className="flex items-center gap-3">
                                            <CheckCircle2 size={18} /> Simpan Ujian
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Decorative Support Info */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                    <div className="flex items-start gap-4 p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100">
                        <div className="h-10 w-20 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
                            <Sparkles size={20} />
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                            Judul ujian akan muncul di dashboard peserta. Gunakan penamaan yang deskriptif dan profesional.
                        </p>
                    </div>
                    <div className="flex items-start gap-4 p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100">
                        <div className="h-10 w-20 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
                            <Timer size={20} />
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                            Sistem akan otomatis menutup sesi ujian jika durasi berakhir. Pastikan durasi mencukupi untuk jumlah soal.
                        </p>
                    </div>
                </div>

                {/* Footer Signature */}
                <footer className="mt-20 flex items-center justify-between border-t border-slate-200 pt-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-700">
                        Diskominfo Kabupaten Muara Enim
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold text-slate-700 uppercase tracking-tighter italic">AHDA Dev | V.1.0</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}
