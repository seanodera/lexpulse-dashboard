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
            {
                venues.map((venue: Venue, index) => <VenueComponent key={index} venue={venue}/>)

            }
        </div>
    } else {
        return <div className={'w-full h-full flex flex-col items-center justify-center'}><h3>No venue Created</h3>
            <Link to={'/create-venue'}><Button type={'primary'}>Create A venue</Button></Link></div>
    }
}

