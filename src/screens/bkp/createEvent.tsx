import { useState } from 'react';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { Button, DatePicker, Input, InputNumber, message, Select } from 'antd';
import * as Yup from 'yup';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
    EventModel,
    EventType,
    Venue
} from '../../data/types'; // assuming you import the types correctly

const { TextArea } = Input;
const { Option } = Select;

const eventCategories = Object.keys(EventType);

const CreateEventScreen = (): JSX.Element => {
    const [isNewVenue, setIsNewVenue] = useState(false);
    const savedVenues: Venue[] = [];

    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Event Name is required'),
        description: Yup.string().required('Description is required'),
        date: Yup.date().required('Event Date is required').nullable(),
        category: Yup.string().required('Category is required'),
        price: Yup.number().min(1, 'Event price must be at least $1').required('Price is required'),
        tickets: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Ticket name is required'),
                price: Yup.number().required('Ticket price is required').min(0, 'Price cannot be negative'),
                stock: Yup.number().min(1, 'At least 1 ticket must be available').required('Stock is required'),
            })
        ),
        venue: Yup.object().shape({
            name: Yup.string().required('Venue name is required'),
            street: Yup.string().when('saved', (saved, schema) =>
                saved[0] === false ? schema.required('Street is required for new venues') : schema
            ),
            city: Yup.string().when('saved', (saved, schema) =>
                saved[0] === false ? schema.required('City is required for new venues') : schema
            ),
            country: Yup.string().when('saved', (saved, schema) =>
                saved[0] === false ? schema.required('Country is required for new venues') : schema
            )
        })
    });


// Initial values for the form
    const initialValues: EventModel = {
        name: '',
        poster: '',
        date: new Date(),
        location: '',
        price: 10,
        cover: '',
        id: '',
        description: '',
        category: EventType.Concerts,
        tickets: [
            {
                id: '',
                name: '',
                price: 0,
                stock: 10,
                sold: 0,
                saleStart: new Date(),
                saleEnd: new Date(),
            },
        ],
        discount: [],
        venue: {
            name: '',
            street: '',
            city: '',
            country: '',
            saved: false,
            district: ''
        },
        createdAt: new Date(),
        minAge: 0,
        dress: ''
    };

    // Submit function
    const onSubmit = (values: EventModel) => {
        console.log('Event Data:', values);
        message.success('Event created successfully!');
    };

    return (
        <div className="px-4 py-4">
            <h2 className="text-2xl mb-4">Create New Event</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="space-y-4">
                        {/* Event Name */}
                        <div>
                            <label htmlFor="name">Event Name</label>
                            <Field name="name" as={Input} placeholder="Enter Event Name" />
                            <ErrorMessage name="name" component="div" className="text-red-500" />
                        </div>
                        {/* Event Description */}
                        <div>
                            <label htmlFor="description">Description</label>
                            <Field name="description" as={TextArea} rows={4} placeholder="Enter Event Description" />
                            <ErrorMessage name="description" component="div" className="text-red-500" />
                        </div>
                        {/* Event Category */}
                        <div>
                            <label htmlFor="category">Category</label>
                            <Field name="category" as={Select} placeholder="Select Event Category">
                                {eventCategories.map((category) => (
                                    <Option key={category} value={category}>
                                        {category}
                                    </Option>
                                ))}
                            </Field>
                            <ErrorMessage name="category" component="div" className="text-red-500" />
                        </div>
                        {/* Event Date */}
                        <div>
                            <label htmlFor="date">Event Date</label>
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                value={values.date ? moment(values.date) : null}
                                onChange={(date) => setFieldValue('date', date ? date.toDate() : null)}
                                style={{ width: '100%' }}
                            />
                            <ErrorMessage name="date" component="div" className="text-red-500" />
                        </div>
                        {/* Venue Selection */}
                        <div>
                            <label htmlFor="venue">Venue</label>
                            <Select
                                onChange={(value) => {
                                    if (value === 'new') {
                                        setIsNewVenue(true);
                                    } else {
                                        setIsNewVenue(false);
                                        const selectedVenue = savedVenues.find((v) => v.id === value);
                                        setFieldValue('venue', { ...selectedVenue, saved: true });
                                    }
                                }}
                                placeholder="Select Venue or Add New"
                            >
                                {savedVenues.map((venue) => (
                                    <Option key={venue.id} value={venue.id}>
                                        {venue.name} - {venue.city}, {venue.country}
                                    </Option>
                                ))}
                                <Option value="new">Add New Venue</Option>
                            </Select>
                        </div>
                        {isNewVenue && (
                            <>
                                <div>
                                    <label htmlFor="venue.name">Venue Name</label>
                                    <Field name="venue.name" as={Input} placeholder="Enter Venue Name" />
                                    <ErrorMessage name="venue.name" component="div" className="text-red-500" />
                                </div>
                                <div>
                                    <label htmlFor="venue.street">Street</label>
                                    <Field name="venue.street" as={Input} placeholder="Enter Street" />
                                    <ErrorMessage name="venue.street" component="div" className="text-red-500" />
                                </div>
                                <div>
                                    <label htmlFor="venue.city">City</label>
                                    <Field name="venue.city" as={Input} placeholder="Enter City" />
                                    <ErrorMessage name="venue.city" component="div" className="text-red-500" />
                                </div>
                                <div>
                                    <label htmlFor="venue.country">Country</label>
                                    <Field name="venue.country" as={Input} placeholder="Enter Country" />
                                    <ErrorMessage name="venue.country" component="div" className="text-red-500" />
                                </div>
                            </>
                        )}
                        {/* Ticket Information */}
                        <FieldArray name="tickets">
                            {({ push, remove }) => (
                                <>
                                    {values.tickets.map((_ticket, index) => (
                                        <div key={index} className="space-y-2">
                                            <h3 className="text-lg">Ticket {index + 1}</h3>
                                            <div>
                                                <label htmlFor={`tickets[${index}].name`}>Ticket Name</label>
                                                <Field name={`tickets[${index}].name`} as={Input} placeholder="Enter Ticket Name" />
                                                <ErrorMessage name={`tickets[${index}].name`} component="div" className="text-red-500" />
                                            </div>
                                            <div>
                                                <label htmlFor={`tickets[${index}].price`}>Price</label>
                                                <Field name={`tickets[${index}].price`} as={InputNumber} min={1} style={{ width: '100%' }} />
                                                <ErrorMessage name={`tickets[${index}].price`} component="div" className="text-red-500" />
                                            </div>
                                            <div>
                                                <label htmlFor={`tickets[${index}].stock`}>Stock</label>
                                                <Field name={`tickets[${index}].stock`} as={InputNumber} min={1} style={{ width: '100%' }} />
                                                <ErrorMessage name={`tickets[${index}].stock`} component="div" className="text-red-500" />
                                            </div>
                                            <Button danger onClick={() => remove(index)}>
                                                Remove Ticket
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="dashed"
                                        onClick={() =>
                                            push({
                                                id: '',
                                                name: '',
                                                price: 0,
                                                stock: 10,
                                                sold: 0,
                                                saleStart: new Date(),
                                                saleEnd: new Date(),
                                            })
                                        }
                                    >
                                        <PlusOutlined /> Add Ticket
                                    </Button>
                                </>
                            )}
                        </FieldArray>
                        <div>
                            <Button type="primary" htmlType="submit">
                                Create Event
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreateEventScreen;