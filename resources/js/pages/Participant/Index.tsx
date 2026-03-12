import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import {
    Eye,
    Trash2,
    CloudUpload,
    Users,
    Files,
    Search
} from "lucide-react";
import { participantCreate, participantDocumentDestroy, participantDocumentsShow, participantIndex } from "@/routes";
import { toast } from "sonner";
import { BreadcrumbItem } from "@/types/navigation";

interface Document {
    document_type: string;
}

interface Participant {
    id: number;
    name: string;
    documents: Document[];
}

interface Props {
    participants: Participant[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Persyaratan Peserta',
        href: participantIndex(),
    },
];

export default function Index({ participants }: Props) {

    const destroy = (id: number) => {
        toast("Hapus data peserta?", {
            description: "Tindakan ini akan menghapus seluruh berkas terkait.",
            action: {
                label: "Hapus",
                onClick: () => {
                    router.delete(participantDocumentDestroy(id).url, {
                        preserveScroll: true,
                        onStart: () =>
                            toast.loading("Menghapus data...", { id: "delete-doc" }),
                        onSuccess: () => {
                            toast.success("Data berhasil dihapus", { id: "delete-doc" });
                            // refresh data inertia
                            router.reload({ only: ["participants"] });
                        },
                        onError: () =>
                            toast.error("Gagal menghapus data", { id: "delete-doc" }),
                    });
                }
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dokumen Persyaratan Peserta" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12 lg:p-16">

                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 items-center justify-center rounded-full bg-emerald-100 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                                Repository
                            </div>
                            <span className="h-[1px] w-12 bg-slate-100"></span>
                        </div>
                        <p className="text-4xl font-black tracking-tight text-slate-900 md:text-4xl leading-none">
                            Upload <span className="text-emerald-400">Berkas.</span>
                        </p>
                        <p className="max-w-md text-sm font-normal text-slate-400 leading-relaxed">
                            Manajemen repositori dokumen peserta untuk proses audit dan verifikasi administratif.
                        </p>
                    </div>

                    <Button asChild className="px-8 rounded-[1.5rem] bg-slate-900 text-white hover:bg-emerald-600 shadow-2xl shadow-slate-200 font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 group">
                        <Link href={participantCreate()}>
                            <CloudUpload size={18} className="mr-3 group-hover:-translate-y-1 transition-transform" />
                            Upload Persyaratan
                        </Link>
                    </Button>
                </header>

                {/* Table Repertoire */}
                <div className="overflow-hidden rounded-[3rem] bg-white ring-1 ring-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Candidate Name</th>
                                <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Asset Count</th>
                                <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {participants.length > 0 ? (
                                participants.map((user) => (
                                    <tr key={user.id} className="group hover:bg-slate-50/30 transition-colors">
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                                    <Users size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-base font-black text-slate-900 tracking-tight">{user.name}</p>
                                                    <p className="text-[10px] font-bold uppercase text-emerald-500 tracking-tighter">Verified Identity</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-7">
                                            <div className="flex items-center gap-2">
                                                <Files size={14} className="text-slate-300" />
                                                <span className="text-sm font-bold text-slate-600 tabular-nums">
                                                    {user.documents.length} Berkas Terunggah
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link href={participantDocumentsShow(user.id)}>
                                                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-emerald-500 transition-all">
                                                        <Eye size={18} />
                                                    </Button>
                                                </Link>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => destroy(user.id)}
                                                    className="h-11 w-11 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <Search size={48} strokeWidth={1} />
                                            <p className="text-xs font-black uppercase tracking-[0.3em]">No Participant Records</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Minimalist Footer */}
                <footer className="mt-24 flex items-center justify-between border-t border-slate-200 pt-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
                        Diskominfo Kabupaten Muara Enim
                    </p>
                    <div className="flex h-2 items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-700 uppercase">AHDA Dev | V.1.0</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}
