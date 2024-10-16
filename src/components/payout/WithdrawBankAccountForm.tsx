import {Button, Card, Input, Select} from 'antd';
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {countries} from "country-data";
import {useAppSelector} from "../../hooks/hooks.ts";
import {selectCurrentUser} from "../../data/slices/authSlice.ts";
import {useState} from "react";
import WithdrawalBankModal from "./withdrawalAccountModal.tsx";

interface WithdrawalAccount {
    account_number: string;
    bank_code: string;
    currency: string;
    account_name: string;
}

const validationSchema = Yup.object().shape({
    account_number: Yup.string()
        .required('Account Number is required')
        .min(10, 'Account Number must be at least 10 digits')
        .max(10, 'Account Number must be at most 10 digits'),
    bank_code: Yup.string()
        .required('Bank Code is required'),
    currency: Yup.string()
        .required('Currency is required'),
    account_name: Yup.string()
        .required('Account Name is required')
});

const WithdrawBankAccountForm = () => {
    const inputCls = 'block border-solid border-gray-500 placeholder-gray-300 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary text-current w-full';
    const user = useAppSelector(selectCurrentUser)
const [show, setShow] = useState<boolean>(false);
    return (
        <>
            {(!user?.withdrawalAccounts || user?.withdrawalAccounts.length === 0) ?
                <Button type={'primary'} block size={'large'} onClick={() => setShow(true)}>Add Withdrawal Account</Button>
                : <Card>
                    <h3 className={'text-lg font-semibold'}>Bank Account Information</h3>
                    <Formik<WithdrawalAccount>
                        initialValues={{
                            account_number: '',
                            bank_code: '',
                            currency: 'GHS',
                            account_name: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, {setSubmitting}) => {
                            setTimeout(() => {
                                alert(JSON.stringify(values, null, 2));
                                setSubmitting(false);
                            }, 400);
                        }}
                    >
                        {({isSubmitting, errors, touched, setFieldValue}) => (
                            <Form>
                                <fieldset style={{border: 'none', padding: 0}}>
                                    <div style={{marginBottom: '1em'}}>
                                        <label htmlFor="account_name">Account Name</label>
                                        <Field
                                            as={Input}
                                            name="account_name"
                                            placeholder="Enter your account name"
                                            className={inputCls}
                                        />
                                        {errors.account_name && touched.account_name ? (
                                            <div style={{color: 'red'}}>{errors.account_name}</div>
                                        ) : null}
                                    </div>
                                    <div style={{marginBottom: '1em'}}>
                                        <label htmlFor="account_number">Account Number</label>
                                        <Field
                                            as={Input}
                                            name="account_number"
                                            placeholder="Enter your account number"
                                            className={inputCls}
                                        />
                                        {errors.account_number && touched.account_number ? (
                                            <div style={{color: 'red'}}>{errors.account_number}</div>
                                        ) : null}
                                    </div>

                                    <div style={{marginBottom: '1em'}}>
                                        <label htmlFor="bank_code">Bank Code</label>
                                        <Field
                                            as={Input}
                                            name="bank_code"
                                            placeholder="Enter your bank code"
                                            className={inputCls}
                                        />
                                        {errors.bank_code && touched.bank_code ? (
                                            <div style={{color: 'red'}}>{errors.bank_code}</div>
                                        ) : null}
                                    </div>

                                    <div style={{marginBottom: '1em'}}>
                                        <label htmlFor="currency">Currency</label>
                                        <Field
                                            as={Select}
                                            name="currency"
                                            defaultValue="GHS"
                                            className={inputCls}
                                            onChange={(value: string) => setFieldValue('currency', value)}
                                            options={[
                                                {
                                                    label: countries[ 'GH' ].currencies[ 0 ],
                                                    value: countries[ 'GH' ].currencies[ 0 ],
                                                }, {
                                                    label: countries[ 'KE' ].currencies[ 0 ],
                                                    value: countries[ 'KE' ].currencies[ 0 ],
                                                }
                                            ]}
                                        />


                                        {errors.currency && touched.currency ? (
                                            <div style={{color: 'red'}}>{errors.currency}</div>
                                        ) : null}
                                    </div>

                                    <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                                        Submit
                                    </Button>
                                </fieldset>
                            </Form>
                        )}
                    </Formik>
                </Card>}
            <WithdrawalBankModal show={show} setShow={setShow}/>
        </>
    );
};


export default WithdrawBankAccountForm;