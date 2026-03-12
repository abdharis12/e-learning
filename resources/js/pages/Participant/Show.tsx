import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
    FileText,
    ExternalLink,
    ChevronLeft,
    Download,
    Layers,
    Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { participantIndex } from "@/routes";
import { BreadcrumbItem } from "@/types/navigation";

interface Document {
    document_type: string;
    file_path: string | null;
    link: string | null;
}

interface Props {
    documents: Document[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Persyaratan Peserta',
        href: participantIndex(),
    },
];

export default function Show({ documents }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Preview Dokumen" />

            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col bg-white p-6 md:p-12 lg:p-16">

                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                        <Link
                            href={participantIndex()}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-500 transition-colors"
                        >
                            <ChevronLeft size={14} /> Back to Repository
                        </Link>

                        <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                            Document <span className="text-emerald-500">Preview.</span>
                        </h1>

                        <p className="max-w-md text-sm font-medium text-slate-400">
                            Menampilkan berkas digital yang telah diunggah untuk keperluan verifikasi administrasi.
                        </p>
                    </div>

                    <div className="flex h-16 items-center gap-4 rounded-[1.5rem] bg-slate-50 px-6 ring-1 ring-slate-100">
                        <Layers className="text-emerald-500" size={20} />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">
                                Total Assets
                            </p>
                            <p className="text-lg font-black text-slate-900 leading-none mt-1 tabular-nums">
                                {documents.length}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {documents.map((doc, i) => (
                        <div key={i} className="group relative h-full">

                            {/* Label */}
                            <div className="mb-4 flex items-center justify-between px-2">

                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-lg">
                                        <FileText size={14} />
                                    </div>

                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">
                                        {doc.document_type.replace("_", " ")}
                                    </h3>
                                </div>

                                {doc.file_path && (
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500"
                                    >
                                        <a href={`/storage/${doc.file_path}`} download>
                                            <Download size={14} className="mr-2" />
                                            Download
                                        </a>
                                    </Button>
                                )}

                            </div>

                            {/* Content */}
                            <div className="overflow-hidden rounded-[2rem] bg-slate-50 ring-1 ring-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] transition-all duration-500 group-hover:shadow-xl group-hover:shadow-slate-200">

                                {doc.file_path ? (

                                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                                        <iframe
                                            src={`/storage/${doc.file_path}#toolbar=0`}
                                            className="h-full w-full border-none"
                                            title={doc.document_type}
                                        />
                                        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem]" />
                                    </div>

                                ) : doc.link ? (

                                    <div className="flex flex-col items-center justify-center p-12 text-center">

                                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white text-emerald-500 shadow-xl shadow-slate-200 transition-transform group-hover:scale-110">
                                            <LinkIcon size={32} />
                                        </div>

                                        <h4 className="mb-2 text-lg font-black text-slate-900 italic">
                                            External Portfolio Resource
                                        </h4>

                                        <p className="mb-8 max-w-xs text-xs font-medium text-slate-400 leading-relaxed">
                                            Dokumen ini berupa tautan eksternal ke platform repositori pihak ketiga.
                                        </p>

                                        <Button
                                            asChild
                                            className="h-12 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-lg"
                                        >
                                            <a href={doc.link} target="_blank">
                                                Open Resource
                                                <ExternalLink size={14} className="ml-2" />
                                            </a>
                                        </Button>

                                    </div>

                                ) : (

                                    <div className="flex h-40 items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                                        No Data Content Available
                                    </div>

                                )}

                            </div>

                        </div>
                    ))}

                </div>

                {/* Footer */}
                <footer className="mt-24 flex items-center justify-between border-t border-slate-200 pt-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
                        Diskominfo Kabupaten Muara Enim
                    </p>

                    <div className="flex h-2 items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-700 uppercase">
                            AHDA Dev | V.1.0
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                </footer>

            </div>
        </AppLayout>
    );
}
