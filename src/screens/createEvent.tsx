import {useState} from 'react';
import {Button, DatePicker, Input, Select, Switch, TimePicker, Upload} from 'antd';
import {EventModel, EventType, Ticket, Venue} from '../data/types';
import {RcFile} from 'antd/lib/upload';
import {format} from "date-fns";
import {Textarea} from "@headlessui/react";
import {ErrorMessage, Field, FieldArray, Form, Formik, FormikErrors} from 'formik';
import * as Yup from 'yup';
import {FileImageOutlined, PlusOutlined} from "@ant-design/icons";
import VenueWidget from "../components/venueWidget.tsx";
import {useAppDispatch, useAppSelector} from "../hooks/hooks.ts";
import {createEvent} from "../data/slices/EventSlice.ts";
import {useNavigate} from "react-router-dom";
import {countries} from "country-data";
import {selectCurrentUser} from "../data/slices/authSlice.ts";
import {searchVenues, selectSearchedVenues} from "../data/slices/venueSlice.ts";


const {Option} = Select;

const CreateEventScreen = () => {
    const inputCls = 'block border-solid border-gray-500 placeholder-gray-300 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary text-current w-full';
    const [isNewVenue, setIsNewVenue] = useState(false);
    const savedVenues = useAppSelector(selectSearchedVenues);
    const [currentVenue, setCurrentVenue] = useState<Venue | undefined>();
    const [immediate, setImmediate] = useState(true);
    const [eventStart, setEventStart] = useState(true);
    const [multiDay, setMultiDay] = useState(false);
    const dispatch = useAppDispatch();


    const EventSchema = Yup.object().shape({
        eventName: Yup.string().required('Event name is required'),
        poster: Yup.mixed().required('Event poster is required'),
        eventDate: Yup.date().required('Event date is required'),
        category: Yup.string().required('Event type is required'),
        description: Yup.string().required('Event description is required'),
        minAge: Yup.number().min(0, 'Age cannot be negative').required('Minimum age is required'),
        dress: Yup.string().required('Dress code is required'),
        lastEntry: Yup.string().required('Last entry time is required'),
        venue: Yup.object({
            name: Yup.string().required('Venue name is required'),
            street: Yup.string().required('Street is required'),
            city: Yup.string().required('City is required'),
            country: Yup.string().required('Country is required'),
        }),
    });
    const user = useAppSelector(selectCurrentUser);
    const initialValues: EventModel = {
        image: [], revenue: 0, ticketSales: 0, viewCount: 0, weightedRating: 0,
        eventHostId: user?.id || '',
        eventName: '',
        poster: '',
        eventDate: new Date(),
        location: '',
        cover: '',
        _id: '',
        description: '',
        category: EventType.Clubbing,
        ticketInfo: [],
        createdAt: new Date(),
        minAge: 18,
        dress: '',
        venue: {
            name: '',
            street: '',
            city: '',
            country: '',
            district: '',
            saved: false
        },
        startSalesDate: new Date(),
        endSalesDate: new Date(),
        eventEnd: '',
        country: 'Ghana',
        currency: 'GHS',
        approved: false,
        scanners:[]
    };

    const handleImageUpload = (file: RcFile, setFieldValue: (field: string, value: string, shouldValidate?: boolean) => Promise<void | FormikErrors<EventModel>>, fieldName: string) => {
        setFieldValue(fieldName, URL.createObjectURL(file));
        return false; // Prevent default upload action
    };
    const navigation = useNavigate();

    function handleSubmit(values: EventModel) {
        console.log(values);
        dispatch(createEvent(values)).then((action) => {
            console.log(action);
            if (action.meta.requestStatus === 'fulfilled') {
                navigation('/manage-events');
            }
        });
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={EventSchema}
            onSubmit={(values) => {
                handleSubmit(values);

            }}

        >
            {({setFieldValue, values}) => (
                <Form>
                    <div className={'bg-cover bg-center bg-no-repeat shadow'} style={{
                        backgroundImage: `url("${values.cover}")`
                    }}>
                        <div className={'py-8 px-16 backdrop-blur-sm bg-dark bg-opacity-60 text-white w-full'}>
                            <div className={'flex justify-between items-center w-full'}>
                                <div className={'max-w-xl'}>
                                    <h4 className={'text-gray-300 font-medium'}>Event Name</h4>
                                    <Field name="eventName" as={Input} className={inputCls} placeholder="Event Name"/>
                                    <ErrorMessage name="eventName" component="div" className="text-red-500"/>
                                </div>
                                <div className={'flex gap-2'}>
                                    <Upload
                                        showUploadList={false}
                                        beforeUpload={(file) => handleImageUpload(file, setFieldValue, 'cover')}
                                    >
                                        <Button type={'default'} ghost>Change Cover</Button>
                                    </Upload>
                                    <Button typeof={'submit'} type={'primary'} htmlType="submit">Save Changes</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={'grid grid-cols-3 gap-8'}>
                        <div className={'rounded-lg p-4'}>
                            <h3 className={'font-semibold text-lg'}>Poster Image</h3>
                            <div className={'max-w-sm'}>
                                <Upload
                                    beforeUpload={(file) => handleImageUpload(file, setFieldValue, 'poster')}
                                    showUploadList={false}
                                    className={'w-full'}
                                    itemRender={(_originNode, file) => {
                                        return <img src={URL.createObjectURL(file.originFileObj as File)}
                                                    className={'w-full aspect-square rounded-lg'} alt={''}/>
                                    }}
                                >
                                    {values.poster ? (
                                        <img src={values.poster} alt="poster"
                                             className="w-full aspect-square rounded-xl"/>
                                    ) : (
                                        <div
                                            className={'border border-dashed border-primary rounded-lg aspect-square w-full flex flex-col justify-center items-center p-16'}>

                                            <div className={'text-primary text-center'}>
                                                <FileImageOutlined/>
                                                <h3>Select A Poster (1:1)</h3>
                                            </div>
                                        </div>
                                    )}
                                </Upload>
                            </div>
                        </div>
                        <div className={'rounded-lg p-4'}>
                            <h2 className={'text-xl font-semibold mb-2'}>Description</h2>
                            <Field name="description" as={Textarea} className={inputCls + ' h-[calc(100%-46px)]'}/>
                            <ErrorMessage name="description" component="div" className="text-red-500"/>
                        </div>
                        <div className={'rounded-xl p-4 space-y-4'}>
                            <h2 className={'text-xl font-semibold'}>Venue</h2>
                            <Select
                                defaultValue={currentVenue?._id}
                                onChange={(value) => {
                                    if (value === 'new') {
                                        setIsNewVenue(true);
                                        setCurrentVenue(undefined);
                                        setFieldValue('venue', {
                                            name: '',
                                            street: '',
                                            city: '',
                                            country: '',
                                            district: '',
                                            saved: false
                                        });
                                    } else {
                                        setIsNewVenue(false);
                                        const selectedVenue = savedVenues.find((v) => v._id === value);
                                        if (selectedVenue) {
                                            setCurrentVenue(selectedVenue);
                                            setFieldValue('venue', {
                                                name: selectedVenue.name,
                                                street: selectedVenue.street,
                                                city: selectedVenue.city,
                                                country: selectedVenue.country,
                                                district: selectedVenue.district,
                                                saved: true,
                                                id: selectedVenue._id,
                                            });
                                        }
                                    }
                                }}
                                className={'w-full'}
                                placeholder="Select Venue or Add New"
                                size={'large'}
                                onSearch={(value) => dispatch(searchVenues(value))}
                                showSearch={true}
                            >
                                {savedVenues.map((venue) => (
                                    <Option key={venue._id} value={venue._id}>
                                        {venue.name} - {venue.city}, {venue.country}
                                    </Option>
                                ))}
                                <Option value="new">Add New Venue</Option>
                            </Select>

                            {isNewVenue && (
                                <>
                                    <div>
                                        <label className={'text-gray-500 font-medium'} htmlFor="venue.name">Venue
                                            Name</label>
                                        <Field name="venue.name" as={Input} className={inputCls}
                                               placeholder="Enter Venue Name"/>
                                        <ErrorMessage name="venue.name" component="div" className="text-red-500"/>
                                    </div>
                                    <div>
                                        <label className={'text-gray-500 font-medium'}
                                               htmlFor="venue.street">Street</label>
                                        <Field name="venue.street" as={Input} className={inputCls}
                                               placeholder="Street"/>
                                        <ErrorMessage name="venue.street" component="div" className="text-red-500"/>
                                    </div>
                                    <div>
                                        <label className={'text-gray-500 font-medium'} htmlFor="venue.city">City</label>
                                        <Field name="venue.city" as={Input} className={inputCls} placeholder="City"/>
                                        <ErrorMessage name="venue.city" component="div" className="text-red-500"/>
                                    </div>
                                    <div>
                                        <label className={'text-gray-500 font-medium'}
                                               htmlFor="venue.country">Country</label>
                                        <select name={'venue.country'} className={inputCls}
                                                onChange={(e) => {
                                                    setFieldValue('country', countries[ e.target.value ].name);
                                                    setFieldValue('currency', countries[ e.target.value ].currencies[ 0 ])
                                                    setFieldValue('venue.country',countries[ e.target.value ].name)
                                                    console.log(values)
                                                }}>
                                            <option value={'GH'}>{countries[ 'GH' ].name}</option>
                                            <option value={'KE'}>{countries[ 'KE' ].name}</option>

                                        </select>
                                        {/*<Field name="venue.country" as={Input} className={inputCls}*/}
                                        {/*       placeholder="Country"/>*/}
                                        <ErrorMessage name="venue.country" component="div" className="text-red-500"/>
                                    </div>
                                </>
                            )}
                            {currentVenue && !isNewVenue && <VenueWidget venue={currentVenue}/>}
                        </div>
                        <div className={'rounded-lg p-4 space-y-4'}>
                            <h3 className={'text-lg font-semibold'}>Event Dates</h3>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Event Start Date</h4>
                                <DatePicker
                                    format={'dddd MMM DD, YYYY, HH:mm'}
                                    className={inputCls}
                                    showTime
                                    onChange={(value) => setFieldValue('eventDate', new Date(value.toString()))}
                                />
                                <ErrorMessage name="eventDate" component="div" className="text-red-500"/>
                            </div>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Event Last Entry</h4>
                                <TimePicker
                                    format={'HH:mm'}
                                    className={inputCls}
                                    onChange={(value) => setFieldValue('lastEntry', format(value.toString(), 'HH:mm'))}
                                />
                                <ErrorMessage name="lastEntry" component="div" className="text-red-500"/>
                            </div>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Event End Date</h4>
                                <div className={'flex justify-between mb-1'}>
                                    <h4 className={'text-sm'}>MultiDay</h4>
                                    <Switch value={multiDay} onChange={(value) => setMultiDay(value)}/>
                                </div>
                                {multiDay ? <DatePicker showTime format={'dddd MMM DD, YYYY'} className={inputCls}
                                                        onChange={(value) => setFieldValue('eventEnd', format(value.toString(), 'HH:mm'))}/> :
                                    <TimePicker format={'HH:mm'} className={inputCls}
                                                onChange={(value) => setFieldValue('eventEnd', format(value.toString(), 'HH:mm'))}/>}
                            </div>
                        </div>
                        <div className={'rounded-lg space-y-4 p-4'}>
                            <h3 className={'text-lg font-semibold'}>Ticket Sales</h3>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Sale Start</h4>
                                <div className={'flex justify-between my-1'}>
                                    <h4 className={'text-sm'}>Start Immediately</h4>
                                    <Switch value={immediate} onChange={(value) => setImmediate(value)}/>
                                </div>
                                <DatePicker showTime
                                    disabled={immediate}
                                    format={'dddd MMM DD, YYYY,  HH:mm'}
                                    className={inputCls}
                                    onChange={(value) => setFieldValue('startSalesDate', new Date(value.toString()))}
                                />
                            </div>
                            <div className={''}>
                                <h4 className={'text-gray-500 font-medium'}>End Ticket Sales</h4>
                                <div className={'flex justify-between my-1'}><h4 className={'text-sm'}>When Event
                                    starts</h4> <Switch
                                    value={eventStart} onChange={(value) => setEventStart(value)}/></div>
                                <DatePicker showTime
                                    disabled={eventStart}
                                    format={'dddd MMM DD, YYYY, HH:mm'}
                                    className={inputCls}
                                    onChange={(value) => setFieldValue('endTicketSales', new Date(value.toString()))}
                                />
                                <ErrorMessage name="endTicketSales" component="div" className="text-red-500"/>
                            </div>
                        </div>
                        <div className={'rounded-lg space-y-4 p-4'}>
                            <h3 className={'text-lg font-semibold'}>Event Details</h3>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Event Type</h4>
                                <Field name="category" as="select" className={inputCls}>
                                    {Object.keys(EventType).map((category: string) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="category" component="div" className="text-red-500"/>
                            </div>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Minimum Age</h4>
                                <Field name="minAge" type="number" as={Input} className={inputCls} min={0}/>
                                <ErrorMessage name="minAge" component="div" className="text-red-500"/>
                            </div>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Dress Code</h4>
                                <Field name="dress" as={Input} className={inputCls} placeholder="Casual"/>
                                <ErrorMessage name="dress" component="div" className="text-red-500"/>
                            </div>
                        </div>
                    </div>


                    {/* Tickets Section */}
                    <div className={'bg-white p-4 space-y-4 my-8'}>
                        <div className={'flex justify-between'}>
                            <h1 className={'text-2xl'}>Tickets</h1>
                            <Button type={'primary'} ghost onClick={() => {
                                setFieldValue('ticketInfo', [
                                    ...values.ticketInfo,
                                    {id: Date.now().toString(), name: '', price: 0, ticketsAvailable: 0,ticketsLeft: 0, sold: 0},
                                ]);
                            }}>
                                <PlusOutlined/> Add Ticket
                            </Button>
                        </div>

                        <FieldArray name="ticketInfo">
                            {({remove}) => (
                                <div className={'grid grid-cols-3 gap-8'}>
                                    {values.ticketInfo.map((_ticket: Ticket, index: number) => {

                                        return (
                                            <fieldset key={index} className={'space-y-2'}>
                                                <div className={'flex items-center justify-between'}>
                                                    <h3 className={'font-semibold'}>Ticket {index + 1}</h3>
                                                    <Button danger onClick={() => remove(index)}>
                                                        Remove Ticket
                                                    </Button>
                                                </div>
                                                <Field name={`ticketInfo[${index}].ticketType`}>
                                                    {({field}:any) => (
                                                        <div>
                                                            <label className={'block font-semibold'}>Name</label>
                                                            <input {...field} placeholder="Ticket Name"
                                                                   className={inputCls}/>
                                                        </div>
                                                    )}
                                                </Field>
                                                <Field name={`ticketInfo[${index}].price`}>
                                                    {({field}: any ) => (
                                                        <div>
                                                            <label className={'block font-semibold'}>Price</label>
                                                            <input {...field} type="number" placeholder="Price"
                                                                   className={inputCls} min={1}/>
                                                        </div>
                                                    )}
                                                </Field>
                                                <Field name={`ticketInfo[${index}].ticketsAvailable`}>
                                                    {({field}: any) => (
                                                        <div>
                                                            <label className={'block font-semibold'}>Stock</label>
                                                            <input {...field} type="number" placeholder="Stock"
                                                                   className={inputCls} min={1}/>
                                                        </div>
                                                    )}
                                                </Field>
                                                <div>
                                                    <h3 className={'font-semibold'}>Sales End</h3>
                                                    <div className={'flex justify-between mb-1'}><h4
                                                        className={'text-sm'}>Global</h4> <Switch /></div>
                                                    <DatePicker showTime format={'dddd MMM DD, YYYY,  HH:mm'}
                                                                className={inputCls} onChange={(value) => setFieldValue(`ticketInfo[${index}].salesEnd`,value.toString())}/>
                                                </div>
                                            </fieldset>
                                        );
                                    })}
                                </div>
                            )}
                        </FieldArray>
                    </div>
                </Form>
            )}
        </Formik>
    );
};


export default CreateEventScreen;