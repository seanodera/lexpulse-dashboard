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
import { Transaction } from "../../data/types.ts";
import { Select } from 'antd';
import { useState } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

export default function RevenueChart() {
    const transactions = useAppSelector(selectTransactions);
    const [scope, setScope] = useState('month');

    const handleScopeChange = (value: string) => {
        setScope(value);
    };

    const mapTransactions = (transactions: Transaction[], scope: string) => {
     try {
         const result: { scope: string; value: number }[] = [];
         console.log(transactions);
         if (scope === 'date') {
             const byDate = transactions.reduce((acc: any, txn) => {
                 const date = txn.createdAt? new Date(txn.createdAt).toISOString().split('T')[0] : null;
                 if (date){
                     if (!acc[date]) {
                         acc[date] = 0;
                     }
                     acc[date] += txn.amount;
                 }
                 return acc;
             }, {});
             for (const date in byDate) {
                 result.push({ scope: date, value: byDate[date] });
             }
         } else if (scope === 'month') {
             const byMonth = transactions.reduce((acc: any, txn) => {
                 const month = txn.createdAt?.toLocaleString('default', { month: 'long', year: 'numeric' });
                 if (month){
                     if (!acc[month]) {
                         acc[month] = 0;
                     }
                     acc[month] += txn.amount;
                 }
                 return acc;
             }, {});
             for (const month in byMonth) {
                 result.push({ scope: month, value: byMonth[month] });
             }
         } else if (scope === 'event') {
             const byEvent = transactions.reduce((acc: any, txn) => {
                 if (typeof txn.eventId !== 'string') {
                     if (!acc[txn.eventId.eventName]) {
                         acc[txn.eventId.eventName] = 0;
                     }
                     acc[txn.eventId.eventName] += txn.amount;
                 }

                 return acc;
             }, {});
             for (const event in byEvent) {
                 result.push({ scope: event, value: byEvent[event] });
             }
         }

         return result;
     } catch (e){
         console.log(e);
         return []
     }
    };

    const transactionSummary = mapTransactions(transactions, scope);
    const chartData = {
        labels: transactionSummary.map((value) => value.scope),
        datasets: [
            {
                label: 'Revenue',
                data: transactionSummary.map(transaction => transaction.value),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
            }
        ]
    };

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: scope === 'date' ? 'day' : 'month', // Adjust scale based on scope
                    tooltipFormat: 'PP',
                },
                title: {
                    display: true,
                    text: scope === 'event' ? 'Event' : 'Date',
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
                text: `Revenue Over Time (${scope.charAt(0).toUpperCase() + scope.slice(1)})`,
            },
        },
    };

    return (
        <div className={'rounded-lg bg-white p-4'}>
            <div className={'flex justify-between items-center'}>
                <h1 className={'text-2xl'}>Revenue</h1>
                <Select defaultValue="month" onChange={handleScopeChange} className={'mb-4'}>
                    <Select.Option value="date">Date</Select.Option>
                    <Select.Option value="month">Month</Select.Option>
                    <Select.Option value="event">Event</Select.Option>
                </Select>
            </div>
            <div>
                <Line data={chartData} options={chartOptions}/>
            </div>
        </div>
    );
}
