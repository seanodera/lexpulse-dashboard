import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../hooks/hooks.ts";
import {selectCurrentVenue, setFocusVenue} from "../data/slices/venueSlice.ts";
import LoadingScreen from "../components/LoadingScreen.tsx";
import {Button, Tabs} from "antd";


export default function SingleVenueScreen() {
    const id = useParams().id;
    const venue = useAppSelector(selectCurrentVenue)
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (id && (!venue || id !== venue._id)) {
            dispatch(setFocusVenue(id))
        }
    }, [id]);

    if (!venue) {
       return <div><LoadingScreen/></div>
    }
    return <div className={'p-4'}>
        <div className={'flex justify-between items-center mb-2'}>
            <h2 className={'text-2xl font-semibold'}>{venue.name}</h2>
            <Button type={'primary'} ghost>Edit Venue</Button>
        </div>
        <div className={'grid grid-cols-3 gap-8'}>
            <div>
                <img src={venue.poster} className={'aspect-square w-full rounded-lg'}/>
            </div>
            <div className={'col-span-2 grid grid-cols-4 gap-4'}>
                {venue.images.map((value) => <img src={value} key={value}
                                                  className={'rounded-lg aspect-square object-cover h-full'}/>)}
            </div>
        </div>
        <Tabs defaultActiveKey={'main'} items={[
            {
                key: 'main',
                label: 'Overview',
                children: <div className={'grid grid-cols-2 col-span-2 gap-8'}>
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
                </div>,
            },
            {
                key: 'events',
                label: 'Events',
                children: <div>Events</div>,
            },

        ]}/>


    </div>
}