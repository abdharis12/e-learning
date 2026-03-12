import { X } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function GuideModal({ open, onClose }: Props) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">

            <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-8 relative">

                <button
                    onClick={onClose}
                    className="cursor-pointer absolute top-4 right-4 text-slate-500 hover:text-white"
                >
                    <X size={18} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                    Petunjuk Teknis Pendaftaran
                </h2>

                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">

                    <p>
                        Untuk mengikuti seleksi Tenaga Ahli Web Developer Kabupaten Muara Enim,
                        peserta wajib mengikuti tahapan berikut:
                    </p>

                    <ol className="list-decimal pl-5 space-y-2">

                        <li>
                            Lakukan <span className="text-emerald-400 font-semibold">Pendaftaran Akun</span>.
                        </li>

                        <li>
                            Setelah akun dibuat, silakan <span className="text-emerald-400 font-semibold">Login ke Sistem</span>.
                        </li>

                        <li>
                            Lengkapi <span className="text-emerald-400 font-semibold">Upload Dokumen Persyaratan</span> pada modul <span className="text-emerald-400 font-semibold">Persyaratan</span>:
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Surat Lamaran & CV</li>
                                <li>Ijazah dan Transkrip Nilai</li>
                                <li>Pas Foto</li>
                                <li>Sertifikat Keahlian</li>
                                <li>Fotokopi KTP</li>
                                <li>Link Portfolio / GitHub</li>
                            </ul>
                        </li>

                        <li>
                            Setelah diverifikasi oleh panitia, peserta dapat mengikuti
                            <span className="text-emerald-400 font-semibold"> Ujian Seleksi Online</span>.
                        </li>

                    </ol>

                    <p className="text-xs text-slate-500 pt-2">
                        Pastikan semua dokumen yang diunggah valid dan dapat dibaca dengan jelas.
                    </p>

                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                    >
                        Tutup
                    </button>
                </div>

            </div>

        </div>
    );
}
