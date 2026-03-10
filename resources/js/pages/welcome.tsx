import { dashboard, login, register } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Database,
    Globe,
    GraduationCap,
    Lock,
    Server,
    ShieldCheck
} from 'lucide-react';

interface Props {
    auth: {
        user: any;
    };
    [key: string]: any;
}

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<Props>().props;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-6 mx-auto max-w-7xl mb-20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
                        <GraduationCap className="text-white" size={24} />
                    </div>
                    <div>
                        <span className="text-lg font-bold tracking-tight text-white block leading-1 mt-3">E-LEARNING</span>
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-[0.2em]">Kab. Muara Enim</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="group flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-700"
                        >
                            Masuk Dashboard
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-400 transition-all hover:text-white"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500 hover:text-white shadow-lg shadow-emerald-500/10"
                                >
                                    Daftar Akun
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
                <div className="grid lg:grid-cols-12 gap-16 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                            Seleksi Tenaga Ahli Web Developer 2026
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                            Buktikan <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-200 to-blue-400">
                                Keahlian Digital.
                            </span>
                        </h1>

                        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                            Uji kompetensi teknis terpadu untuk calon Tenaga Ahli IT Pemerintah Kabupaten Muara Enim.
                            Pastikan Anda menggunakan perangkat yang mendukung standar pengembangan modern.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <Link
                                href={auth.user ? dashboard() : login()}
                                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-600/20 active:scale-95 flex items-center gap-3"
                            >
                                {auth.user ? "Lanjutkan Sesi" : "Mulai Sekarang"}
                                <ArrowRight size={18} />
                            </Link>
                            <button className="px-10 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white rounded-2xl font-bold transition-all backdrop-blur-sm">
                                Petunjuk Teknis
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Bento Grid */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                        <div className="col-span-2 p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-slate-700/50 shadow-2xl relative overflow-hidden group backdrop-blur-sm">
                            <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Globe size={200} />
                            </div>
                            <ShieldCheck className="text-emerald-400 mb-6" size={40} />
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">High-Level Assessment</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Standar penilaian meliputi arsitektur microservices, optimalisasi database, dan keamanan siber.
                            </p>
                        </div>

                        <div className="p-7 rounded-[2.2rem] bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-500 group">
                            <Server className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={28} />
                            <h4 className="font-bold text-white mb-1">Infrastruktur</h4>
                            <p className="text-[10px] text-slate-500 leading-tight tracking-widest uppercase">Scalable & Secure</p>
                        </div>

                        <div className="p-7 rounded-[2.2rem] bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-500 group">
                            <Database className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" size={28} />
                            <h4 className="font-bold text-white mb-1">Data Logic</h4>
                            <p className="text-[10px] text-slate-500 leading-tight tracking-widest uppercase">Integrity Driven</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-slate-800/30 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4 group cursor-default">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                        <Lock size={16} className="text-slate-500 group-hover:text-emerald-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold uppercase">
                            Dinas Komunikasi dan Informatika
                        </p>
                        <p className="text-[10px] text-slate-400 tracking-[0.1em] font-medium opacity-60">
                            Kabupaten Muara Enim
                        </p>
                    </div>
                </div>

                <div className="flex gap-8 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Status: ME-Active
                    </span>
                    <span className="text-slate-800">/</span>
                    <span>System v2.6.0</span>
                </div>
            </footer>
        </div>
    );
}
