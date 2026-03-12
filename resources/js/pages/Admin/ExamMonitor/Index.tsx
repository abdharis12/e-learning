import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useEffect } from "react";
import {
    Activity,
    User,
    CheckCircle2,
    Timer as TimerIcon
} from "lucide-react";

interface Attempt {
    id: number;
    user: string;
    exam: string;
    answered: number;
    total: number;
    remaining_seconds: number;
    status: string;
}

interface Props {
    attempts: Attempt[];
}

export default function ExamMonitor({ attempts }: Props) {

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ["attempts"],
                preserveScroll: true,
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AppLayout>
            <Head title="Live Exam Monitor" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12">

                {/* Dashboard Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Real-time Surveillance</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">
                            Live <span className="text-emerald-500">Monitoring.</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-3xl shadow-2xl shadow-slate-200">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                            <Activity size={20} />
                        </div>
                        <div className="pr-4">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Active Connections</p>
                            <p className="text-xl font-black text-white leading-none tabular-nums">
                                {attempts.filter(a => a.status === 'running').length}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Table Container */}
                <div className="overflow-hidden rounded-[2.5rem] bg-white ring-1 ring-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Candidate</th>
                                <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Module Context</th>
                                <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Progress Map</th>
                                <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clock Remaining</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Session Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {attempts.map((a) => {
                                const totalSeconds = Math.floor(a.remaining_seconds);
                                const minutes = Math.floor(totalSeconds / 60);
                                const seconds = totalSeconds % 60;
                                const progress = (a.answered / a.total) * 100;
                                const isRunning = a.status === "running";

                                return (
                                    <tr key={a.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                    <User size={18} />
                                                </div>
                                                <span className="font-bold text-slate-900 tracking-tight">{a.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-600 truncate max-w-[180px]">{a.exam}</span>
                                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Exam Module</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 min-w-[200px]">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <span>{a.answered} / {a.total}</span>
                                                    <span>{Math.round(progress)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${isRunning ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 font-black text-slate-900 tabular-nums tracking-tighter">
                                                <TimerIcon size={14} className={isRunning ? "text-emerald-500" : "text-slate-300"} />
                                                {isRunning ? `${minutes}:${String(seconds).padStart(2, '0')}` : "--:--"}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {isRunning ? (
                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-[9px] uppercase tracking-widest">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    Live Session
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-400 font-black text-[9px] uppercase tracking-widest">
                                                    <CheckCircle2 size={10} />
                                                    Completed
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
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
