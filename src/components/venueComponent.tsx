import {Venue} from "../data/types.ts";
import {Card} from "antd";
import {Link} from "react-router-dom";

export function VenueComponent({venue}: { venue: Venue }) {

    return <Link to={`/manage-venue/${venue._id}`}>
        <Card classNames={{body: 'p-2'}}>
            <img src={venue.poster} className={'aspect-square rounded-lg'}/>
            <h2 className={'text-lg font-semibold leading-none mt-2'}>{venue.name}</h2>
            <h3 className={'text-primary font-medium leading-none my-0'}>{venue.type}</h3>
            <span className={'text-gray-500 leading-none'}>{venue.street},{venue.city}</span>
        </Card>
    </Link>
}