import {Button} from "antd";
import {Link} from "react-router-dom";
import {Venue} from "../data/types.ts";
import {useAppSelector} from "../hooks/hooks.ts";
import {selectVenues} from "../data/slices/venueSlice.ts";
import {VenueComponent} from "../components/venueComponent.tsx";


export default function ManageVenueScreen() {
    const venues = useAppSelector(selectVenues);

    if (venues.length > 0) {
        return <div className={'p-4'}>
            <div className={'flex justify-between items-center'}>
                <h3 className={'text-xl font-semibold mb-4'}>Your Registered Venues</h3>
                <Link to={'/create-venue'}><Button type={'primary'}>Create A venue</Button></Link>
            </div>
            <div className={'grid grid-cols-4 gap-8'}>
                {venues.map((venue: Venue, index) => <VenueComponent key={index} venue={venue}/>)}
           </div>
        </div>
    } else {
        return <div className={'w-full h-full flex flex-col items-center justify-center'}><h3>No venue Created</h3>
            <Link to={'/create-venue'}><Button type={'primary'}>Create A venue</Button></Link></div>
    }
}

