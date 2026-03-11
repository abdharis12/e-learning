import { Head, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { useEffect } from "react"

interface Attempt {
    id: number
    user: string
    exam: string
    answered: number
    total: number
    remaining_seconds: number
    status: string
}

interface Props {
    attempts: Attempt[]
}

export default function ExamMonitor({ attempts }: Props) {

    useEffect(() => {

        const interval = setInterval(() => {

            router.reload({
                only: ["attempts"]
            })

        }, 5000)

        return () => clearInterval(interval)

    }, [])

    return (
        <AppLayout>
            <Head title="Live Exam Monitor" />

            <div className="max-w-7xl mx-auto p-10 space-y-6">

                <h1 className="text-3xl font-bold">
                    Live Exam Monitor
                </h1>

                <table className="w-full border rounded-xl overflow-hidden">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="p-3 text-left">Peserta</th>
                            <th className="p-3 text-left">Ujian</th>
                            <th className="p-3 text-left">Progress</th>
                            <th className="p-3 text-left">Sisa Waktu</th>
                            <th className="p-3 text-left">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {attempts.map((a) => {

                            const minutes = Math.floor(a.remaining_seconds / 60)
                            const seconds = a.remaining_seconds % 60

                            return (
                                <tr key={a.id} className="border-t">
                                    <td className="p-3">{a.user}</td>
                                    <td className="p-3">{a.exam}</td>
                                    <td className="p-3">{a.answered} / {a.total}</td>
                                    <td className="p-3">
                                        {minutes}:{seconds.toString().padStart(2, '0')}
                                    </td>
                                    <td className="p-3">
                                        {a.status === "running"
                                            ? "🟢 Sedang Ujian"
                                            : "✅ Selesai"}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
        </AppLayout>
    )
}
