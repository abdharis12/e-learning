import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Eye,
    Trash2,
    CloudUpload,
    Users,
    Files,
    Search,
    Mail,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    participantCreate,
    participantDocumentDestroy,
    participantDocumentsShow,
    participantIndex,
    participantsExport,
} from '@/routes';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types/navigation';
import { UserRole } from '@/enums/user-role';

interface Document {
    document_type: string;
}

interface Participant {
    id: number;
    name: string;
    email: string;
    documents: Document[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Pagination<T> {
    data: T[];
    links: PaginationLink[];
    from: number | null;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface PageProps {
    auth: {
        user: AuthUser;
    };
}

interface Props {
    participants: Pagination<Participant>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Persyaratan Peserta',
        href: participantIndex(),
    },
];

export default function Index({ participants }: Props) {
    const { auth } = usePage<PageProps>().props;

    const destroy = (id: number) => {
        toast('Hapus data peserta?', {
            description: 'Tindakan ini akan menghapus seluruh berkas terkait.',
            action: {
                label: 'Hapus',
                onClick: () => {
                    router.delete(participantDocumentDestroy(id).url, {
                        preserveScroll: true,
                        onStart: () =>
                            toast.loading('Menghapus data...', {
                                id: 'delete-doc',
                            }),
                        onSuccess: () => {
                            toast.success('Data berhasil dihapus', {
                                id: 'delete-doc',
                            });
                            // refresh data inertia
                            router.reload({ only: ['participants'] });
                        },
                        onError: () =>
                            toast.error('Gagal menghapus data', {
                                id: 'delete-doc',
                            }),
                    });
                },
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dokumen Persyaratan Peserta" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12 lg:p-16">
                {/* Header Section */}
                <header className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 items-center justify-center rounded-full bg-emerald-100 px-4 text-[10px] font-black tracking-[0.2em] text-emerald-700 uppercase">
                                Repository
                            </div>
                            <span className="h-[1px] w-12 bg-slate-100"></span>
                        </div>
                        <p className="text-4xl leading-none font-black tracking-tight text-slate-900 md:text-4xl">
                            Upload{' '}
                            <span className="text-emerald-400">Berkas.</span>
                        </p>
                        <p className="max-w-md text-sm leading-relaxed font-normal text-slate-400">
                            Manajemen repositori dokumen peserta untuk proses
                            audit dan verifikasi administratif.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {auth.user.role === UserRole.Admin && (
                            <Button
                                onClick={() =>
                                    (window.location.href =
                                        participantsExport().url)
                                }
                                className="rounded-4xl bg-emerald-500 px-8 text-white"
                            >
                                <Files size={18} />
                                Export Excel
                            </Button>
                        )}

                        <Button
                            asChild
                            className="rounded-[1.5rem] bg-slate-900 px-8 text-white"
                        >
                            <Link href={participantCreate()}>
                                <CloudUpload size={18} />
                                Upload Persyaratan
                            </Link>
                        </Button>
                    </div>
                </header>

                <div className="overflow-hidden rounded-[3rem] bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] ring-1 ring-slate-100">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-emerald-200 text-slate-900">
                                <th className="px-10 py-6 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                    No
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                    Nama Peserta
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                    Email Peserta
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                    Berkas Upload
                                </th>
                                <th className="px-10 py-6 text-right text-[10px] font-black tracking-[0.2em] uppercase">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {participants.data.length > 0 ? (
                                participants.data.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className="group transition-all duration-300"
                                    >
                                        <td className="bg-slate-50/50 px-10 py-7 transition-colors group-hover:bg-slate-100">
                                            <div className="flex items-center gap-2">
                                                <span className="w-full text-center text-sm font-bold text-slate-300 tabular-nums">
                                                    {(participants.from ?? 0) +
                                                        index}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="bg-slate-50/50 px-10 py-7 transition-colors group-hover:bg-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-500 group-hover:bg-slate-900 group-hover:text-white">
                                                    <Users size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-base font-black tracking-tight text-slate-900">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-[10px] font-bold tracking-tighter text-emerald-500 uppercase">
                                                        Verified Identity
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="bg-slate-50/50 px-10 py-7 transition-colors group-hover:bg-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-500 group-hover:bg-slate-900 group-hover:text-white">
                                                    <Mail size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-base font-black tracking-tight text-slate-900">
                                                        {user.email}
                                                    </p>
                                                    <p className="text-[10px] font-bold tracking-tighter text-emerald-500 uppercase">
                                                        Verified Identity
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="bg-slate-50/50 px-6 py-7 transition-colors group-hover:bg-slate-100">
                                            <div className="flex items-center gap-2">
                                                <Files
                                                    size={14}
                                                    className="text-slate-300"
                                                />
                                                <span className="text-sm font-bold text-slate-600 tabular-nums">
                                                    {user.documents.length}{' '}
                                                    Berkas Terunggah
                                                </span>
                                            </div>
                                        </td>
                                        <td className="bg-slate-50/50 px-10 py-7 transition-colors group-hover:bg-slate-100">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    href={participantDocumentsShow(
                                                        user.id,
                                                    )}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-11 w-11 rounded-xl text-slate-400 transition-all hover:bg-white hover:text-emerald-500 hover:shadow-md"
                                                    >
                                                        <Eye size={18} />
                                                    </Button>
                                                </Link>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        destroy(user.id)
                                                    }
                                                    className="h-11 w-11 rounded-xl text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-10 py-24 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                                            <Search size={48} strokeWidth={1} />
                                            <p className="text-xs font-black tracking-[0.3em] uppercase">
                                                No Participant Records
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-10 sm:flex-row">
                    <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                        Total:{' '}
                        <span className="text-slate-900">
                            {participants.data.length}
                        </span>{' '}
                        peserta
                    </p>

                    <div className="flex gap-3">
                        {participants.links.map((link, index) => {
                            if (
                                link.label.includes('Previous') ||
                                link.label.includes('Sebelumnya')
                            ) {
                                return (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        disabled={!link.url}
                                        asChild={!!link.url}
                                        className="h-14 rounded-2xl border-slate-100 px-6 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-slate-50"
                                    >
                                        {link.url ? (
                                            <button
                                                onClick={() =>
                                                    router.visit(link.url!)
                                                }
                                            >
                                                <ChevronLeft
                                                    size={14}
                                                    className="mr-2"
                                                />{' '}
                                                Prev
                                            </button>
                                        ) : (
                                            <span className="opacity-20">
                                                Prev
                                            </span>
                                        )}
                                    </Button>
                                );
                            }
                            if (
                                link.label.includes('Next') ||
                                link.label.includes('Berikutnya')
                            ) {
                                return (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        disabled={!link.url}
                                        asChild={!!link.url}
                                        className="h-14 rounded-2xl border-slate-100 px-6 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-slate-50"
                                    >
                                        {link.url ? (
                                            <button
                                                onClick={() =>
                                                    router.visit(link.url!)
                                                }
                                            >
                                                Next{' '}
                                                <ChevronRight
                                                    size={14}
                                                    className="ml-2"
                                                />
                                            </button>
                                        ) : (
                                            <span className="opacity-20">
                                                Next
                                            </span>
                                        )}
                                    </Button>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>

                {/* Minimalist Footer */}
                <footer className="mt-24 flex items-center justify-between border-t border-slate-200 pt-8">
                    <p className="text-[10px] font-black tracking-[0.4em] text-slate-700 uppercase">
                        Diskominfo Kabupaten Muara Enim
                    </p>
                    <div className="flex h-2 items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-700 uppercase">
                            AHDA Dev | V.1.0
                        </span>
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}
