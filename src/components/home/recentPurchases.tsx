// components/home/recentPurchases.tsx
import { Table } from 'antd';
import {useAppSelector} from "../../hooks/hooks.ts";
import {selectTransactions} from "../../data/slices/transactionSlice.ts";
import {EventModel, Transaction} from "../../data/types.ts";


const columns = [
    {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
    },
    {
        title: 'User',
        dataIndex: 'attendeeId',
        key: 'user',
        render: (user: {firstName: string, lastName: string}) => `${user.firstName} ${user.lastName}`, // Assuming user has these properties
    },
    {
        title: 'Event Name',
        dataIndex: 'eventId',
        key: 'eventId',
        render: (event: EventModel) => event.eventName,
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
        render: (amount: number, record:Transaction) => `${  (typeof record.eventId !== 'string' )? record.eventId.currency  : 'GHS'}${amount.toFixed(2)}`,
    },
];

export default function RecentPurchases() {
    const data = useAppSelector(selectTransactions)
    console.log(data)
    return <Table dataSource={data} columns={columns} rowKey="_id" pagination={false} />;
}