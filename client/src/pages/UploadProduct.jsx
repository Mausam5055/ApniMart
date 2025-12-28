import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';

const UploadProduct = () => {
  const [data,setData] = useState({
      name : "",
      image : [],
      category : [],
      subCategory : [],
      unit : "",
      stock : "",
      price : "",
      discount : "",
      description : "",
      more_details : {},
  })
  const [imageLoading,setImageLoading] = useState(false)
  const [ViewImageURL,setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory,setSelectCategory] = useState("")
  const [selectSubCategory,setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField,setOpenAddField] = useState(false)
  const [fieldName,setFieldName] = useState("")


  const handleChange = (e)=>{
    const { name, value} = e.target 

    setData((preve)=>{
      return{
          ...preve,
          [name]  : value
      }
    })
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]

    if(!file){
      return 
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data : ImageResponse } = response
    const imageUrl = ImageResponse.data.url 

    setData((preve)=>{
      return{
        ...preve,
        image : [...preve.image,imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async(index)=>{
      data.image.splice(index,1)
      setData((preve)=>{
        return{
            ...preve
        }
      })
  }

  const handleRemoveCategory = async(index)=>{
    data.category.splice(index,1)
    setData((preve)=>{
      return{
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async(index)=>{
      data.subCategory.splice(index,1)
      setData((preve)=>{
        return{
          ...preve
        }
      })
  }

  const handleAddField = ()=>{
    setData((preve)=>{
      return{
          ...preve,
          more_details : {
            ...preve.more_details,
            [fieldName] : ""
          }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log("data",data)

    try {
      const response = await Axios({
          ...SummaryApi.createProduct,
          data : data
      })
      const { data : responseData} = response

      if(responseData.success){
          successAlert(responseData.message)
          setData({
            name : "",
            image : [],
            category : [],
            subCategory : [],
            unit : "",
            stock : "",
            price : "",
            discount : "",
            description : "",
            more_details : {},
          })

      }
    } catch (error) {
        AxiosToastError(error)
    }


  }

  // useEffect(()=>{
  //   successAlert("Upload successfully")
  // },[])
  return (
    <section className='max-w-4xl mx-auto p-4 mb-10'>
        <div className='bg-white shadow-lg p-6 rounded-2xl border border-gray-100'>
            <div className='flex items-center justify-between mb-6 border-b border-gray-100 pb-4'>
                <h2 className='font-bold text-2xl text-gray-800 tracking-tight'>Upload Product</h2>
            </div>
            <form className='grid gap-6' onSubmit={handleSubmit}>
                <div className='grid gap-2'>
                  <label htmlFor='name' className='font-medium text-gray-700'>Product Name</label>
                  <input 
                    id='name'
                    type='text'
                    placeholder='Enter product name'
                    name='name'
                    value={data.name}
                    onChange={handleChange}
                    required
                    className='bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all'
                  />
                </div>
                <div className='grid gap-2'>
                  <label htmlFor='description' className='font-medium text-gray-700'>Description</label>
                  <textarea 
                    id='description'
                    type='text'
                    placeholder='Enter product description'
                    name='description'
                    value={data.description}
                    onChange={handleChange}
                    required
                    multiple 
                    rows={4}
                    className='bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all resize-none'
                  />
                </div>
                <div>
                    <p className='font-medium text-gray-700 mb-2'>Product Images</p>
                    <div>
                      <label htmlFor='productImage' className='bg-gray-50 h-32 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-100 hover:border-primary-200 transition-all'>
                          <div className='text-center flex justify-center items-center flex-col text-gray-500'>
                            {
                              imageLoading ?  <Loading/> : (
                                <>
                                   <FaCloudUploadAlt size={40} className='mb-2 text-primary-200'/>
                                   <p className='font-medium'>Click to upload image</p>
                                   <p className='text-xs text-gray-400'>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </>
                              )
                            }
                          </div>
                          <input 
                            type='file'
                            id='productImage'
                            className='hidden'
                            accept='image/*'
                            onChange={handleUploadImage}
                          />
                      </label>
                      {/**display uploded image*/}
                      <div className='flex flex-wrap gap-4 mt-4'>
                        {
                          data.image.map((img,index) =>{
                              return(
                                <div key={img+index} className='h-24 w-24 bg-white border border-gray-200 rounded-lg relative group overflow-hidden shadow-sm'>
                                  <img
                                    src={img}
                                    alt={img}
                                    className='w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform' 
                                    onClick={()=>setViewImageURL(img)}
                                  />
                                  <div onClick={()=>handleDeleteImage(index)} className='absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md'>
                                    <MdDelete size={14}/>
                                  </div>
                                </div>
                              )
                          })
                        }
                      </div>
                    </div>

                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='grid gap-2'>
                        <label className='font-medium text-gray-700'>Category</label>
                        <div className='relative'>
                            <select
                            className='appearance-none bg-gray-50 border border-gray-200 w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 transition-all'
                            value={selectCategory}
                            onChange={(e)=>{
                                const value = e.target.value 
                                const category = allCategory.find(el => el._id === value )
                                
                                setData((preve)=>{
                                return{
                                    ...preve,
                                    category : [...preve.category,category],
                                }
                                })
                                setSelectCategory("")
                            }}
                            >
                            <option value={""}>Select Category</option>
                            {
                                allCategory.map((c,index)=>{
                                return(
                                    <option value={c?._id} key={c._id+index}>{c.name}</option>
                                )
                                })
                            }
                            </select>
                            <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500'>
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </div>
                        </div>
                        <div className='flex flex-wrap gap-2 mt-1'>
                        {
                            data.category.map((c,index)=>{
                            return(
                                <div key={c._id+index+"productsection"} className='text-sm flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100'>
                                <p>{c.name}</p>
                                <div className='hover:text-red-500 cursor-pointer' onClick={()=>handleRemoveCategory(index)}>
                                    <IoClose size={16}/>
                                </div>
                                </div>
                            )
                            })
                        }
                        </div>
                    </div>
                    <div className='grid gap-2'>
                        <label className='font-medium text-gray-700'>Sub Category</label>
                        <div className='relative'>
                            <select
                            className='appearance-none bg-gray-50 border border-gray-200 w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 transition-all'
                            value={selectSubCategory}
                            onChange={(e)=>{
                                const value = e.target.value 
                                const subCategory = allSubCategory.find(el => el._id === value )
                                setData((preve)=>{
                                return{
                                    ...preve,
                                    subCategory : [...preve.subCategory,subCategory]
                                }
                                })
                                setSelectSubCategory("")
                            }}
                            >
                            <option value={""} className='text-neutral-600'>Select Sub Category</option>
                            {
                                allSubCategory.map((c,index)=>{
                                return(
                                    <option value={c?._id} key={c._id+index+"sub"}>{c.name}</option>
                                )
                                })
                            }
                            </select>
                            <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500'>
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </div>
                        </div>
                        <div className='flex flex-wrap gap-2 mt-1'>
                        {
                            data.subCategory.map((c,index)=>{
                            return(
                                <div key={c._id+index+"productsection"} className='text-sm flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100'>
                                <p>{c.name}</p>
                                <div className='hover:text-red-500 cursor-pointer' onClick={()=>handleRemoveSubCategory(index)}>
                                    <IoClose size={16}/>
                                </div>
                                </div>
                            )
                            })
                        }
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='grid gap-2'>
                    <label htmlFor='unit' className='font-medium text-gray-700'>Unit</label>
                    <input 
                        id='unit'
                        type='text'
                        placeholder='Enter product unit'
                        name='unit'
                        value={data.unit}
                        onChange={handleChange}
                        required
                        className='bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all'
                    />
                    </div>

                    <div className='grid gap-2'>
                    <label htmlFor='stock' className='font-medium text-gray-700'>Number of Stock</label>
                    <input 
                        id='stock'
                        type='number'
                        placeholder='Enter product stock'
                        name='stock'
                        value={data.stock}
                        onChange={handleChange}
                        required
                        className='bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all'
                    />
                    </div>

                    <div className='grid gap-2'>
                    <label htmlFor='price' className='font-medium text-gray-700'>Price</label>
                    <input 
                        id='price'
                        type='number'
                        placeholder='Enter product price'
                        name='price'
                        value={data.price}
                        onChange={handleChange}
                        required
                        className='bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all'
                    />
                    </div>

                    <div className='grid gap-2'>
                    <label htmlFor='discount' className='font-medium text-gray-700'>Discount</label>
                    <input 
                        id='discount'
                        type='number'
                        placeholder='Enter product discount'
                        name='discount'
                        value={data.discount}
                        onChange={handleChange}
                        required
                        className='bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all'
                    />
                    </div>
                </div>


                {/**add more field**/}
                  {
                    Object?.keys(data?.more_details)?.map((k,index)=>{
                        return(
                          <div className='grid gap-2' key={k+index}>
                            <label htmlFor={k} className='font-medium text-gray-700 capitalize'>{k}</label>
                            <input 
                              id={k}
                              type='text'
                              value={data?.more_details[k]}
                              onChange={(e)=>{
                                  const value = e.target.value 
                                  setData((preve)=>{
                                    return{
                                        ...preve,
                                        more_details : {
                                          ...preve.more_details,
                                          [k] : value
                                        }
                                    }
                                  })
                              }}
                              required
                              className='bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent transition-all'
                            />
                          </div>
                        )
                    })
                  }

                <div onClick={()=>setOpenAddField(true)} className=' hover:bg-primary-50 bg-white py-2 px-4 w-fit text-center font-medium border border-primary-200 text-primary-200 hover:text-primary-300 cursor-pointer rounded-full transition-colors'>
                  + Add Custom Fields
                </div>

                <button
                  className='bg-primary-200 hover:bg-primary-100 py-3 rounded-lg font-bold text-white tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5'
                >
                  Publish Product
                </button>
            </form>
        </div>

        {
          ViewImageURL && (
            <ViewImage url={ViewImageURL} close={()=>setViewImageURL("")}/>
          )
        }

        {
          openAddField && (
            <AddFieldComponent 
              value={fieldName}
              onChange={(e)=>setFieldName(e.target.value)}
              submit={handleAddField}
              close={()=>setOpenAddField(false)} 
            />
          )
        }
    </section>
  )
}

export default UploadProduct
