import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {EventModel, EventType, Venue} from "../data/types.ts";
import {Button, DatePicker, Select, Tag, TimePicker, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {Input, Textarea} from "@headlessui/react";
import {format} from "date-fns";
import {RcFile} from "antd/lib/upload";
import {useAppDispatch, useAppSelector} from "../hooks/hooks.ts";
import {fetchEventById, selectFocusEvent, updateEventById} from "../data/slices/EventSlice.ts";
import dayjs from "dayjs";
import {countries} from "country-data";

const eventCategories = Object.keys(EventType);

export default function EditEventScreen() {
    const {id} = useParams();
    const inputCls = 'block border-solid border-gray-500 placeholder-gray-300 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary text-current w-full';
    const [isNewVenue, setIsNewVenue] = useState(false);
    const [savedVenues, setSavedVenues] = useState<Venue[]>([]);
    const [event, setEvent] = useState<EventModel>();
    const [currentVenue, setCurrentVenue] = useState<Venue | undefined>()


    const originalEvent = useAppSelector(selectFocusEvent);
    const dispatch = useAppDispatch();
    useEffect(() => {
        setSavedVenues([])
        if (id) {
            dispatch(fetchEventById(id))
        }

    }, [id])
    useEffect(() => {
        setEvent(originalEvent);
    }, [originalEvent]);
    useEffect(() => {

        // if (_event.venue.id) {
        //     const _currentVenue = generateVenues(1, {id: _event.venue.id})[ 0 ];
        //     _event.venue = {
        //         name: _currentVenue.name,
        //         street: _currentVenue.street,
        //         city: _currentVenue.city,
        //         country: _currentVenue.country,
        //         district: _currentVenue.district,
        //         saved: true,
        //         id: _currentVenue.id,
        //     }
        //     setCurrentVenue(_currentVenue);
        //     setSavedVenues([...generateVenues(faker.number.int(40), {}), _currentVenue])
        //
        //
        // } else {
        //     setSavedVenues(generateVenues(faker.number.int(40), {}));
        // }

    }, [id])


    if (!event) {
        return <div></div>
    }

    // Image upload handler
    const handleImageUpload = (file: RcFile) => {
        setEvent({...event, poster: URL.createObjectURL(file)})
        return false; // Prevent default upload action
    };
    return <div>
        <div className={'bg-cover bg-center bg-no-repeat shadow'} style={{
            backgroundImage: `url("${event.cover}")`
        }}>
            <div className={'py-8 px-16 backdrop-blur-sm bg-dark bg-opacity-60 text-white w-full '}>
                <div className={'flex justify-between items-center w-full'}>
                    <div className={'max-w-xl'}>
                        <h4 className={'text-gray-300 font-medium'}>Event Name</h4>
                        <Input className={inputCls} defaultValue={event.eventName}/>
                    </div>
                    <div className={'flex gap-2'}>
                        <Upload showUploadList={false}
                                beforeUpload={(file) => setEvent({...event, cover: URL.createObjectURL(file)})}><Button
                            type={'default'} ghost>Change Cover</Button></Upload>
                        <Button
                            hidden={JSON.stringify(event).toLowerCase() === JSON.stringify(originalEvent).toLowerCase()}
                            onClick={() => {
                                setEvent(originalEvent);
                            }} danger={true}>Reset</Button>
                        <Button
                            disabled={JSON.stringify(event).toLowerCase() === JSON.stringify(originalEvent).toLowerCase()}
                            type={'primary'} onClick={() => dispatch(updateEventById({id:event._id, eventData: event}))}>Save Changes</Button>
                    </div>
                </div>
                <div className={'grid grid-cols-4 mt-4 gap-8 w-full'}>
                    <Upload
                        beforeUpload={(file) => handleImageUpload(file)}
                        showUploadList={false}
                        className={'w-full'}
                        itemRender={(_originNode, file) => {

                            return <img src={URL.createObjectURL(file.originFileObj as File)}
                                        className={'w-full object-cover aspect-square rounded-lg'} alt={''}/>
                        }}
                    >
                        {event.poster ? (
                            <img src={event.poster} alt="poster"
                                 className="w-full aspect-square rounded-xl object-cover"/>
                        ) : (
                            <Button icon={<UploadOutlined/>}>Upload Poster</Button>
                        )}
                    </Upload>
                    <div className={'col-span-3 grid grid-cols-3 gap-4'}>
                        <div>
                            <h4>Event Date</h4>
                            <DatePicker showTime format={'dddd MMM DD, YYYY '} className={inputCls}
                                        value={dayjs(event.eventDate)} size={'large'}/>
                        </div>
                        <div className={'mt-3'}>
                            <h4 className={'text-gray-300 font-medium'}>Venue</h4>
                            <h3 className={'font-semibold mb-1 capitalize'}>{event.venue.name} </h3>
                            <p>{event.venue.street}, {event.venue.city}, {event.venue.country}</p>
                        </div>
                        <div>
                            <h4 className={'text-gray-300 font-medium'}>Create At</h4>
                            <h3 className={'font-semibold'}>{format(event.createdAt, 'EEE, dd MMM yyyy HH:mm')}</h3>
                            <h4 className={'text-gray-300 font-medium text-sm'}>{format(event.createdAt, 'EEE, dd MMM yyyy HH:mm')}</h4>

                        </div>
                        <div>
                            <h4 className={'text-gray-300 font-medium'}>Event Type</h4>
                            <select className={inputCls}>
                                {eventCategories.map((category: string) => (
                                    <option key={category}>{category}</option>))}
                            </select>
                        </div>
                        <div>
                            <h4 className={'text-gray-300 font-medium'}>Genre</h4>
                            <div className={'flex flex-wrap gap-1'}>
                                <Tag color={'processing'}>Rock</Tag>
                                <Tag color={'processing'}>hip-hop</Tag>

                            </div>
                        </div>
                        <div>
                            <h4 className={'text-gray-300 font-medium'}>End Ticket Sales</h4>
                            <div><DatePicker showTime format={'dddd MMM DD, YYYY '} className={inputCls}
                                             value={dayjs(event.endSalesDate)} size={'large'} onChange={(value) => {
                                                 setEvent({
                                                     ...event,
                                                     endSalesDate: value.toDate(),
                                                 });
                            }}/></div>
                        </div>
                        <div>
                            <h4 className={'text-gray-300 font-medium'}>Minimum Age</h4>
                            <Input className={inputCls} onChange={(value) => setEvent({...event, minAge:parseInt(value.target.value)})} type={'number'} min={0} placeholder={'18'}/>
                        </div>
                        <div>
                            <h4 className={'text-gray-300 font-medium'}>Dress Code</h4>
                            <Input className={inputCls} placeholder={'Casual'} onChange={(value) => setEvent({...event, dress: value.target.value})}/>
                        </div>
                        <div>
                            <h4 className={'text-gray-300 font-medium'}>Entry Closing</h4>
                            <TimePicker size={'large'} format={'HH:mm'} value={dayjs(event.lastEntry)}
                                        className={inputCls} onChange={(value) => {setEvent({...event, lastEntry: value.format('HH:mm')})}}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className={'grid grid-cols-2 gap-8 p-4'}>
            <div className={'bg-white rounded-lg p-4'}>
                <h2 className={'text-xl font-semibold mb-2'}>Description</h2>
                <Textarea value={event.description} onChange={(value) => setEvent({...event, description: value.target.value})} className={inputCls + ' h-[calc(100%-46px)]'}/>
            </div>
            <div className={'bg-white rounded-xl p-4 space-y-4'}>
                <h2 className={'text-xl font-semibold'}>Venue</h2>
                {/* Venue Selection */}
                <div>
                    <Select
                        defaultValue={currentVenue?.id}
                        onChange={(value) => {
                            if (value === 'new') {
                                setIsNewVenue(true);
                                setCurrentVenue(undefined);
                                setEvent({
                                    ...event,
                                    location: '',
                                    venue: {
                                        name: '',
                                        street: '',
                                        city: '',
                                        country: '',
                                        district: '',
                                        saved: false
                                    },
                                });
                            } else {
                                setIsNewVenue(false);
                                const selectedVenue = savedVenues.find((v) => v.id === value);
                                if (selectedVenue) {
                                    setCurrentVenue(selectedVenue);
                                    setEvent({
                                        ...event,
                                        location: `${selectedVenue.city}, ${selectedVenue.country}`,
                                        venue: {
                                            name: selectedVenue.name,
                                            street: selectedVenue.street,
                                            city: selectedVenue.city,
                                            country: selectedVenue.country,
                                            district: selectedVenue.district,
                                            saved: true,
                                            id: selectedVenue.id,
                                        },
                                    });
                                }
                            }
                        }}
                        showSearch
                        optionFilterProp="label"
                        className={'w-full'}
                        placeholder="Select Venue or Add New"
                        size={'large'}
                        filterOption={(input, option) => {
                            if (option?.label.toLowerCase().includes(input.toLowerCase())) {
                                return true;
                            } else if (option?.value === 'new') {
                                return true;
                            }
                            return false;
                        }
                        }
                        options={[
                            ...savedVenues.map((venue) => ({
                                label: venue.name + ' - ' + venue.city + ', ' + venue.country,
                                value: venue.id,
                            })),
                            {
                                label: 'Add New Venue',
                                value: 'new', // Always include "Add New Venue" option
                            },
                        ]}
                    />

                </div>

                {(isNewVenue || !event.venue.saved) && (
                    <>
                        <div>
                            <label className={'block font-semibold'} htmlFor="venue.name">Venue Name</label>
                            <Input className={inputCls} name="venue.name" value={event.venue.name}
                                   onChange={(value) => setEvent({
                                       ...event,
                                       venue: {...event.venue, name: value.target.value,}
                                   })}
                                   placeholder="Enter Venue Name"/>
                            {/*<ErrorMessage name="venue.name" component="div" className="text-red-500"/>*/}
                        </div>
                        <div>
                            <label className={'block font-semibold'} htmlFor="venue.street">Street</label>
                            <Input className={inputCls} name="venue.street" value={event.venue.street}
                                   onChange={(value) => setEvent({
                                       ...event,
                                       venue: {...event.venue, street: value.target.value,}
                                   })}
                                   placeholder="Enter Street"/>
                            {/*<ErrorMessage name="venue.street" component="div" className="text-red-500"/>*/}
                        </div>
                        <div>
                            <label className={'block font-semibold'} htmlFor="venue.street">District</label>
                            <Input className={inputCls} name="venue.distict" value={event.venue.street}
                                   onChange={(value) => setEvent({
                                       ...event,
                                       venue: {...event.venue, district: value.target.value,}
                                   })}
                                   placeholder="Enter District"/>
                            {/*<ErrorMessage name="venue.street" component="div" className="text-red-500"/>*/}
                        </div>
                        <div>
                            <label className={'block font-semibold'} htmlFor="venue.city">City</label>
                            <Input className={inputCls} name="venue.city" value={event.venue.city}
                                   onChange={(value) => setEvent({
                                       ...event,
                                       venue: {...event.venue, city: value.target.value,}
                                   })}
                                   placeholder="Enter City"/>
                            {/*<ErrorMessage name="venue.city" component="div" className="text-red-500"/>*/}
                        </div>
                        <div>
                            <label className={'block font-semibold'} htmlFor="venue.country">Country</label>
                            <Select  className={inputCls}
                                    onChange={(e) => {
                                        setEvent({
                                            ...event,
                                            country: countries[ e.target.value ].name,
                                            currency: countries[ e.target.value ].currencies[ 0 ],
                                            venue: {...event.venue, country: countries[ e.target.value ].name,}
                                        })
                                    }}>
                                <option value={'GH'}>{countries[ 'GH' ].name}</option>
                                <option value={'KE'}>{countries[ 'KE' ].name}</option>

                            </Select>

                            {/*<ErrorMessage name="venue.country" component="div" className="text-red-500"/>*/}
                        </div>
                    </>
                )}

                {currentVenue && !isNewVenue && <div className={'grid grid-cols-2 gap-8'}>
                    <div className={'col-span-2'}>
                        <h4 className={'text-gray-500 font-medium'}>Venue Name</h4>
                        <h3 className={'font-semibold'}>{event.venue.name}</h3>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-medium'}>Venue Street</h4>
                        <h3 className={'font-semibold'}>{event.venue.street}</h3>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-medium'}>Venue District</h4>
                        <h3 className={'font-semibold'}>{event.venue.district}</h3>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-medium'}>Venue City</h4>
                        <h3 className={'font-semibold'}>{event.venue.city}</h3>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-medium'}>Venue Country</h4>
                        <h3 className={'font-semibold'}>{event.venue.country}</h3>
                    </div>
                    {currentVenue && <div className={'col-span-2 grid grid-cols-2 gap-8'}>

                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Venue Capacity</h4>
                            <h3 className={'font-semibold'}>{currentVenue.capacity} People</h3>
                        </div>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Venue Followers</h4>
                            <h3 className={'font-semibold'}>{currentVenue.followers}</h3>
                        </div>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Venue Email</h4>
                            <h3 className={'font-semibold'}>{currentVenue.email}</h3>
                        </div>
                        <div>
                            <h4 className={'text-gray-500 font-medium'}>Venue Phone</h4>
                            <h3 className={'font-semibold'}>{currentVenue.phone}</h3>
                        </div>
                    </div>}
                </div>}
            </div>

        </div>
    </div>
}







