import {Button} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";
import {SignInComponent} from "../components/signInComponent.tsx";
import {SignUpComponent} from "../components/SignUpComponent.tsx";


export default function LoginPage() {
    const navigator = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup

    return (
        <div className={'bg-gradient-radial from-primary to-dark'}>
            <div
                className={'w-screen h-screen flex justify-center items-center text-white relative bg-dark bg-opacity-80'}>
                <Button onClick={() => location.key ? navigator(-1) : navigator('/')} type={'text'}
                        className={'text-white absolute top-0 right-0 m-4 z-10'} size={'large'}
                        icon={<CloseOutlined/>}/>

                <div className={'grid grid-cols-2 gap-10 max-w-screen-md w-full relative'}>
                    <div className={'absolute inset-0 flex justify-center py-7'}>
                        <div className={'w-px bg-primary-800 h-full'}></div>
                    </div>
                    <div className={`${!isLogin && 'hidden'} z-10`}>
                        <SignInComponent/>
                    </div>
                    <div
                        className={`max-w-screen-sm w-full z-10 flex flex-col items-start justify-center ${isLogin && 'hidden'}`}>
                        <p className={'text-sm text-gray-300 mb-2'}>
                            Already have an account?
                        </p>
                        <Button onClick={() => setIsLogin(true)} block type={'primary'} size={'large'} ghost>
                            Back To Login
                        </Button>

                    </div>


                    <div
                        className={`max-w-screen-sm w-full z-10 flex flex-col items-start justify-center ${!isLogin && 'hidden'}`}>
                        <p className={'text-sm text-gray-300 mb-2'}>
                            Don&apos;t have an account?
                        </p>
                        <Button onClick={() => setIsLogin(false)} block type={'primary'} size={'large'} ghost>
                            Create An Account
                        </Button>
                        <p className={'text-sm text-gray-300 mt-4 mb-2'}>
                            Forgot password?
                        </p>
                        <Button className={''} block ghost size={'large'}>Reset Password</Button>
                    </div>
                    <div className={`${isLogin && 'hidden'} z-10`}>
                        <SignUpComponent/>
                    </div>

                </div>
            </div>
        </div>
    );
}


