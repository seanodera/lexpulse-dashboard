import {Venue} from "../data/types.ts";

export function VenueComponent({venue}: { venue: Venue }) {

    return <div>
        <img src={venue.poster} className={'aspect-square rounded-lg'}/>
        <h2>{venue.name}</h2>
        <p>{venue.street},{venue.city}</p>
    </div>
}