import React from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'

const AddAddress = ({close}) => {
    const { register, handleSubmit,reset } = useForm()
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async(data)=>{
        console.log("data",data)
    
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data : {
                    address_line :data.addressline,
                    city : data.city,
                    state : data.state,
                    country : data.country,
                    pincode : data.pincode,
                    mobile : data.mobile
                }
            })

            const { data : responseData } = response
            
            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
  return (
    <section className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm overflow-auto p-4'>
        <div className='bg-white p-6 w-full max-w-lg rounded-2xl shadow-2xl relative animate-fadeIn'>
            <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-100'>
                <h2 className='font-bold text-xl text-gray-800'>Add New Address</h2>
                <button onClick={close} className='text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50'>
                    <IoClose size={24}/>
                </button>
            </div>
            <form className='grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-1.5'>
                    <label htmlFor='addressline' className='text-sm font-medium text-gray-700'>Address Line</label>
                    <input
                        type='text'
                        id='addressline' 
                        placeholder='Enter your address'
                        className='bg-gray-50 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all'
                        {...register("addressline",{required : true})}
                    />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='grid gap-1.5'>
                        <label htmlFor='city' className='text-sm font-medium text-gray-700'>City</label>
                        <input
                            type='text'
                            id='city' 
                            placeholder='City'
                            className='bg-gray-50 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all'
                            {...register("city",{required : true})}
                        />
                    </div>
                    <div className='grid gap-1.5'>
                        <label htmlFor='state' className='text-sm font-medium text-gray-700'>State</label>
                        <input
                            type='text'
                            id='state' 
                             placeholder='State'
                            className='bg-gray-50 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all'
                            {...register("state",{required : true})}
                        />
                    </div>
                </div>
                 <div className='grid grid-cols-2 gap-4'>
                    <div className='grid gap-1.5'>
                        <label htmlFor='pincode' className='text-sm font-medium text-gray-700'>Pincode</label>
                        <input
                            type='text'
                            id='pincode' 
                            placeholder='Zip Code'
                            className='bg-gray-50 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all'
                            {...register("pincode",{required : true})}
                        />
                    </div>
                     <div className='grid gap-1.5'>
                        <label htmlFor='country' className='text-sm font-medium text-gray-700'>Country</label>
                        <input
                            type='text'
                            id='country' 
                            placeholder='Country'
                            className='bg-gray-50 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all'
                            {...register("country",{required : true})}
                        />
                    </div>
                </div>
                <div className='grid gap-1.5'>
                    <label htmlFor='mobile' className='text-sm font-medium text-gray-700'>Mobile No.</label>
                    <input
                        type='text'
                        id='mobile' 
                        placeholder='Enter mobile number'
                        className='bg-gray-50 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all'
                        {...register("mobile",{required : true})}
                    />
                </div>

                <button type='submit' className='bg-primary-200 text-white w-full py-3 rounded-lg font-semibold mt-4 hover:bg-primary-100 hover:shadow-lg transition-all transform active:scale-95 duration-200'>Save Address</button>
            </form>
        </div>
    </section>
  )
}

export default AddAddress
