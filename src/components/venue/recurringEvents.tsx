import {Venue} from "../../data/types.ts";
import RecurringEventItem from "./recurrringEventItem.tsx";


export default function RecurringEvents({venue}: { venue: Venue}) {
    const events = venue.recurringEvents ?? [];
    return <div>
        {events.map((event, index) => <RecurringEventItem key={index} event={event}/>)}
    </div>
}



