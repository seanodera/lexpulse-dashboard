import React, { useState } from 'react';
import { Button } from 'antd';
import { Field, Fieldset, Input, Label } from '@headlessui/react';
import {signUpHost} from "../data/userData.ts";
import {useNavigate} from "react-router-dom";


export function SignUpComponent() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent the default form submission behavior
        setError(null); // Reset the error state

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Attempt to sign up the user
        try {
            const result = await signUpHost({ firstName, lastName, email, pass: password });
            if (result?.success) {
                console.log("User signed up successfully");
                navigate('/');
            } else {
                setError(result?.message || "Sign up failed");
            }
        } catch (err) {
            console.error(err);
            setError( "An error occurred");
        }
    };

    return (
        <div>
            <div className={'mt-4'}>
                <form className={'w-full max-w-md'} onSubmit={handleSubmit}>
                    <Fieldset className={'space-y-4 w-full text-start'}>
                        <div className={'grid grid-cols-2 gap-4'}>
                            <Field>
                                <Label className={'block font-semibold'}>First Name</Label>
                                <Input
                                    className={
                                        'mt-1 block border-solid border-gray-500 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary w-full'
                                    }
                                    placeholder={'First Name'}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <Label className={'block font-semibold'}>Last Name</Label>
                                <Input
                                    className={
                                        'mt-1 block border-solid border-gray-500 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary w-full'
                                    }
                                    placeholder={'Last Name'}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </Field>
                        </div>
                        <Field className={'w-full'}>
                            <Label className={'block font-semibold'}>Date Of Birth</Label>
                            <Input
                                type={'date'}
                                className={
                                    'mt-1 block border-solid border-gray-500 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary w-full'
                                }
                                placeholder={'date of birth'}
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                        </Field>
                        <Field className={'w-full'}>
                            <Label className={'block font-semibold'}>Email</Label>
                            <Input
                                className={
                                    'mt-1 block border-solid border-gray-500 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary w-full'
                                }
                                placeholder={'email'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <Label className={'block font-semibold'}>Password</Label>
                            <Input
                                className={
                                    'mt-1 block border-solid border-gray-500 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary w-full'
                                }
                                type={'password'}
                                placeholder={'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <Label className={'block font-semibold'}>Confirm Password</Label>
                            <Input
                                className={
                                    'mt-1 block border-solid border-gray-500 bg-transparent rounded-lg hover:border-primary active:border-primary ring-primary w-full'
                                }
                                type={'password'}
                                placeholder={'confirm password'}
                                value={confirmPassword}

                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Field>
                        {error && <div className="text-red-500">{error}</div>}
                        <Field>
                            <Button type={'primary'} size={'large'} block htmlType="submit">
                                Sign Up
                            </Button>
                        </Field>
                    </Fieldset>
                </form>
            </div>
        </div>
    );
}