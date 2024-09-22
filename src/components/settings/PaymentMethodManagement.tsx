import { Card, Input, Button } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    cardNumber: Yup.string().required('Card Number is required'),
    expiryDate: Yup.string().required('Expiry Date is required'),
    cvv: Yup.string().required('CVV is required'),
});

const PaymentMethodManagement = () => {
    return (
        <Card>
            <h3 className={'text-lg font-semibold'}>Payment Method Management</h3>
            <Formik
                initialValues={{ cardNumber: '', expiryDate: '', cvv: '' }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 400);
                }}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form>
                        <div style={{ marginBottom: '1em' }}>
                            <label htmlFor="cardNumber">Card Number</label>
                            <Field
                                as={Input}
                                name="cardNumber"
                                placeholder="Enter your card number"
                            />
                            {errors.cardNumber && touched.cardNumber && (
                                <div style={{ color: 'red' }}>{errors.cardNumber}</div>
                            )}
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <label htmlFor="expiryDate">Expiry Date</label>
                            <Field
                                as={Input}
                                name="expiryDate"
                                placeholder="MM/YY"
                            />
                            {errors.expiryDate && touched.expiryDate && (
                                <div style={{ color: 'red' }}>{errors.expiryDate}</div>
                            )}
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <label htmlFor="cvv">CVV</label>
                            <Field
                                as={Input}
                                name="cvv"
                                placeholder="Enter CVV"
                            />
                            {errors.cvv && touched.cvv && (
                                <div style={{ color: 'red' }}>{errors.cvv}</div>
                            )}
                        </div>
                        <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                            Save Changes
                        </Button>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default PaymentMethodManagement;