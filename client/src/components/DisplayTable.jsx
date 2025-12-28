import React from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'



const DisplayTable = ({ data, column }) => {
  const table = useReactTable({
    data,
    columns : column,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="">
    <table className='w-full text-left'>
      <thead className='bg-gray-100 uppercase text-xs text-gray-700 font-semibold'>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            <th className='px-6 py-4 rounded-tl-lg'>Sr.No</th>
            {headerGroup.headers.map(header => (
              <th key={header.id} className='px-6 py-4 whitespace-nowrap first:rounded-tl-lg last:rounded-tr-lg'>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className='divide-y divide-gray-200'>
        {table.getRowModel().rows.map((row,index) => (
          <tr key={row.id} className='hover:bg-gray-50 transition-colors'>
            <td className='px-6 py-4 font-medium text-gray-900'>{index+1}</td>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className='px-6 py-4 whitespace-nowrap text-gray-700'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <div className="h-4" />
  </div>
  )
}

export default DisplayTable
