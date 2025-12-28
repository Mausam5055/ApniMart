import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useSelector } from 'react-redux'

const CategoryPage = () => {
    const [openUploadCategory,setOpenUploadCategory] = useState(false)
    const [loading,setLoading] = useState(false)
    const [categoryData,setCategoryData] = useState([])
    const [openEdit,setOpenEdit] = useState(false)
    const [editData,setEditData] = useState({
        name : "",
        image : "",
    })
    const [openConfimBoxDelete,setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory,setDeleteCategory] = useState({
        _id : ""
    })
    // const allCategory = useSelector(state => state.product.allCategory)


    // useEffect(()=>{
    //     setCategoryData(allCategory)
    // },[allCategory])
    
    const fetchCategory = async()=>{
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data : responseData } = response

            if(responseData.success){
                setCategoryData(responseData.data)
            }
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategory()
    },[])

    const handleDeleteCategory = async()=>{
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data : deleteCategory
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section className='p-4 max-w-7xl mx-auto'>
        <div className='bg-white shadow-sm p-5 rounded-xl flex items-center justify-between border border-gray-100 mb-6'>
            <h2 className='font-bold text-xl text-gray-800 tracking-tight'>Category</h2>
            <button onClick={()=>setOpenUploadCategory(true)} className='text-sm border border-primary-200 text-primary-200 hover:bg-primary-50 px-4 py-2 rounded-full font-medium transition-colors duration-200'>
                + Add Category
            </button>
        </div>
        {
            !categoryData[0] && !loading && (
                <NoData/>
            )
        }

        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'>
            {
                categoryData.map((category,index)=>{
                    return(
                        <div className='group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col' key={category._id}>
                            <div className='w-full h-40 bg-gray-50 flex items-center justify-center overflow-hidden p-4'>
                                <img 
                                    alt={category.name}
                                    src={category.image}
                                    className='w-full h-full object-scale-down group-hover:scale-110 transition-transform duration-300'
                                />
                            </div>
                            <div className='p-3 flex-1 flex flex-col'>
                                <h3 className='font-medium text-gray-800 mb-3 truncate text-center'>{category.name}</h3>
                                <div className='flex gap-2 mt-auto'>
                                    <button onClick={()=>{
                                        setOpenEdit(true)
                                        setEditData(category)
                                    }} className='flex-1 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-semibold py-1.5 rounded-lg transition-colors'>
                                        Edit
                                    </button>
                                    <button onClick={()=>{
                                        setOpenConfirmBoxDelete(true)
                                        setDeleteCategory(category)
                                    }} className='flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-1.5 rounded-lg transition-colors'>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>

        {
            loading && (
                <Loading/>
            )
        }

        {
            openUploadCategory && (
                <UploadCategoryModel fetchData={fetchCategory} close={()=>setOpenUploadCategory(false)}/>
            )
        }

        {
            openEdit && (
                <EditCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchCategory}/>
            )
        }

        {
            openConfimBoxDelete && (
            <CofirmBox close={()=>setOpenConfirmBoxDelete(false)} cancel={()=>setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory}/>
            ) 
        }
    </section>
  )
}

export default CategoryPage
