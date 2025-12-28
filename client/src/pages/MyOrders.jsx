import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  console.log("order Items",orders)
  return (
    <div className='max-w-4xl mx-auto p-4'>
      <div className='bg-white shadow-sm p-4 rounded-xl mb-6 border border-gray-100 flex items-center justify-between'>
        <h1 className='font-bold text-xl text-gray-800 tracking-tight'>My Orders</h1>
        <span className='text-sm text-gray-500 font-medium'>{orders.length} Items</span>
      </div>
        {
          !orders[0] && (
            <NoData/>
          )
        }
        <div className='grid gap-4'>
        {
          orders.map((order,index)=>{
            return(
              <div key={order._id+index+"order"} className='bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow duration-300'>
                  <div className='flex gap-4 flex-1'>
                    <div className='w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100'>
                        <img
                          src={order.product_details.image[0]} 
                          className='w-full h-full object-scale-down mix-blend-multiply'
                          alt={order.product_details.name}
                        />
                    </div>
                    <div className='flex flex-col justify-between py-1'>
                        <div>
                            <p className='font-semibold text-gray-800 text-lg line-clamp-2'>{order.product_details.name}</p>
                            <p className='text-gray-500 text-sm mt-1'>Order ID: <span className='font-mono text-gray-700 bg-gray-100 px-1 rounded'>{order?.orderId}</span></p>
                        </div>
                        <div className='mt-2'>
                           {/* Add status or price here if available in object, otherwise keeping it minimal */}
                           <span className='bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium'>Confirmed</span>
                        </div>
                    </div>
                  </div>
              </div>
            )
          })
        }
        </div>
    </div>
  )
}

export default MyOrders
