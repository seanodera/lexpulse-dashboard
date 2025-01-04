import {VenueTableListingItem} from "./venueTableListing.tsx";
import {Venue} from "../../data/types.ts";


export default function VenueTables({venue}:{venue: Venue}) {
    const tables = venue.tables ?? [];
    return <div className={'grid grid-cols-3 gap-5'}>
        {tables.map((table,index) => <VenueTableListingItem key={index} table={table}/>)}
    </div>
}





