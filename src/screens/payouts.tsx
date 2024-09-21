import {Button, Card, Table} from "antd";
import WithdrawBankAccountForm from "../components/payout/WithdrawBankAccountForm.tsx";
import {useAppSelector} from "../hooks/hooks.ts";
import {selectTransactions} from "../data/slices/transactionSlice.ts";


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
        render: (user: {firstName: string, lastName: string}) => `${user.firstName} ${user.lastName}`, // Assuming user has these properties
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
export default function PayoutsPage() {
    const data = useAppSelector(selectTransactions)
    return <div className={'p-4'}>
        <h1 className={'font-semibold text-2xl mb-1'}>Payouts</h1>
        <div className={'grid grid-cols-4 gap-8'}>
            <div className={'col-span-3'}>
                <Table className={'rounded-lg'} dataSource={data} columns={columns} rowKey="_id" pagination={false} />
            </div>
            <div className={'space-y-8'}>
                <Card classNames={{body: 'space-y-4'}}>
                    <div>
                        <h3 className={'text-lg font-semibold'}>Current Balance</h3>
                        <h4 className={'text-lg font-medium'}>GHS 34000</h4>
                    </div>

                    <div>
                        <h3 className={'text-lg font-semibold text-gray-500'}>Pending Balance</h3>
                        <h4 className={'text-lg font-medium text-gray-500'}>GHS 34000</h4>
                    </div>
                    <Button type={'primary'}>Withdraw</Button>
                </Card>

                <WithdrawBankAccountForm/>
            </div>
        </div>
    </div>
}