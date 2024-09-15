import {Button} from "antd";
import {Field, Fieldset, Input, Label} from "@headlessui/react";
import {useState} from "react";
import {SignInHost} from "./data/userData.ts";
import {useNavigate} from "react-router-dom";


export function SignInComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleSubmit() {
        SignInHost(email, password).then((result) => {
            if (result?.status === 200) {

                    navigate('/')

            } else {
                // Handle login error
            }
        });
    }

    return (
        <div>
            <img src={'/logo.svg'} alt="logo" className={'mx-auto'}/>
            <form className={'w-full'}>
                <Fieldset className={'space-y-4 w-full text-start'}>
                    <Field className={'w-full'}>
                        <Label className={'block text-lg font-semibold'}>Email</Label>
                        <Input
                            className={
                                'mt-1 block border-solid border-gray-500 bg-transparent text-white rounded-lg hover:border-primary active:border-primary ring-primary w-full'
                            }
                            placeholder={'email'}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Field>
                    <Field>
                        <Label className={'block text-lg font-semibold'}>Password</Label>
                        <Input
                            className={
                                'mt-1 block border-solid border-gray-500 bg-transparent text-white rounded-lg hover:border-primary active:border-primary ring-primary w-full'
                            }
                            type={'password'}
                            placeholder={'password'}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Field>
                    <Field>
                        <Button onClick={handleSubmit} type={'primary'} size={'large'} block>
                            Login
                        </Button>
                    </Field>
                </Fieldset>
            </form>
        </div>
    );
}