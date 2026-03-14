import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import {
    CloudUpload,
    FileText,
    Image as ImageIcon,
    Link as LinkIcon,
    UserCircle,
    GraduationCap,
    Award,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { participantStore } from "@/routes";

export default function DocumentIndex() {
    const form = useForm({
        cv: null as File | null,
        ijazah: null as File | null,
        foto: null as File | null,
        sertifikat: null as File | null,
        ktp: null as File | null,
        portfolio: ""
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(participantStore().url, {
            forceFormData: true,
            onStart: () => toast.loading("Mengunggah berkas...", { id: "upload" }),
            onSuccess: () => toast.success("Berkas berhasil disimpan", { id: "upload" }),
            onError: (errors) => {
                const firstError = Object.values(errors)[0] ?? "Gagal mengunggah berkas";
                toast.error(firstError, { id: "upload" });
            }
        });
    };

    // Helper untuk merender item upload
    const UploadItem = ({
        label,
        field,
        icon: Icon,
        accept = ".pdf",
        helperText = "PDF (Max 5MB)"
    }: {
        label: string,
        field: keyof typeof form.data,
        icon: any,
        accept?: string,
        helperText?: string
    }) => {
        const file = form.data[field] as File | null;
        const fieldError = form.errors[field];

        return (
            <div className="group space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    {label}
                </label>
                <div className={`relative flex items-center gap-4 rounded-2xl border-none bg-slate-50 p-4 ring-1 transition-all duration-300 ${file ? 'ring-emerald-500 bg-emerald-50/30' : 'ring-slate-100 group-hover:ring-slate-200 group-hover:bg-white'}`}>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${file ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 shadow-sm group-hover:text-slate-900'}`}>
                        {file ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-bold text-slate-900">
                            {file ? file.name : `Pilih berkas ${label.toLowerCase()}...`}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400">
                            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : helperText}
                        </p>
                    </div>

                    <input
                        type="file"
                        accept={accept}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const maxSize = 5 * 1024 * 1024;

                            if (file.size > maxSize) {
                                toast.error("Ukuran file maksimal 5MB");
                                e.target.value = "";
                                return;
                            }

                            if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
                                toast.error("Format file tidak valid");
                                e.target.value = "";
                                return;
                            }

                            form.setData(field, file);
                        }}
                        className="absolute inset-0 cursor-pointer opacity-0"
                    />
                </div>
                {fieldError && (
                    <p className="ml-1 text-[11px] font-semibold text-rose-500">{fieldError}</p>
                )}
            </div>
        );
    };

    return (
        <AppLayout>
            <Head title="Upload Persyaratan" />

            <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col bg-white p-6 md:p-12">

                {/* Header Section */}
                <header className="mb-12 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 items-center justify-center rounded-full bg-slate-900 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                            Administrative
                        </div>
                        <span className="h-[1px] flex-1 bg-slate-100"></span>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                            Upload <span className="text-emerald-500">Berkas.</span>
                        </h1>
                        <p className="max-w-md text-base font-medium text-slate-400">
                            Lengkapi dokumen persyaratan berikut untuk verifikasi profil peserta Anda.
                        </p>
                    </div>
                </header>

                <form onSubmit={submit} className="space-y-10">
                    <Card className="rounded-[2.5rem] border-none bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] ring-1 ring-slate-100">
                        <CardContent className="grid gap-8 p-10 md:grid-cols-2">

                            <UploadItem label="Surat Lamaran & CV" field="cv" icon={FileText} accept=".pdf" helperText="PDF (Max 5MB)" />
                            <UploadItem label="Ijazah & Transkrip" field="ijazah" icon={GraduationCap} accept=".pdf" helperText="PDF (Max 5MB)" />
                            <UploadItem label="Pas Foto Terbaru" field="foto" icon={ImageIcon} accept="image/*,.pdf" helperText="JPG, JPEG, PNG, PDF (Max 5MB)" />
                            <UploadItem label="Sertifikat Keahlian" field="sertifikat" icon={Award} accept=".pdf" helperText="PDF (Max 5MB)" />
                            <UploadItem label="Identitas (KTP)" field="ktp" icon={UserCircle} accept="image/*,.pdf" helperText="JPG, JPEG, PNG, PDF (Max 5MB)" />

                            <div className="group space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                    Link Portfolio
                                </label>
                                <div className="relative flex items-center gap-4 rounded-2xl bg-slate-50 p-1 ring-1 ring-slate-100 transition-all duration-300 group-focus-within:bg-white group-focus-within:ring-emerald-500">
                                    <div className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm group-focus-within:text-emerald-500">
                                        <LinkIcon size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="https://github.com/username"
                                        className="h-12 flex-1 bg-transparent border-none text-sm font-bold text-slate-900 focus:ring-0 placeholder:text-slate-300"
                                        onChange={(e) => form.setData("portfolio", e.target.value)}
                                    />
                                </div>
                                {form.errors.portfolio && (
                                    <p className="ml-1 text-[11px] font-semibold text-rose-500">{form.errors.portfolio}</p>
                                )}
                            </div>

                        </CardContent>
                    </Card>

                    <div className="flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-slate-900 p-8 md:flex-row">
                        <div className="space-y-1">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">Konfirmasi Data</h3>
                            <p className="text-[11px] font-medium text-slate-400">Pastikan semua dokumen yang diunggah valid dan terbaca.</p>
                        </div>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="h-14 w-full rounded-2xl bg-emerald-500 px-10 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 md:w-auto transition-all duration-300 active:scale-95"
                        >
                            <CloudUpload size={18} className="mr-3" /> Simpan Dokumen
                        </Button>
                    </div>
                </form>

                {/* Footer Trace */}
                <footer className="mt-16 flex items-center justify-between border-t border-slate-100 pt-8 opacity-40">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Secure Document Management</p>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Ahda System v2.6</span>
                        <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}
