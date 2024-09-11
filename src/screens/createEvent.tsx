import {useState} from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {Button, DatePicker, Input, message, Select, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import * as Yup from 'yup';
import {EventType, Venue} from '../data/types';
import {RcFile} from 'antd/es/upload'; // Correct import path

// List of event categories based on EventType
const eventCategories = Object.keys(EventType);

// Validation schema using Yup
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Event Name is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.date().required('Event Date is required').nullable(),
    category: Yup.string().required('Category is required'),
    tickets: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Ticket name is required'),
            price: Yup.number().required('Ticket price is required').min(1, 'Price cannot be less than $1'),
            stock: Yup.number().required('Stock is required').min(1, 'Stock cannot be less than 1'),
        })
    ),
});

const CreateEventScreen = () => {
    const inputCls = 'mt-1 block border-solid border-gray-500 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary w-full';
    const [isNewVenue, setIsNewVenue] = useState(false);
    const savedVenues: Venue[] = []; // Initialized inside the function

    // Form submit handler
    const handleSubmit = (values: any) => {
        console.log('Form values:', values);
        message.success('Event created successfully!');
    };

    // Image upload handler
    const handleImageUpload = (file: RcFile, setFieldValue: any, fieldName: string) => {
        const reader = new FileReader();
        reader.onload = () => {
            setFieldValue(fieldName, reader.result); // Set base64 encoded image to the form field
        };
        reader.readAsDataURL(file);
        return false; // Prevent default upload action
    };

    return (
        <div className="px-4 py-4">
            <Formik
                initialValues={{
                    name: '',
                    description: '',
                    category: eventCategories[0],
                    date: null,
                    poster: '',
                    cover: '',
                    tickets: [],
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center w-full">
                                <h2 className="text-2xl font-semibold mb-4">Create New Event</h2>
                                <div className="flex gap-2">
                                    <Button type="primary">Preview</Button>
                                    <Button type="primary" htmlType="submit">
                                        Create Event
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-8">
                            <div>
                                <h3 className="font-semibold text-lg">Poster Image</h3>
                                <Upload
                                    beforeUpload={(file) => handleImageUpload(file, setFieldValue, 'poster')}
                                    showUploadList={false}
                                    itemRender={(_originNode, file) => {
                                        return <img src={URL.createObjectURL(file.originFileObj as File)} className="w-full aspect-[0.5] rounded-lg" alt="" />;
                                    }}
                                >
                                    {values.poster ? (
                                        <img src={values.poster} alt="poster" className="w-full aspect-square rounded-xl" />
                                    ) : (
                                        <Button icon={<UploadOutlined />}>Upload Poster</Button>
                                    )}
                                </Upload>
                            </div>
                            <div className="col-span-2 px-4">
                                <h4 className="font-semibold text-lg">Cover Image</h4>
                                <Upload
                                    beforeUpload={(file) => handleImageUpload(file, setFieldValue, 'cover')}
                                    showUploadList={false}
                                    rootClassName="w-full"
                                    itemRender={(_originNode, file) => {
                                        return <img src={URL.createObjectURL(file.originFileObj as File)} className="w-full aspect-[0.5] rounded-lg" alt="" />;
                                    }}
                                >
                                    {values.cover ? (
                                        <img src={values.cover} alt="cover" className="w-full aspect-[2] rounded-xl" />
                                    ) : (
                                        <Button icon={<UploadOutlined />}>Upload Cover</Button>
                                    )}
                                </Upload>
                            </div>
                        </div>
                        <fieldset className="grid grid-cols-2 gap-8">
                            <div className="bg-white rounded-xl p-4 space-y-4">
                                <h1 className="text-2xl">Event Details</h1>
                                {/* Event Name */}
                                <Field name="name">
                                    {({ field }: any) => (
                                        <div>
                                            <label htmlFor="name" className="block font-semibold">
                                                Event Name
                                            </label>
                                            <input {...field} placeholder="Enter Event Name" className={inputCls} />
                                            <ErrorMessage name="name" component="div" className="text-red-500" />
                                        </div>
                                    )}
                                </Field>
                                {/* Event Description */}
                                <Field name="description">
                                    {({ field }: any) => (
                                        <div>
                                            <label htmlFor="description" className="block font-semibold">
                                                Description
                                            </label>
                                            <textarea {...field} rows={4} placeholder="Enter Event Description" className={inputCls} />
                                            <ErrorMessage name="description" component="div" className="text-red-500" />
                                        </div>
                                    )}
                                </Field>
                                {/* Event Category */}
                                <Field name="category" as="select" className={inputCls}>
                                    {eventCategories.map((category: string) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </Field>
                                {/* Event Date */}
                                <Field name="date">
                                    {({ field, form }: any) => (
                                        <div>
                                            <label htmlFor="date">Event Date</label>
                                            <DatePicker
                                                showTime
                                                format="YYYY-MM-DD HH:mm"
                                                onChange={(date) => form.setFieldValue(field.name, date)}
                                                className="w-full"
                                            />
                                            <ErrorMessage name="date" component="div" className="text-red-500" />
                                        </div>
                                    )}
                                </Field>
                            </div>
                            <div className="bg-white rounded-xl p-4 space-y-4">
                                {/* Venue Selection */}
                                <div>
                                    <label className="block font-semibold" htmlFor="venue">
                                        Venue
                                    </label>
                                    <Select
                                        onChange={(value: any) => {
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
                                            <Select.Option key={venue.id} value={venue.id}>
                                                {venue.name} - {venue.city}, {venue.country}
                                            </Select.Option>
                                        ))}
                                        <Select.Option value="new">Add New Venue</Select.Option>
                                    </Select>
                                </div>
                                {isNewVenue && (
                                    <>
                                        <div>
                                            <label className="block font-semibold" htmlFor="venue.name">
                                                Venue Name
                                            </label>
                                            <Field className={inputCls} name="venue.name" as={Input} placeholder="Enter Venue Name" />
                                            <ErrorMessage name="venue.name" component="div" className="text-red-500" />
                                        </div>
                                        <div>
                                            <label className="block font-semibold" htmlFor="venue.street">
                                                Street
                                            </label>
                                            <Field className={inputCls} name="venue.street" as={Input} placeholder="Enter Street" />
                                            <ErrorMessage name="venue.street" component="div" className="text-red-500" />
                                        </div>
                                        <div>
                                            <label className="block font-semibold" htmlFor="venue.city">
                                                City
                                            </label>
                                            <Field className={inputCls} name="venue.city" as={Input} placeholder="Enter City" />
                                            <ErrorMessage name="venue.city" component="div" className="text-red-500" />
                                        </div>
                                        <div>
                                            <label className="block font-semibold" htmlFor="venue.country">
                                                Country
                                            </label>
                                        </div>
                                        <Field className={inputCls} name="venue.country" as={Input} placeholder="Enter Country" />
                                        <ErrorMessage name="venue.country" component="div" className="text-red-500" />
                                    </>
                                )}
                            </div>
                        </fieldset>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreateEventScreen;