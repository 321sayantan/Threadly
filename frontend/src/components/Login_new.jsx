import React, { useState } from 'react'
import { CardSwipe } from "@/components/ui/card-swipe"
import { Input } from './ui/input'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router'
import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { login } from '../http/api'
import { toast } from 'sonner'


const Login_new = () => {
    const images = [
        // { src: "card1.jpg", alt: "Image 1" },
        { src: "card2.jpeg", alt: "Image 2" },
        { src: "card3.jpg", alt: "Image 3" },
        { src: "card4.jpg", alt: "Image 4" },
    ]

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [textboxType, setTextboxType] = useState("Password");
    const [togglePass, setTogglePass] = useState(true);
    const navigate = useNavigate();

    // const { user, setUser } = useUserStore();

    const togglePassword = () => {
        setTogglePass(!togglePass);
        setTextboxType(togglePass ? "text" : "password");
    };

    const handelSubmit = async (e) => {
        e.preventDefault();
        if (email === "" || password === "") {
            toast.error("Please fill all the fields");
            return;
        }

        setLoading(true);
        const data = {
            email: email,
            password: password
        }

        const res = await login(data)

        if (res.success === false) {
            toast.error(res.message);
        }
        else {
            toast.success(res.message);
            // setUser(res.userdata);
            // console.log(user)
            navigate("/");
        }
        setLoading(false);
        setPassword("");
    };

    return (
        <div className='bg-[#101015] h-screen'>
            <div className='flex w-4/5 pt-15 mx-auto'>
                <div className="basis-2/3 justify-center items-center p-25 pb-10 pt-15">
                    <CardSwipe images={images} autoplayDelay={2000} slideShadows={false} />
                </div>

                <div className="basis-1/4 justify-center items-center mt-5">
                    <img src="logo9.png" alt="" />
                    <div>
                        <form onSubmit={handelSubmit} className='mt-10'>
                            <Input
                                id="email"
                                placeholder="Email"
                                value={email}
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <div className='flex'>
                                <Input
                                    id="password"
                                    placeholder="Password"
                                    className="mt-2"
                                    value={password}
                                    type={textboxType}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="absolute mt-4 ml-68 cursor-pointer">
                                    <span>
                                        {togglePass ? (
                                            <FaRegEye onClick={togglePassword} />
                                        ) : (
                                            <FaRegEyeSlash onClick={togglePassword} />
                                        )}
                                    </span>
                                </div>
                            </div>

                            {loading ? (
                                <Button className="w-full mt-3.5" disabled={loading}>
                                    <Loader2 className="animate-spin mr-2" size={14} />
                                    Please Wait...
                                </Button>
                            ) : (
                                <button type='submit' className='bg-blue-500 text-white w-full p-2 mt-8 mb-2 rounded-md'>Log In</button>
                            )}


                        </form>
                        <div className='text-center text-sm text-blue-500 cursor-pointer'>Forgot password?</div>
                    </div>
                    <div className='relative flex items-center mt-8 mb-6'>
                        <div className='flex-grow border-t border-gray-300'></div>
                        <span className='px-4 text-gray-500 text-sm'>OR</span>
                        <div className='flex-grow border-t border-gray-300'></div>
                    </div>
                    <div className='text-center'>
                        <button className='flex items-center justify-center gap-2 border border-gray-300 w-full p-2 rounded hover:bg-gray-50'>
                            <img src="https://similarpng.com/_next/image?url=https%3A%2F%2Fimage.similarpng.com%2Ffile%2Fsimilarpng%2Fvery-thumbnail%2F2020%2F12%2FGoogle-logo-design-isolated-illustration-premium-vector-PNG.png&w=1080&q=75" alt="Google" className='w-5 h-5' />
                            <span className='text-sm'>Log in with Google</span>
                        </button>
                    </div>
                    <button className='mt-6 w-full p-2 text-sm'>
                        Don't have an account? <span className='text-blue-500'>       
                            <Link to="/signup" className="text-blue-600">
                            Signup
                        </Link>{" "}</span>
                    </button>
                </div>
            </div>

            <div className='text-center text-gray-500 text-sm mt-2 mb-0'>
                <p>Get the app.</p>
                <div className='flex justify-center gap-4 mt-4'>
                    <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english_en.png/5f7df0a1b6d3.png" alt="App Store" className='h-10' />
                    <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english_en.png/e9cd846dc748.png" alt="Google Play Store" className='h-10' />
                </div>
            </div>
        </div>
    )
}

export default Login_new