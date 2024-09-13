import {useEffect, useState} from 'react';
import {Button, DatePicker, Input, Select, Switch, TimePicker, Upload} from 'antd';
import {EventModel, EventType, Venue} from '../data/types';
import {RcFile} from 'antd/lib/upload';
import {generateVenues} from "../data/generator.ts";
import {faker} from "@faker-js/faker";
import {format} from "date-fns";
import {Textarea} from "@headlessui/react";
import {Formik, Field, Form, ErrorMessage, FormikErrors} from 'formik';
import * as Yup from 'yup';
import {FileImageOutlined} from "@ant-design/icons";

const {Option} = Select;

const CreateEventScreen = () => {
    const inputCls = 'block border-solid border-gray-500 placeholder-gray-300 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary text-current w-full';
    const [isNewVenue, setIsNewVenue] = useState(false);
    const [savedVenues, setSavedVenues] = useState<Venue[]>([]);
    const [currentVenue, setCurrentVenue] = useState<Venue | undefined>();
    const [immediate, setImmediate] = useState(true);
    const [eventStart, setEventStart] = useState(true);
    const [multiDay, setMultiDay] = useState(false);

    useEffect(() => {
        setSavedVenues(generateVenues(faker.number.int(40), {}));
    }, []);

    const EventSchema = Yup.object().shape({
        name: Yup.string().required('Event name is required'),
        poster: Yup.mixed().required('Event poster is required'),
        date: Yup.date().required('Event date is required'),
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

    const initialValues: EventModel = {
        name: '',
        poster: '',
        date: new Date(),
        location: '',
        price: 0,
        cover: '',
        id: '',
        description: '',
        category: EventType.Clubbing,
        tickets: [],
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
    };

    const handleImageUpload = (file: RcFile, setFieldValue: (field: string, value: string, shouldValidate?: boolean) => Promise<void | FormikErrors<EventModel>>, fieldName: string) => {
        setFieldValue(fieldName, URL.createObjectURL(file));
        return false; // Prevent default upload action
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={EventSchema}
            onSubmit={(values) => {
                console.log('Form values:', values);
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
                                    <Field name="name" as={Input} className={inputCls} placeholder="Event Name"/>
                                    <ErrorMessage name="name" component="div" className="text-red-500"/>
                                </div>
                                <div className={'flex gap-2'}>
                                    <Upload
                                        showUploadList={false}
                                        beforeUpload={(file) => handleImageUpload(file, setFieldValue, 'cover')}
                                    >
                                        <Button type={'default'} ghost>Change Cover</Button>
                                    </Upload>
                                    <Button type={'primary'} htmlType="submit">Save Changes</Button>
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
                                defaultValue={currentVenue?.id}
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
                                        const selectedVenue = savedVenues.find((v) => v.id === value);
                                        if (selectedVenue) {
                                            setCurrentVenue(selectedVenue);
                                            setFieldValue('venue', {
                                                name: selectedVenue.name,
                                                street: selectedVenue.street,
                                                city: selectedVenue.city,
                                                country: selectedVenue.country,
                                                district: selectedVenue.district,
                                                saved: true,
                                                id: selectedVenue.id,
                                            });
                                        }
                                    }
                                }}
                                className={'w-full'}
                                placeholder="Select Venue or Add New"
                                size={'large'}
                            >
                                {savedVenues.map((venue) => (
                                    <Option key={venue.id} value={venue.id}>
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
                                        <Field name="venue.country" as={Input} className={inputCls}
                                               placeholder="Country"/>
                                        <ErrorMessage name="venue.country" component="div" className="text-red-500"/>
                                    </div>
                                </>
                            )}
                            {currentVenue && !isNewVenue && <div className={'grid grid-cols-2 gap-8'}>
                                <div className={'col-span-2'}>
                                    <h4 className={'text-gray-500 font-medium'}>Venue Name</h4>
                                    <h3 className={'font-semibold'}>{currentVenue.name}</h3>
                                </div>
                                <div>
                                    <h4 className={'text-gray-500 font-medium'}>Venue Street</h4>
                                    <h3 className={'font-semibold'}>{currentVenue.street}</h3>
                                </div>
                                <div>
                                    <h4 className={'text-gray-500 font-medium'}>Venue District</h4>
                                    <h3 className={'font-semibold'}>{currentVenue.district}</h3>
                                </div>
                                <div>
                                    <h4 className={'text-gray-500 font-medium'}>Venue City</h4>
                                    <h3 className={'font-semibold'}>{currentVenue.city}</h3>
                                </div>
                                <div>
                                    <h4 className={'text-gray-500 font-medium'}>Venue Country</h4>
                                    <h3 className={'font-semibold'}>{currentVenue.country}</h3>
                                </div>


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
                        </div>
                        <div className={'rounded-lg p-4 space-y-4'}>
                            <h3 className={'text-lg font-semibold'}>Event Dates</h3>
                            <div>
                                <h4 className={'text-gray-500 font-medium'}>Event Start Date</h4>
                                <DatePicker
                                    format={'dddd MMM DD, YYYY'}
                                    className={inputCls}
                                    onChange={(value) => setFieldValue('date', new Date(value.toString()))}
                                />
                                <ErrorMessage name="date" component="div" className="text-red-500"/>
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
                                {multiDay ? <DatePicker format={'dddd MMM DD, YYYY'} className={inputCls}
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
                                <DatePicker
                                    disabled={immediate}
                                    format={'dddd MMM DD, YYYY'}
                                    className={inputCls}
                                    onChange={(value) => setFieldValue('startSalesDate', new Date(value.toString()))}
                                />
                            </div>
                            <div className={''}>
                                <h4 className={'text-gray-500 font-medium'}>End Ticket Sales</h4>
                                <div className={'flex justify-between my-1'}><h4 className={'text-sm'}>When Event
                                    starts</h4> <Switch
                                    value={eventStart} onChange={(value) => setEventStart(value)}/></div>
                                <DatePicker
                                    disabled={eventStart}
                                    format={'dddd MMM DD, YYYY'}
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


                    <div className={'grid grid-cols-2 gap-8 p-4'}>


                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default CreateEventScreen;