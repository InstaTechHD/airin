import React from 'react'
import Catalog from '@/components/catalogcomponent/Catalog'
import Navbarcomponent from '@/components/navbar/Navbar'
import Search from '@/components/search/Search'

export async function generateMetadata({ params }) {
  return {
    title: "Makima - Manga Catalog",
    openGraph: {
      title: "Makima - Manga Catalog",
    },
    twitter: {
      card: "summary",
      title: "Makima - Manga Catalog",
    },
  }
}

function page({ searchParams }) {
  return (
    <div>
      <Navbarcomponent />
      <div className='max-w-[94%] xl:max-w-[88%] mx-auto mt-[70px]'>
        <Catalog searchParams={searchParams} />
      </div>
      <Search searchType="manga" />
    </div>
  )
}

export default page
