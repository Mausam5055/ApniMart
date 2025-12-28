import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import CofirmBox from './CofirmBox'
import { IoClose } from 'react-icons/io5'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen,setEditOpen]= useState(false)
  const [openDelete,setOpenDelete] = useState(false)

  const handleDeleteCancel  = ()=>{
      setOpenDelete(false)
  }

  const handleDelete = async()=>{
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data : {
          _id : data._id
        }
      })

      const { data : responseData } = response

      if(responseData.success){
          toast.success(responseData.message)
          if(fetchProductData){
            fetchProductData()
          }
          setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className='w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow duration-300 flex flex-col'>
        <div className='h-36 w-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden relative'>
            <img
               src={data?.image[0]}  
               alt={data?.name}
               className='w-full h-full object-scale-down group-hover:scale-105 transition-transform duration-300'
            />
        </div>
        <div className='p-3 flex flex-col flex-1'>
            <p className='text-gray-800 font-medium text-sm line-clamp-2 min-h-[2.5em] mb-1' title={data?.name}>{data?.name}</p>
            <p className='text-gray-400 text-xs mb-3'>{data?.unit}</p>
            
            <div className='grid grid-cols-2 gap-2 mt-auto'>
              <button onClick={()=>setEditOpen(true)} className='border border-green-200 bg-green-50 text-green-700 text-xs py-1.5 rounded-lg hover:bg-green-100 transition-colors font-medium'>Edit</button>
              <button onClick={()=>setOpenDelete(true)} className='border border-red-200 bg-red-50 text-red-700 text-xs py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium'>Delete</button>
            </div>
        </div>

        {
          editOpen && (
            <EditProductAdmin fetchProductData={fetchProductData} data={data} close={()=>setEditOpen(false)}/>
          )
        }

        {
          openDelete && (
            <section className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-900 z-50 bg-opacity-60 backdrop-blur-sm p-4 flex justify-center items-center '>
                <div className='bg-white p-6 w-full max-w-sm rounded-xl shadow-2xl animate-fadeIn'>
                    <div className='flex items-center justify-between gap-4 mb-4'>
                        <h3 className='font-bold text-lg text-gray-800'>Delete Product</h3>
                        <button onClick={()=>setOpenDelete(false)} className="text-gray-400 hover:text-gray-600">
                          <IoClose size={24}/>
                        </button>
                    </div>
                    <p className='text-gray-600 text-sm mb-6'>Are you sure want to permanently delete this product? This action cannot be undone.</p>
                    <div className='flex justify-end gap-3'>
                      <button onClick={handleDeleteCancel} className='px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors'>Cancel</button>
                      <button onClick={handleDelete} className='px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium text-sm transition-colors shadow-sm'>Delete</button>
                    </div>
                </div>
            </section>
          )
        }
    </div>
  )
}

export default ProductCardAdmin
