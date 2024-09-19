import RecentPurchases from "../components/home/recentPurchases.tsx";
import BestSeller from "../components/home/bestSeller.tsx";
import RevenueChart from "../components/home/revenueChart.tsx";

export default function Home() {

    return <div className={'px-4 py-3 space-y-4'}>
        <div className={'grid grid-cols-2 gap-8'}>
            <RevenueChart/>
            <BestSeller/>
        </div>
        <div className={''}>
            <RecentPurchases/>
        </div>
    </div>;
}


