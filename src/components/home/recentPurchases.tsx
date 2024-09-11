// components/home/recentPurchases.tsx
import  { useEffect, useState } from 'react';
import { Table } from 'antd';
import {Purchase} from "../../data/types.ts";
import {faker} from "@faker-js/faker";


const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'User',
        dataIndex: 'user',
        key: 'user',
    },
    {
        title: 'Event Name',
        dataIndex: 'eventName',
        key: 'eventName',
    },
    {
        title: 'Ticket Quantity',
        dataIndex: 'ticketQuantity',
        key: 'ticketQuantity',
    },
    {
        title: 'Purchase Date',
        dataIndex: 'purchaseDate',
        key: 'purchaseDate',
    },
    {
        title: 'Total Amount',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        render: (amount: number) => `$${amount.toFixed(2)}`,
    },
];

function generateFakePurchases(): Purchase[] {
    return Array.from({ length: 10 }, () => ({
        id: faker.string.alphanumeric(10),
        user: faker.person.fullName(),
        eventName: faker.company.catchPhrase(),
        ticketQuantity: faker.number.int({ min: 1, max: 5 }),
        purchaseDate: faker.date.recent().toISOString(), // format the date
        totalAmount: parseFloat(faker.finance.amount({min:10, max: 500, dec: 2})),
    }));
}

export default function RecentPurchases() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);

    useEffect(() => {
        // Generate and set the fake purchases on component mount
        const data = generateFakePurchases();
        setPurchases(data);
    }, []);

    return <Table dataSource={purchases} columns={columns} rowKey="id" pagination={false} />;
}