import React, {useState} from 'react';
import {Button, Upload} from "antd";
import {Input, Select, Textarea} from "@headlessui/react";
import {Venue, VenueType, VenueTypeList} from "../data/types.ts";
import {FileImageOutlined} from "@ant-design/icons";
import {useSelector} from 'react-redux';
import {useFormik} from 'formik';
import {RootState} from '../store';
import {addVenue} from '../data/slices/venueSlice.ts';
import {useAppDispatch} from "../hooks/hooks.ts";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import {createVenueFormData} from "../data/createFormDatas.ts";
import {RcFile} from "antd/lib/upload";

const CreateVenueScreen: React.FC = () => {

    const {loading, error} = useSelector((state: RootState) => state.venue);
    const inputCls = 'block border-solid border-gray-500 placeholder-gray-300 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary text-current w-full';
    const dispatch = useAppDispatch();

    const [, setIsImageSelected] = useState<boolean>(false);
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
        poster: ''
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

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const formData = await createVenueFormData(values);
            const resultAction = await dispatch(addVenue(formData));
            if (addVenue.fulfilled.match(resultAction)) {
                console.log('Venue added successfully:', resultAction.payload);
                navigate('/manage-venue')
            } else {
                console.error('Failed to add venue:', resultAction.payload);
            }
        },
    });

    const handleImageUpload = (file: RcFile) => {
        formik.setFieldValue('poster', URL.createObjectURL(file));
        setIsImageSelected(true);
        return false; // Prevent default upload behavior
    }
    const {handleSubmit,handleChange,values} = formik;

    return (
        <form className={'p-4'} onSubmit={handleSubmit}>

            <div className={'flex justify-between items-center'}>
                <h1 className={'text-xl font-semibold'}>Create Venue</h1>
                <Button htmlType="submit" type={'primary'} loading={loading}>Create Venue</Button>

            </div>
            <div className={'grid grid-cols-5 mb-4'}>
                <div>
                    <Upload
                        beforeUpload={handleImageUpload}
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
                    <Upload multiple={true}/>
                </div>
            </div>
            <div className={'grid grid-cols-3 gap-8'}>
                <div className={'space-y-4'}>
                    <h3 className={'text-lg font-semibold'}>Venue Details</h3>
                    <div>
                        <h4 className={'font-semibold'}>Venue Name</h4>
                        <Input name="name" value={values.name} onChange={handleChange} className={inputCls}/>
                    </div>
                    <div>
                        <h4 className={'font-semibold'}>Venue Description</h4>
                        <Textarea name="description" value={values.description} onChange={handleChange}
                                  className={inputCls}/>
                    </div>
                    <div>
                        <h4 className={'font-semibold'}>Venue Type</h4>
                        <Select name="type" className={inputCls} value={values.type} onChange={handleChange}>
                            {VenueTypeList.map(value => (<option value={value} key={value}>{value}</option>))}
                        </Select>
                    </div>
                </div>
                <div className={'space-y-4'}>
                    <h3 className={'text-lg font-semibold'}>Venue Location</h3>
                    <div>
                        <h4 className={'font-semibold'}>Venue Street</h4>
                        <Input name="street" value={values.street} onChange={handleChange} className={inputCls}/>
                    </div>
                    <div>
                        <h4 className={'font-semibold'}>Venue District</h4>
                        <Input name="district" value={values.district} onChange={handleChange} className={inputCls}/>
                    </div>
                    <div>
                        <h4 className={'font-semibold'}>Venue City</h4>
                        <Input name="city" value={values.city} onChange={handleChange} className={inputCls}/>
                    </div>
                    <div>
                        <h4 className={'font-semibold'}>Venue Country</h4>
                        <Input name="country" value={values.country} onChange={handleChange} className={inputCls}/>
                    </div>
                </div>
                <div className={'space-y-4'}>
                    <h3 className={'text-lg font-semibold'}>Venue Facilities</h3>
                    <div>
                        <h4 className={'font-semibold'}>Venue Capacity</h4>
                        <Input name="capacity" value={values.capacity} onChange={handleChange} className={inputCls}/>
                    </div>
                    <div>
                        <h4 className={'font-semibold'}>Venue Phone Number</h4>
                        <Input name="phone" value={values.phone} onChange={handleChange} className={inputCls}/>
                    </div>
                    <div>
                        <h4 className={'font-semibold'}>Venue Email</h4>
                        <Input name="email" value={values.email} onChange={handleChange} className={inputCls}/>
                    </div>
                </div>
            </div>
           {error && <p className="error">{error}</p>}
        </form>
    );
};

export default CreateVenueScreen;