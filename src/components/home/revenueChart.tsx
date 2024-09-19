import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    ChartOptions
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useAppSelector } from "../../hooks/hooks.ts";
import { selectTransactions } from "../../data/slices/transactionSlice.ts";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

export default function RevenueChart() {
    const transactions = useAppSelector(selectTransactions);

    // Transform transactions data to chart data
    const chartData = {
        labels: transactions.map(transaction => transaction.createdAt), // Using ISO formatted dates directly
        datasets: [
            {
                label: 'Revenue',
                data: transactions.map(transaction => transaction.amount),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
            }
        ]
    };

    // Chart.js options
    const chartOptions:ChartOptions<'line'> = {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day', // Displaying data as per day
                    tooltipFormat: 'PP',
                },
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Revenue',
                },
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Revenue Over Time',
            },
        },
    };

    return (
        <div className={'rounded-lg bg-white p-4'}>
            <h1 className={'text-2xl'}>Revenue</h1>
            <div>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}