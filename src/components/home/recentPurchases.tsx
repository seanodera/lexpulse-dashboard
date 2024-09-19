// components/home/recentPurchases.tsx
import { Table } from 'antd';
import {useAppSelector} from "../../hooks/hooks.ts";
import {selectTransactions} from "../../data/slices/transactionSlice.ts";


const columns = [
    {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
    },
    {
        title: 'User',
        dataIndex: 'user',
        key: 'user',
        render: (user: any) => `${user.firstName} ${user.lastName}`, // Assuming user has these properties
    },
    {
        title: 'Event Name',
        dataIndex: 'event',
        key: 'eventId',
    },
    {
        title: 'Purchase Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
        title: 'Total Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount: number) => `$${amount.toFixed(2)}`,
    },
];

export default function RecentPurchases() {
    const data = useAppSelector(selectTransactions)

    return <Table dataSource={data} columns={columns} rowKey="_id" pagination={false} />;
}