import {useEffect, useState} from "react";

export default function CountDown({date}: { date: Date | string }) {
    const [countDownTime, setCountDownTime] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
    });
    const [isColonVisible, setIsColonVisible] = useState(true); // State for blinking colons

    useEffect(() => {
        const interval = setInterval(() => {
            getTimeDifference(new Date(date).getTime());
            setIsColonVisible(prev => !prev); // Toggle colon visibility for blinking effect
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval
    }, [date]);

    const getTimeDifference = (countDownDate: number) => {
        const currentTime = new Date().getTime();
        const timeDifference = countDownDate - currentTime;

        if (timeDifference < 0) {
            // If time difference is negative, countdown is over
            setCountDownTime({
                days: "00",
                hours: "00",
                minutes: "00",
                seconds: "00",
            });
            return;
        }

        // Calculating the time difference
        const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000)).toString().padStart(2, '0');
        const hours = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000).toString().padStart(2, '0');

        setCountDownTime({
            days,
            hours,
            minutes,
            seconds,
        });
    };

    return (

        <div className="flex text-2xl font-bold space-x-1">
            {/* Displaying countdown timer */}
            <div className="flex flex-col items-center">
                <span>{countDownTime.days}</span>

            </div>
            <div
                className={`flex-col ${isColonVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>:
            </div>
            <div className="flex flex-col items-center">
                <span>{countDownTime.hours}</span>

            </div>
            <div
                className={`flex-col ${isColonVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>:
            </div>
            <div className="flex flex-col items-center">
                <span>{countDownTime.minutes}</span>

            </div>
            <div
                className={`flex-col ${isColonVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>:
            </div>
            <div className="flex flex-col items-center">
                <span>{countDownTime.seconds}</span>

            </div>
        </div>
    );
}