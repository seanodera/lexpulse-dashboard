import {Button, Card, Table} from "antd";
import WithdrawBankAccountForm from "../components/payout/WithdrawBankAccountForm.tsx";
import {useAppSelector} from "../hooks/hooks.ts";
import {selectTransactions, selectWallets} from "../data/slices/transactionSlice.ts";
import {selectCurrentUser} from "../data/slices/authSlice.ts";
import {selectAllEvents} from "../data/slices/EventSlice.ts";
import {EventModel, Transaction} from "../data/types.ts";



export default function PayoutsPage() {
    const data = useAppSelector(selectTransactions)
    const user = useAppSelector(selectCurrentUser)
    const wallets = useAppSelector(selectWallets)
    const events =useAppSelector(selectAllEvents)
    console.log(events, data)
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
            render: (text:number, record:Transaction) => `${  (typeof record.eventId !== 'string' )? record.eventId.currency  : 'GHS'} ${text.toFixed(2)}`,
        },
    ];
    console.log(user)
    return <div className={'p-4'}>
        <h1 className={'font-semibold text-2xl mb-1'}>Payouts</h1>
        <div className={'grid grid-cols-4 gap-8'}>
            <div className={'col-span-3'}>
                <Table className={'rounded-lg'} dataSource={data} columns={columns} rowKey="_id" pagination={false} />
            </div>
            <div className={'space-y-8'}>
                <Button type={'primary'}>Withdraw</Button>
                {[wallets.map((value, index) =>   <Card key={index} classNames={{body: 'space-y-4'}}>
                    <div>
                        <h3 className={'text-lg font-semibold'}>Current Balance</h3>
                        <h4 className={'text-lg font-medium'}>{value.currency} {value.balance || 0}</h4>
                    </div>

                    <div>
                        <h3 className={'text-lg font-semibold text-gray-500'}>Pending Balance</h3>
                        <h4 className={'text-lg font-medium text-gray-500'}>{value.currency} {value.pendingBalance || 0}</h4>
                    </div>
                </Card>)]}

                <WithdrawBankAccountForm/>
            </div>
        </div>
    </div>
}