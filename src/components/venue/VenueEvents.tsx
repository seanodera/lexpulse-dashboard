import {Venue} from "../../data/types.ts";
import {useAppDispatch} from "../../hooks/hooks.ts";
import {useEffect} from "react";
import {getVenueEvents} from "../../data/slices/venueSlice.ts";
import LoadingScreen from "../LoadingScreen.tsx";
import {Button} from "antd";
import EventComponent from "../eventComponent.tsx";

export default function VenueEvents({venue}: { venue: Venue }) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!venue.events){
            dispatch(getVenueEvents(venue._id))
        }
    }, [venue]);

    if (!venue.events) {
        return <div>
            <LoadingScreen/>
        </div>
    }
    if (venue.events.length === 0) {
        return <div className={'text-center text-xl space-y-4 mt-16 font-semibold'}>
            <div>This Venue doesn't have any events yet</div>
            <Button type={'primary'}>Create Event</Button>
        </div>
    }
    return <div className={'grid grid-cols-4 gap-8'}>
        {venue.events.map((event) => <EventComponent key={event._id} event={event}/>)}
    </div>
}
