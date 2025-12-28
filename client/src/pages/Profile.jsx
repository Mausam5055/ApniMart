import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';


const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit,setProfileAvatarEdit] = useState(false)
    const [userData,setUserData] = useState({
        name : user.name,
        email : user.email,
        mobile : user.mobile,
    })
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        setUserData({
            name : user.name,
            email : user.email,
            mobile : user.mobile,
        })
    },[user])

    const handleOnChange  = (e)=>{
        const { name, value} = e.target 

        setUserData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data : userData
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        } finally{
            setLoading(false)
        }

    }
  return (
    <div className='p-4 min-h-[calc(100vh-100px)] flex items-start justify-center bg-gray-50'>
        <div className='w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-100'>
            {/**profile upload and display image */}
            <div className='flex flex-col items-center mb-8 relative'>
                <div className='w-32 h-32 bg-gray-100 rounded-full overflow-hidden border-4 border-white shadow-lg relative group'>
                    {
                        user.avatar ? (
                            <img 
                            alt={user.name}
                            src={user.avatar}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                            />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center text-gray-300'>
                                <FaRegUserCircle size={80}/>
                            </div>
                        )
                    }
                    <button onClick={()=>setProfileAvatarEdit(true)} className='absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm'>
                        Change
                    </button>
                </div>
            </div>

            
            {
                openProfileAvatarEdit && (
                    <UserProfileAvatarEdit close={()=>setProfileAvatarEdit(false)}/>
                )
            }

            {/**name, mobile , email, change password */}
            <form className='grid gap-5' onSubmit={handleSubmit}>
                <div className='grid gap-1.5'>
                    <label className='text-sm font-semibold text-gray-600 ml-1'>Name</label>
                    <input
                        type='text'
                        placeholder='Enter your name' 
                        className='w-full p-3 bg-gray-50 outline-none border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-200 transition-all font-medium text-gray-800 placeholder:text-gray-400'
                        value={userData.name}
                        name='name'
                        onChange={handleOnChange}
                        required
                    />
                </div>
                <div className='grid gap-1.5'>
                    <label htmlFor='email' className='text-sm font-semibold text-gray-600 ml-1'>Email</label>
                    <input
                        type='email'
                        id='email'
                        placeholder='Enter your email' 
                        className='w-full p-3 bg-gray-50 outline-none border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-200 transition-all font-medium text-gray-800 placeholder:text-gray-400'
                        value={userData.email}
                        name='email'
                        onChange={handleOnChange}
                        required
                    />
                </div>
                <div className='grid gap-1.5'>
                    <label htmlFor='mobile' className='text-sm font-semibold text-gray-600 ml-1'>Mobile</label>
                    <input
                        type='text'
                        id='mobile'
                        placeholder='Enter your mobile number' 
                        className='w-full p-3 bg-gray-50 outline-none border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-200 transition-all font-medium text-gray-800 placeholder:text-gray-400'
                        value={userData.mobile}
                        name='mobile'
                        onChange={handleOnChange}
                        required
                    />
                </div>

                <button className='mt-4 w-full bg-primary-200 hover:bg-primary-300 text-neutral-900 font-bold py-3.5 rounded-xl shadow-lg shadow-primary-200/20 hover:shadow-primary-200/40 transition-all transform hover:-translate-y-0.5 active:scale-[0.98]'>
                    {
                        loading ? "Updating..." : "Save Changes"
                    }
                </button>
            </form>
        </div>
    </div>
  )
}

export default Profile
