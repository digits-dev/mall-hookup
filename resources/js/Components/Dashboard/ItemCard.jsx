import React from 'react'
import StatCard from './StatCard'
import LineChart from './LineChart'

const ItemCard = ({title = "Sample Title", data, create_data, update_data, create_table_title, update_table_title }) => {

  return (
    <div className='border border-dashed rounded-lg p-5'>
       <p className='mb-2 font-semibold text-sm'>{title}</p>
       <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {data?.map((item) => (
            <StatCard
              key={item.label}
              value={item.value}
              label={item.label}
              sublabel={item.sublabel}
              icon={item.icon}
              gradient={item.gradient}
              href={item.href}
              name={item.name}
              total={item.total}
            />
          ))}
        </div>
        <LineChart create_data={create_data} update_data={update_data} create_table_title={create_table_title} update_table_title={update_table_title}/>
    </div>
  )
}

export default ItemCard