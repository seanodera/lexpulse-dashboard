import EventComponent from "../components/eventComponent.tsx";
import {useAppSelector} from "../hooks/hooks.ts";
import {selectAllEvents} from "../data/slices/EventSlice.ts";

export default function ManageEvent() {
    const events = useAppSelector(selectAllEvents);


    return <div className={'p-4'}>
        <div className={'flex justify-between mb-2'}><h1 className={'text-3xl font-semibold'}>All Events</h1></div>
        <div className={'grid grid-cols-4 gap-8'}>
            {events.map(event => (<EventComponent key={event.id} event={event}/>))}
        </div>
    </div>
}