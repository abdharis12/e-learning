import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { examsSubmit } from '@/routes'

interface Props {
    deadline: number
    attemptId: number
}

export default function Timer({ deadline, attemptId }: Props) {

    const getRemaining = () =>
        Math.max(0, Math.floor((deadline - Date.now()) / 1000))

    const [time, setTime] = useState<number>(getRemaining())

    useEffect(() => {

        const interval = setInterval(() => {

            const remaining = getRemaining()

            setTime(remaining)

            if (remaining <= 0) {

                clearInterval(interval)

                router.post(examsSubmit(attemptId).url, {}, {
                    preserveScroll: true
                })

            }

        }, 1000)

        return () => clearInterval(interval)

    }, [deadline, attemptId])

    const minutes = Math.floor(time / 60).toString().padStart(2, '0')
    const seconds = (time % 60).toString().padStart(2, '0')

    return (
        <div className="text-2xl font-semibold text-red-600 tabular-nums">
            {minutes}:{seconds}
        </div>
    )
}
