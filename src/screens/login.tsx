import { Button } from "antd";
import { Field, Fieldset, Input, Label } from "@headlessui/react";
import {CloseOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {SignInHost} from "../data/userData.ts";


export default function LoginPage() {
const navigator = useNavigate();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
function handleSubmit() {
    SignInHost(email, password).then((result) => {
        if (result?.status === 200) {
        navigator('/')
        } else {
            // do something else
        }
    });
}
    return (
        <div className={' bg-gradient-radial from-primary to-dark '}>

     <div className={'w-screen h-screen flex justify-center items-center text-white relative bg-dark bg-opacity-80'}>
         <Button  onClick={() => navigator(-1)} type={'text'} className={'text-white absolute top-0 right-0 m-4'} size={'large'} icon={<CloseOutlined/>}/>

         <div
             className={
                 'grid grid-cols-2 gap-10 max-w-screen-md w-full relative'
             }
         >

             <div className={'absolute inset-0 flex justify-center py-7'}>
                 <div className={'w-px bg-primary-800 h-full '}></div>
             </div>


             <div className={'max-w-screen-sm w-full text-center z-10'}>
                 <img src={'/logo/logo.svg'} alt="logo" className={'mx-auto'} />
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


             <div className={'max-w-screen-sm w-full z-10 flex flex-col items-start justify-center'}>
                 <p className={'text-sm text-gray-300'}>
                     Don&apos;t have an account?
                 </p>
                 <Button block type={'primary'} size={'large'} ghost>
                     Create An Account
                 </Button>

             </div>
         </div>
     </div>
        </div>
    );
}