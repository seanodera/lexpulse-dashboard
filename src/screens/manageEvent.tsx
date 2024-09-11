import {generateEvents} from "../data/generator.ts";
import {useEffect, useState} from "react";
import {EventModel} from "../data/types.ts";
import EventComponent from "../components/eventComponent.tsx";

export default function ManageEvent() {
    const [events, setEvents] = useState<EventModel[]>([]);

    useEffect(() => {;
        setEvents(generateEvents(5));
    }, [])
    return <div className={'p-4'}>
        <div className={'flex justify-between mb-2'}><h1 className={'text-3xl font-semibold'}>All Events</h1></div>
        <div className={'grid grid-cols-4 gap-8'}>
            {events.map(event => (<EventComponent key={event.id} event={event}/>))}
        </div>
    </div>
}