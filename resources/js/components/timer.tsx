import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { examsSubmit } from '@/routes';

interface Props {
    duration: number;
    attemptId: number;
}

export default function Timer({ duration, attemptId }: Props) {
    const [time, setTime] = useState<number>(duration);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((previous) => {
                if (previous <= 1) {
                    router.post(examsSubmit(attemptId).url);
                    return 0;
                }

                return previous - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [attemptId]);

    const minutes = Math.floor(time / 60)
        .toString()
        .padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');

    return (
        <div className="text-2xl font-semibold text-red-600">
            {minutes}:{seconds}
        </div>
    );
}
