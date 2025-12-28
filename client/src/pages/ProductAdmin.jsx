import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5";
import EditProductAdmin from '../components/EditProductAdmin'

const ProductAdmin = () => {
  const [productData,setProductData] = useState([])
  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(false)
  const [totalPageCount,setTotalPageCount] = useState(1)
  const [search,setSearch] = useState("")
  
  const fetchProductData = async()=>{
    try {
        setLoading(true)
        const response = await Axios({
           ...SummaryApi.getProduct,
           data : {
              page : page,
              limit : 12,
              search : search 
           }
        })

        const { data : responseData } = response 

        if(responseData.success){
          setTotalPageCount(responseData.totalNoPage)
          setProductData(responseData.data)
        }

    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    fetchProductData()
  },[page])

  const handleNext = ()=>{
    if(page !== totalPageCount){
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = ()=>{
    if(page > 1){
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e)=>{
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(()=>{
    let flag = true 

    const interval = setTimeout(() => {
      if(flag){
        fetchProductData()
        flag = false
      }
    }, 300);

    return ()=>{
      clearTimeout(interval)
    }
  },[search])
  
  return (
    <section className='p-4 max-w-7xl mx-auto'>
        <div className='bg-white shadow-sm p-5 rounded-xl flex items-center justify-between gap-4 border border-gray-100 mb-6'>
                <h2 className='font-bold text-xl text-gray-800 tracking-tight'>Product Items</h2>
                <div className='h-full min-w-24 max-w-sm w-full ml-auto bg-gray-50 flex items-center gap-3 px-4 py-2.5 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-200 transition-all'>
                  <IoSearchOutline size={20} className="text-gray-400"/>
                  <input
                    type='text'
                    placeholder='Search products...' 
                    className='h-full w-full outline-none bg-transparent text-sm'
                    value={search}
                    onChange={handleOnChange}
                  />
                </div>
        </div>
        {
          loading && (
            <Loading/>
          )
        }


        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='p-4 min-h-[55vh] bg-gray-50/50'>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
                {
                  productData.map((p,index)=>{
                    return(
                      <ProductCardAdmin data={p} fetchProductData={fetchProductData}  />
                    )
                  })
                }
              </div>
            </div>
            
            <div className='flex justify-between items-center p-4 border-t border-gray-200 bg-white'>
              <button onClick={handlePrevious} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium text-sm">Previous</button>
              <div className='w-full max-w-[200px] text-center text-sm font-medium text-gray-500'>Page {page} of {totalPageCount}</div>
              <button onClick={handleNext} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium text-sm">Next</button>
            </div>

        </div> 
    </section>
  )
}

export default ProductAdmin
