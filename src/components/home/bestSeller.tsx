import {useAppSelector} from "../../hooks/hooks.ts";
import {selectAllEvents} from "../../data/slices/EventSlice.ts";
import {Avatar} from "antd";


export default function BestSeller() {
const events = useAppSelector(selectAllEvents);
    return <div className={'rounded-lg bg-white p-4'}>
        <h1 className={'text-2xl'}>Top Events</h1>
        <table className={'w-full border-separate border-spacing-y-2 border-dark border-solid'}>
            <thead>
            <tr>
                <th></th>
                <th className={'font-bold text-start'}>Event Name</th>
                <th className={'font-bold text-start'}>Views</th>
                <th className={'font-bold text-start'}>Tickets Sold</th>
                <th className={'font-bold text-start'}>Revenue</th>
            </tr>
            </thead>
            <tbody className={''}>
            {
               [...events].sort((a,b) => b.weightedRating - a.weightedRating).map((event,index) => <tr key={index}>
                    <td>
                        <Avatar src={event.poster} shape={'square'} size={'large'}/>
                    </td>
                    <td>{event.eventName}</td>
                    <td>{event.viewCount}</td>
                    <td className={'font-semibold'}>{event.ticketSales}</td>
                    <td className={'font-semibold'}>{event.currency} {event.revenue}</td>
                </tr>)
            }
            </tbody>
        </table>
    </div>
}