import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem,fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

  const handleCashOnDelivery = async() => {
      try {
          const response = await Axios({
            ...SummaryApi.CashOnDeliveryOrder,
            data : {
              list_items : cartItemsList,
              addressId : addressList[selectAddress]?._id,
              subTotalAmt : totalPrice,
              totalAmt :  totalPrice,
            }
          })

          const { data : responseData } = response

          if(responseData.success){
              toast.success(responseData.message)
              if(fetchCartItem){
                fetchCartItem()
              }
              if(fetchOrder){
                fetchOrder()
              }
              navigate('/success',{
                state : {
                  text : "Order"
                }
              })
          }

      } catch (error) {
        AxiosToastError(error)
      }
  }

  const handleOnlinePayment = async()=>{
    try {
        toast.loading("Loading...")
        const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
        const stripePromise = await loadStripe(stripePublicKey)
       
        const response = await Axios({
            ...SummaryApi.payment_url,
            data : {
              list_items : cartItemsList,
              addressId : addressList[selectAddress]?._id,
              subTotalAmt : totalPrice,
              totalAmt :  totalPrice,
            }
        })

        const { data : responseData } = response

        stripePromise.redirectToCheckout({ sessionId : responseData.id })
        
        if(fetchCartItem){
          fetchCartItem()
        }
        if(fetchOrder){
          fetchOrder()
        }
    } catch (error) {
        AxiosToastError(error)
    }
  }
  return (
    <section className='bg-gray-50 min-h-[calc(100vh-100px)] py-8 px-4'>
      <div className='max-w-6xl mx-auto flex flex-col lg:flex-row gap-8'>
        {/* Left Side: Address Selection */}
        <div className='flex-1'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>Choose Delivery Address</h3>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='grid gap-4 md:grid-cols-2'>
              {
                addressList.map((address, index) => {
                  return (
                    <label key={"address" + index} htmlFor={"address" + index} className={`relative block cursor-pointer group ${!address.status && "hidden"}`}>
                      <input id={"address" + index} type='radio' value={index} onChange={(e) => setSelectAddress(e.target.value)} name='address' className='peer sr-only' checked={selectAddress == index} />
                      <div className='p-4 rounded-xl border-2 border-transparent bg-gray-50 peer-checked:border-primary-200 peer-checked:bg-primary-50/30 peer-checked:shadow-md transition-all h-full'>
                        <div className='flex gap-3'>
                             <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectAddress == index ? 'border-primary-200' : 'border-gray-300'}`}>
                                {selectAddress == index && <div className='w-2.5 h-2.5 rounded-full bg-primary-200'/>}
                             </div>
                            <div className='space-y-1 text-sm'>
                                <p className='font-semibold text-gray-800'>{address.address_line}</p>
                                <p className='text-gray-600'>{address.city}, {address.state}</p>
                                <p className='text-gray-600'>{address.country} - {address.pincode}</p>
                                <p className='text-gray-600 font-medium pt-1'>Mobile: {address.mobile}</p>
                            </div>
                        </div>
                      </div>
                    </label>
                  )
                })
              }
              <div onClick={() => setOpenAddress(true)} className='h-full min-h-[160px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:border-primary-200 hover:bg-primary-50/20 transition-all group'>
                 <div className='w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform'>
                    <span className='text-2xl text-gray-400 group-hover:text-primary-200'>+</span>
                 </div>
                 <span className='text-gray-500 font-medium group-hover:text-primary-200'>Add New Address</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className='w-full lg:w-[380px]'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>Order Summary</h3>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24'>
             <div className='p-6 space-y-4'>
                <h3 className='font-semibold text-gray-800 mb-4'>Bill Details</h3>
                
                <div className='flex justify-between text-gray-600'>
                  <p>Item Total</p>
                  <div className='flex items-center gap-2'>
                      <span className='line-through text-gray-400 text-sm'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                      <span className='font-medium text-gray-800'>{DisplayPriceInRupees(totalPrice)}</span>
                  </div>
                </div>
                
                <div className='flex justify-between text-gray-600'>
                  <p>Total Quantity</p>
                  <p className='font-medium text-gray-800'>{totalQty} items</p>
                </div>

                <div className='flex justify-between text-gray-600'>
                  <p>Delivery Charge</p>
                  <p className='text-green-600 font-medium'>Free</p>
                </div>
                
                <div className='my-4 border-t border-gray-100 pt-4 flex justify-between items-center'>
                  <p className='font-bold text-lg text-gray-800'>Grand Total</p>
                  <p className='font-bold text-lg text-primary-200'>{DisplayPriceInRupees(totalPrice)}</p>
                </div>
             </div>

             <div className='p-4 bg-gray-50 space-y-3'>
                <button className='w-full py-3.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-600/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2' onClick={handleOnlinePayment}>
                    Online Payment
                </button>

                <button className='w-full py-3.5 px-4 bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-800 hover:text-gray-900 rounded-xl font-bold transition-all active:scale-[0.98]' onClick={handleCashOnDelivery}>
                    Cash on Delivery
                </button>
             </div>
          </div>
        </div>
      </div>


      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }
    </section>
  )
}

export default CheckoutPage
