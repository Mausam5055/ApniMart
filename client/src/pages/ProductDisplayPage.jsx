import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'

import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data,setData] = useState({
    name : "",
    image : []
  })
  const [image,setImage] = useState(0)
  const [loading,setLoading] = useState(false)
  const imageContainer = useRef()

  const fetchProductDetails = async()=>{
    try {
        const response = await Axios({
          ...SummaryApi.getProductDetails,
          data : {
            productId : productId 
          }
        })

        const { data : responseData } = response

        if(responseData.success){
          setData(responseData.data)
        }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchProductDetails()
  },[params])
  

  console.log("product data",data)

  const dummyReviews = [
    { id: 1, name: "Suresh Kumar", rating: 5, comment: "Excellent quality atta, rotis are very soft.", date: "2 days ago" },
    { id: 2, name: "Priya Sharma", rating: 4, comment: "Good packaging and timely delivery by Blinkit.", date: "1 week ago" },
    { id: 3, name: "Amit Patel", rating: 5, comment: "Genuine product. Will buy again.", date: "2 weeks ago" },
  ];

  return (
    <section className='container mx-auto p-4 lg:p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:grid-flow-row-dense'>
            {/* Image Gallery - Order 1 on Mobile, Col 1 Row 1 on Desktop */}
            <div className='flex flex-col gap-4 order-1 lg:col-span-1 lg:row-span-1'>
                <div className='bg-white rounded-xl shadow-sm border border-gray-100 lg:h-[60vh] h-80 w-full overflow-hidden flex items-center justify-center relative p-4'>
                    <img
                        src={data.image[image]}
                        className='w-full h-full object-contain hover:scale-105 transition-transform duration-300'
                        alt={data.name}
                    /> 
                </div>
                
                {/* Thumbnails */}
                <div className='relative w-full'>
                    <div ref={imageContainer} className='flex gap-4 w-full overflow-x-auto scrollbar-none py-2 px-1'>
                        {
                            data.image.map((img,index)=>{
                                return(
                                    <div 
                                        key={img+index} 
                                        className={`w-20 h-20 min-w-[5rem] rounded-lg cursor-pointer border-2 overflow-hidden transition-all ${index === image ? 'border-green-600 shadow-md transform scale-105' : 'border-gray-200 hover:border-green-400'}`}
                                        onClick={()=>setImage(index)}
                                    >
                                        <img
                                            src={img}
                                            alt={`product-thumbnail-${index}`}
                                            className='w-full h-full object-cover' 
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            {/* Product Details - Order 2 on Mobile, Col 2 Row 1-2 on Desktop */}
            <div className='flex flex-col gap-6 order-2 lg:col-span-1 lg:row-span-2 h-fit'>
                <div>
                    <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase'>10 Min Delivery</span>
                    <h1 className='text-2xl lg:text-4xl font-bold text-gray-800 mt-3 leading-tight'>{data.name}</h1>  
                    <p className='text-gray-500 mt-1 font-medium'>{data.unit}</p> 
                </div>

                <Divider/>

                <div>
                    <p className='text-sm text-gray-500 font-medium mb-1'>Price</p> 
                    <div className='flex items-baseline gap-4'>
                        <span className='text-3xl font-bold text-gray-900'>
                            {DisplayPriceInRupees(pricewithDiscount(data.price,data.discount))}
                        </span>
                        {data.discount > 0 && (
                            <>
                                <span className='text-lg text-gray-400 line-through'>
                                    {DisplayPriceInRupees(data.price)}
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                    {data.discount}% OFF
                                </span>
                            </>
                        )}
                    </div>
                </div> 
                  
                {
                    data.stock === 0 ? (
                        <div className='p-4 bg-red-50 border border-red-100 rounded-lg text-center'>
                            <p className='text-lg font-bold text-red-600'>Out of Stock</p>
                            <p className='text-sm text-red-500'>This item is currently unavailable.</p>
                        </div>
                    ) : (
                        <div className='w-full lg:w-fit'>
                            <AddToCartButton data={data} />
                        </div>
                    )
                }
               
                <div className='bg-gray-50 p-6 rounded-xl border border-gray-100'>
                    <h2 className='font-bold text-gray-800 mb-4 text-lg'>Why shop from Binkeyit?</h2>
                    <div className='grid gap-6'>
                        <div className='flex items-start gap-4'>
                            <div className='bg-white p-2 rounded-full shadow-sm'>
                                <img src={image1} alt='superfast delivery' className='w-10 h-10 object-contain'/>
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-900'>Superfast Delivery</h3>
                                <p className='text-sm text-gray-600 leading-relaxed'>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
                            </div>
                        </div>
                        <div className='flex items-start gap-4'>
                             <div className='bg-white p-2 rounded-full shadow-sm'>
                                <img src={image2} alt='Best prices offers' className='w-10 h-10 object-contain'/>
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-900'>Best Prices & Offers</h3>
                                <p className='text-sm text-gray-600 leading-relaxed'>Best price destination with offers directly from the manufacturers.</p>
                            </div>
                        </div>
                        <div className='flex items-start gap-4'>
                             <div className='bg-white p-2 rounded-full shadow-sm'>
                                <img src={image3} alt='Wide Assortment' className='w-10 h-10 object-contain'/>
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-900'>Wide Assortment</h3>
                                <p className='text-sm text-gray-600 leading-relaxed'>Choose from 5000+ products across food, personal care, household & other categories.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='space-y-4'>
                    <div>
                        <h3 className='font-bold text-gray-900 text-lg mb-2'>Description</h3>
                        <p className='text-gray-600 leading-relaxed'>{data.description}</p>
                    </div>
                    {
                        data?.more_details && Object.keys(data?.more_details).map((element,index)=>{
                            return(
                                <div key={index} className="border-t border-gray-100 pt-3">
                                    <p className='font-semibold text-gray-800 capitalize'>{element}</p>
                                    <p className='text-gray-600'>{data?.more_details[element]}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {/* Application Reviews - Order 3 on Mobile, Col 1 Row 2 on Desktop */}
            <div className='order-3 lg:col-span-1 lg:row-span-1'>
                 <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-bold text-gray-900 text-lg'>Ratings & Reviews</h3>
                        <span className='px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded'>4.8 ★</span>
                    </div>
                    <div className='space-y-6'>
                        {dummyReviews.map((review) => (
                            <div key={review.id} className='border-b border-gray-50 last:border-0 pb-4 last:pb-0'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600'>
                                            {review.name.charAt(0)}
                                        </div>
                                        <p className='font-semibold text-gray-800 text-sm'>{review.name}</p>
                                    </div>
                                    <p className='text-xs text-gray-400'>{review.date}</p>
                                </div>
                                <div className='ml-10 mt-1'>
                                    <div className='flex gap-1 mb-1'>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                                        ))}
                                    </div>
                                    <p className='text-sm text-gray-600 leading-relaxed'>{review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className='w-full mt-4 py-2 text-green-600 font-semibold text-sm hover:bg-green-50 rounded transition-colors'>
                        View All 128 Reviews
                    </button>
                 </div>
            </div>
        </div>
    </section>
  )
}

export default ProductDisplayPage
