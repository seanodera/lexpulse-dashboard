import React, {useState} from 'react';
import {Button, Upload, UploadFile} from "antd";
import {Input, Select, Textarea} from "@headlessui/react";
import {EventModel, Venue, VenueType, VenueTypeList} from "../data/types.ts";
import {FileImageOutlined} from "@ant-design/icons";
import {useSelector} from 'react-redux';
import {ErrorMessage, Field, Form, Formik, FormikErrors} from 'formik';
import {RootState} from '../store';
import {addVenue} from '../data/slices/venueSlice.ts';
import {useAppDispatch} from "../hooks/hooks.ts";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import {createVenueFormData} from "../data/createFormDatas.ts";
import {RcFile} from "antd/lib/upload";
import {selectCurrentUser} from "../data/slices/authSlice.ts";

const CreateVenueScreen: React.FC = () => {
    const user = useSelector(selectCurrentUser);
    const {loading, error} = useSelector((state: RootState) => state.venue);
    const inputCls = 'block border-solid border-gray-500 placeholder-gray-300 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary text-current w-full';
    const dispatch = useAppDispatch();


    const navigate = useNavigate();
    const initialValues: Partial<Venue> = {
        _id: "", followers: 0, images: [], yearEvents: 0,
        name: '',
        description: '',
        type: VenueType.Arena,
        street: '',
        district: '',
        city: '',
        country: '',
        capacity: 0,
        phone: '',
        email: '',
        poster: '',
        userId: user?.id || '',

    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        type: Yup.mixed<VenueType>().required('Type is required'),
        street: Yup.string().required('Street is required'),
        city: Yup.string().required('City is required'),
        country: Yup.string().required('Country is required'),
        capacity: Yup.number().min(0, 'Capacity cannot be negative').required('Capacity is required'),
        phone: Yup.string().required('Phone is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        poster: Yup.mixed().required('Poster is required'),
    });

    const handleSubmit = async (values: Partial<Venue>) => {
            console.log(values);
            const formData = await createVenueFormData(values);
            console.log(formData);

            const resultAction = await dispatch(addVenue(formData));

            if (resultAction.meta.requestStatus === 'fulfilled') {
                console.log('Venue added successfully:', resultAction.payload);
                navigate('/manage-venue')
            } else {
                console.error('Failed to add venue:', resultAction.payload);
            }
        };

    const handleImageUpload = (file: RcFile, setFieldValue: (field: string, value: string, shouldValidate?: boolean) => Promise<void | FormikErrors<EventModel>>, fieldName: string) => {
        setFieldValue(fieldName, URL.createObjectURL(file));
        return false; // Prevent default upload behavior
    }

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleUploadChange = (newFileList:UploadFile[],setFieldValue: (field: string, value: string, shouldValidate?: boolean) => Promise<void | FormikErrors<EventModel>>) => {
        setFileList(newFileList);
        newFileList.forEach((file, index) => {
            handleImageUpload(file.originFileObj as RcFile, setFieldValue, `images[${index}]`);
        })
    }

    return (
        <Formik  initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
            {({setFieldValue, values}) => (
            <Form className={'p-4'}>

                <div className={'flex justify-between items-center'}>
                    <h1 className={'text-xl font-semibold'}>Create Venue</h1>
                    <Button htmlType="submit" type={'primary'} loading={loading}>Create Venue</Button>

                </div>
                <div className={'grid grid-cols-5 mb-4 gap-8'}>
                    <div>
                        <Upload
                            beforeUpload={(file) => handleImageUpload(file, setFieldValue, 'poster')}
                            showUploadList={false}
                            className={'w-full'}
                            itemRender={(_originNode, file) => (
                                <img src={URL.createObjectURL(file.originFileObj as File)}
                                     className={'w-full aspect-square rounded-lg'} alt={''}/>
                            )}
                        >
                            {values.poster ? (
                                <img src={values.poster} alt="poster" className="w-full aspect-square rounded-xl"/>
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
                    <div className={'col-span-4'}>
                        <Upload maxCount={8} fileList={fileList} beforeUpload={() => false} onChange={(newFileList) => handleUploadChange( newFileList.fileList, setFieldValue)} multiple={true} listType={"picture-card"}>
                            <div className={'border border-dashed border-primary rounded-lg'}>
                                Add Image
                            </div>
                        </Upload>
                    </div>
                </div>
                <div className={'grid grid-cols-3 gap-8'}>
                    <div className={'space-y-4'}>
                        <h3 className={'text-lg font-semibold'}>Venue Details</h3>
                        <div>
                            <h4 className={'font-semibold'}>Venue Name</h4>
                            <Field as={Input} name="name" value={values.name} className={inputCls}/>
                            <ErrorMessage name="name" component="div" className="text-red-500"/>
                        </div>
                        <div>
                            <h4 className={'font-semibold'}>Venue Description</h4>
                            <Field as={Textarea} name="description" value={values.description}
                                      className={inputCls}/>
                            <ErrorMessage name="description" component="div" className="text-red-500"/>
                        </div>
                        <div>
                            <h4 className={'font-semibold'}>Venue Type</h4>
                            <Field as={Select} name="type" className={inputCls} value={values.type} >
                                {VenueTypeList.map(value => (<option value={value} key={value}>{value}</option>))}
                            </Field>
                            <ErrorMessage name="type" component="div" className="text-red-500"/>
                        </div>
                    </div>
                    <div className={'space-y-4'}>
                        <h3 className={'text-lg font-semibold'}>Venue Location</h3>
                        <div>
                            <h4 className={'font-semibold'}>Venue Street</h4>
                            <Field as={Input} name="street" value={values.street}  className={inputCls}/>
                            <ErrorMessage name="street" component="div" className="text-red-500"/>
                        </div>
                        <div>
                            <h4 className={'font-semibold'}>Venue District</h4>
                            <Field as={Input} name="district" value={values.district}
                                   className={inputCls}/>
                            <ErrorMessage name="district" component="div" className="text-red-500"/>
                        </div>
                        <div>
                            <h4 className={'font-semibold'}>Venue City</h4>
                            <Field as={Input} name="city" value={values.city}  className={inputCls}/>
                            <ErrorMessage name="city" component="div" className="text-red-500"/>
                        </div>
                        <div>
                            <h4 className={'font-semibold'}>Venue Country</h4>
                            <Field as={Input} name="country" value={values.country}  className={inputCls}/>
                            <ErrorMessage name="country" component="div" className="text-red-500"/>
                        </div>
                    </div>
                    <div className={'space-y-4'}>
                        <h3 className={'text-lg font-semibold'}>Venue Facilities</h3>
                        <div>
                            <h4 className={'font-semibold'}>Venue Capacity</h4>
                            <Field as={Input} name="capacity" value={values.capacity}
                                   className={inputCls}/>
                            <ErrorMessage name="capacity" component="div" className="text-red-500"/>
                        </div>
                        <div>
                            <h4 className={'font-semibold'}>Venue Phone Number</h4>
                            <Field as={Input} name="phone" value={values.phone}  className={inputCls}/>
                            <ErrorMessage name="phone" component="div" className="text-red-500"/>
                        </div>
                        <div>
                            <h4 className={'font-semibold'}>Venue Email</h4>
                            <Field as={Input} name="email" value={values.email}  className={inputCls}/>
                            <ErrorMessage name="email" component="div" className="text-red-500"/>
                        </div>
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
            </Form>
            )}
        </Formik>
    );
};

export default CreateVenueScreen;