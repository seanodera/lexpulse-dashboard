import {Venue} from "../data/types.ts";


export default function VenueWidget({venue}:{venue: Venue}) {

    return <div className={'grid grid-cols-2 gap-8'}>
        <div className={'col-span-2'}>
            <h4 className={'text-gray-500 font-medium'}>Venue Name</h4>
            <h3 className={'font-semibold'}>{venue.name}</h3>
        </div>
        <div>
            <h4 className={'text-gray-500 font-medium'}>Venue Street</h4>
            <h3 className={'font-semibold'}>{venue.street}</h3>
        </div>
        <div>
            <h4 className={'text-gray-500 font-medium'}>Venue District</h4>
            <h3 className={'font-semibold'}>{venue.district}</h3>
        </div>
        <div>
            <h4 className={'text-gray-500 font-medium'}>Venue City</h4>
            <h3 className={'font-semibold'}>{venue.city}</h3>
        </div>
        <div>
            <h4 className={'text-gray-500 font-medium'}>Venue Country</h4>
            <h3 className={'font-semibold'}>{venue.country}</h3>
        </div>


        <div>
            <h4 className={'text-gray-500 font-medium'}>Venue Capacity</h4>
            <h3 className={'font-semibold'}>{venue.capacity} People</h3>
        </div>
        <div>
            <h4 className={'text-gray-500 font-medium'}>Venue Followers</h4>
            <h3 className={'font-semibold'}>{venue.followers}</h3>
        </div>
        <div>
            <h4 className={'text-gray-500 font-medium'}>Venue Email</h4>
            <h3 className={'font-semibold'}>{venue.email}</h3>
        </div>
        <div>
            <h4 className={'text-gray-500 font-medium'}>Venue Phone</h4>
            <h3 className={'font-semibold'}>{venue.phone}</h3>
        </div>

    </div>
}