import RecentPurchases from "../components/home/recentPurchases.tsx";

export default function Home() {

    return <div className={'px-4 py-3 space-y-4'}>
        <div className={'grid grid-cols-2 gap-8'}>
            <div className={'rounded-lg bg-white p-4'}>
                <h1 className={'text-2xl'}>Revenue</h1>
            </div>
            <div className={'rounded-lg bg-white p-4'}>
                <h1 className={'text-2xl'}>Best Seller</h1>
                <table className={'w-full'}>
                    <thead>
                    <th>
                        <td>Item</td>
                        <td>Price</td>
                        <td>Sold(Excess)</td>
                        <td>Revenue</td>
                    </th>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
        <div className={''}>
            <RecentPurchases/>
        </div>
    </div>;
}


