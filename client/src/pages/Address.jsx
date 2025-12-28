import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress,setOpenAddress] = useState(false)
  const [OpenEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({})
  const { fetchAddress} = useGlobalContext()

  const handleDisableAddress = async(id)=>{
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data : {
          _id : id
        }
      })
      if(response.data.success){
        toast.success("Address Remove")
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className='max-w-4xl mx-auto p-4'>
        <div className='bg-white shadow-sm p-4 rounded-xl flex justify-between gap-4 items-center mb-6 border border-gray-100'>
            <h2 className='font-bold text-xl text-gray-800 tracking-tight'>Saved Addresses</h2>
            <button onClick={()=>setOpenAddress(true)} className='border border-primary-200 text-primary-200 px-5 py-2 rounded-full hover:bg-primary-200 hover:text-white transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5'>
                + Add New Address
            </button>
        </div>
        
        <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
              {
                addressList.map((address,index)=>{
                  return(
                      <div key={address._id + index} className={`relative bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-300 ${!address.status && 'hidden'}`}>
                          <div className='w-full'>
                             <div className='flex items-center gap-2 mb-2'>
                                <span className='bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium'>Home</span>
                             </div>
                            <p className='font-medium text-gray-800 line-clamp-2 min-h-[3rem]'>{address.address_line}</p>
                            <p className='text-gray-600 text-sm'>{address.city}, {address.state}</p>
                            <p className='text-gray-600 text-sm font-medium'>{address.pincode}</p>
                            <p className='text-gray-600 text-sm mt-2'>{address.country}</p>
                            <p className='text-gray-600 text-sm mt-1'>Mobile: <span className='font-medium text-gray-800'>{address.mobile}</span></p>
                          </div>
                          <div className='flex gap-2 justify-end mt-auto pt-4 border-t border-gray-100'>
                            <button onClick={()=>{
                              setOpenEdit(true)
                              setEditData(address)
                            }} className='bg-green-50 text-green-600 p-2 rounded-full hover:bg-green-600 hover:text-white transition-colors duration-200 shadow-sm'>
                              <MdEdit size={18}/>
                            </button>
                            <button onClick={()=>
                              handleDisableAddress(address._id)
                            } className='bg-red-50 text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors duration-200 shadow-sm'>
                              <MdDelete size={18}/>  
                            </button>
                          </div>
                      </div>
                  )
                })
              }
              <div onClick={()=>setOpenAddress(true)} className='min-h-[200px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors duration-200 group'>
                 <div className='bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform duration-200'>
                    <span className='text-3xl text-gray-400'>+</span>
                 </div>
                <p className='text-gray-500 font-medium group-hover:text-gray-700'>Add Address</p>
              </div>
        </div>

        {
          openAddress && (
            <AddAddress close={()=>setOpenAddress(false)}/>
          )
        }

        {
          OpenEdit && (
            <EditAddressDetails data={editData} close={()=>setOpenEdit(false)}/>
          )
        }
    </div>
  )
}

export default Address
