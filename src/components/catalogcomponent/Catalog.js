
 "use client"
import React, { useState, useEffect } from 'react';
import styles from '../../styles/Catalog.module.css';
import { Accordion, AccordionItem, Select, SelectItem, RadioGroup, Radio, Input } from "@nextui-org/react";
import { seasonOptions, genreOptions, tagsOptions, formatOptions, yearOptions, sortbyOptions, airingOptions, mangaOptions, animeOptions } from './options';
import { Combobox, Transition } from '@headlessui/react'
import Searchcard from './Searchcard';

function Catalog({ searchParams }) {
    const { year, season, format, genre, search, sortby, airing } = searchParams;
    const [selectedYear, setSelectedYear] = useState(null);
    const [seasonvalue, setSeasonvalue] = useState(null);
    const [formatvalue, setFormatvalue] = useState(null);
    const [genrevalue, setGenrevalue] = useState([]);
    const [query, setQuery] = useState('');
    const [sortbyvalue, setSortbyvalue] = useState(null);
    const [airingvalue, setAiringvalue] = useState(null);
    const [searchvalue, setSearchvalue] = useState("");
    const [showTopBottom, setShowTopBottom] = useState(true);
    const [mangavalue, setMangaValue] = useState(null); // Add state for manga dropdown
    const [animevalue, setAnimeValue] = useState(null); // Add state for anime dropdown

    useEffect(() =&gt; {
        setSelectedYear(year || null);
        setSeasonvalue(season || null);
        setFormatvalue(format || null);
        setGenrevalue(genre || []);
        setSortbyvalue(sortby || null);
        setAiringvalue(airing || null);
        setSearchvalue(search || "");
    }, [year, season, format, genre, search, sortby, airing]);

    const handleResize = () =&gt; {
        if (window.innerWidth &lt;= 1024) {
            setShowTopBottom(false);
        } else {
            setShowTopBottom(true);
        }
    };

    useEffect(() =&gt; {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () =&gt; window.removeEventListener('resize', handleResize);
    }, []);

    const toggleTopBottom = () =&gt; {
        setShowTopBottom(!showTopBottom);
    };

    const resetValues = () =&gt; {
        setSelectedYear(null);
        setSeasonvalue(null);
        setFormatvalue(null);
        setGenrevalue([]);

        setQuery('');
        setSortbyvalue(null);
        setAiringvalue(null);
        setSearchvalue("");
    };

    const handleYearClick = (yearId) =&gt; {
        setSelectedYear(yearId);
    };

    const filteredGenre =
        query === ""
            ? genreOptions
            : genreOptions.filter((item) =&gt;
                item.name
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .includes(query.toLowerCase().replace(/\s+/g, ""))
            );

    const filteredTags =
        query === ""
            ? tagsOptions
            : tagsOptions.filter((item) =&gt;
                item.name
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .includes(query.toLowerCase().replace(/\s+/g, ""))
            );

    const isFormEmpty = !selectedYear &amp;&amp; !seasonvalue &amp;&amp; !formatvalue &amp;&amp; genrevalue.length === 0 &amp;&amp; !query &amp;&amp; !sortbyvalue &amp;&amp; !airingvalue &amp;&amp; !searchvalue;

    return (
 <div classname="{styles.catalog}">
  <div classname="{styles.catalogtop}">
   <div classname="{styles.catalogsort}">
    <h3 classname="{styles.searchlabel}">
     Manga
    </h3>
    <select aria-label="manga" classname="w-full" label labelplacement="outside" onselectionchange="{setMangaValue}" placeholder="Select Manga" selectedkeys="{mangavalue}">
     {mangaOptions.map((manga) =&gt; (
     <selectitem key="{manga.value}" value="{manga.value}">
      {manga.name}
     </selectitem>
     ))}
    </select>
   </div>
   <div classname="{styles.catalogsort}">
    <h3 classname="{styles.searchlabel}">
     Anime
    </h3>
    <select aria-label="anime" classname="w-full" label labelplacement="outside" onselectionchange="{setAnimeValue}" placeholder="Select Anime" selectedkeys="{animevalue}">
     {animeOptions.map((anime) =&gt; (
     <selectitem key="{anime.value}" value="{anime.value}">
      {anime.name}
     </selectitem>
     ))}
    </select>
   </div>
   <div classname="{styles.searchmobil}">
    <div classname="{styles.search}">
     <h3 classname="{styles.searchlabel}">
      Search
     </h3>
     <input aria-label="Search" autocomplete="off" classname="w-5 h-5 text-2xl text-default-400 pointer-events-none flex-shrink-0" fill="none" isclearable key='{"outside"}' label labelplacement='{"outside"}' onvaluechange="{setSearchvalue}" placeholder="Search Anime" startcontent="{&lt;svg" stroke="currentColor" strokewidth="1.5" type="text" value="{searchvalue}" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
     <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" strokelinecap="round" strokelinejoin="round">
     </path>
     }
                        /&gt;
    </div>
    <button classname="flex lg:hidden items-end cursor-default" onclick="{toggleTopBottom}">
     <svg classname="w-6 h-6 mb-2 cursor-pointer" fill="none" stroke="currentColor" strokewidth="1.5" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" strokelinecap="round" strokelinejoin="round">
      </path>
     </svg>
    </button>
    <button classname="flex lg:hidden items-end cursor-default" disabled="{isFormEmpty}" onclick="{resetValues}">
     <svg classname="w-6 h-6 mb-2 cursor-pointer" fill="none" stroke="currentColor" strokewidth="1.5" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" strokelinecap="round" strokelinejoin="round">
      </path>
     </svg>
    </button>
   </div>
   {showTopBottom &amp;&amp; (
    &lt;&gt;
   <div classname="{styles.toptwo}">
    <div classname="{styles.genres}">
     <h3 classname="{styles.searchlabel}">
      Genres
     </h3>
     <combobox multiple onchange="{setGenrevalue}" value="{genrevalue}">
      <div classname="relative w-full cursor-default overflow-hidden rounded-[0.6rem] text-left shadow-md focus:outline-none sm:text-sm">
       <combobox.input = classname="w-full border-none py-[9px] pl-3 pr-10 text-sm leading-5 bg-[#27272a] text-[#b2b2b2] focus:ring-0 outline-none" displayvalue="{(item)">
        item?.map((item) =&gt; item?.name).join(", ")}
                            placeholder="Select Genres"
                            onChange={(event) =&gt; setQuery(event.target.value)}
                            autoComplete="off"
                        /&gt;
       </combobox.input>
      </div>
     </combobox>
    </div>
   </div>
   )}
   <combobox.button classname="absolute inset-y-0 right-0 flex items-center pr-2">
    <svg aria-hidden="true" classname="h-5 w-5 text-gray-400" data-slot="icon" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
     <path cliprule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" fillrule="evenodd">
     </path>
    </svg>
   </combobox.button>
  </div>
  <transition = afterleave="{()" enter="transition duration-100 ease-out" enterfrom="transform scale-95 opacity-0" enterto="transform scale-100 opacity-100" leave="transition duration-75 ease-out" leavefrom="transform scale-100 opacity-100" leaveto="transform scale-95 opacity-0">
   setQuery("")}
                                &gt;
   <combobox.options classname="absolute z-50 mt-1 max-h-[220px] overflow-auto !rounded-lg bg-[#18181b] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
    {filteredGenre.length === 0 &amp;&amp; filteredTags.length === 0 &amp;&amp; query !== '' ? (
    <div classname="relative cursor-default select-none px-4 py-2 text-white">
     No Such Genre.
    </div>
    ) : (
                                            &lt;&gt;
                                                {filteredGenre.map((item) =&gt; (
    <combobox.option active classname="{({" key="{item.value}" })>
     `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-[#27272a] text-white' : 'text-[#b2b2b2]'}`
                                                        }
                                                        value={item}
                                                    &gt;
                                                        {({ selected, active }) =&gt; (
                                                            &lt;&gt;
     <span ${selected 'font-medium 'font-normal'}`} : ? classname="{`block" text-white' truncate>
      {item.name}
     </span>
     {selected ? (
     <span ${active ''}`} 'text-white' : ? classname="{`absolute" flex inset-y-0 items-center pl-3 right-4>
      <svg aria-hidden="true" classname="h-5 w-5" data-slot="icon" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
       <path cliprule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" fillrule="evenodd">
       </path>
      </svg>
     </span>
     ) : null}
                                                            
                                                        )}
    </combobox.option>
    ))}
                                                {filteredTags.map((item) =&gt; (
    <combobox.option active classname="{({" key="{item.value}" })>
     `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-[#27272a] text-white' : 'text-[#b2b2b2]'}`
                                                        }
                                                        value={item}
                                                    &gt;
                                                        {({ selected, active }) =&gt; (
                                                            &lt;&gt;
     <span ${selected 'font-medium 'font-normal'}`} : ? classname="{`block" text-white' truncate>
      {item.name}
     </span>
     {selected ? (
     <span ${active ''}`} 'text-white' : ? classname="{`absolute" flex inset-y-0 items-center pl-3 right-4>
      <svg aria-hidden="true" classname="h-5 w-5" data-slot="icon" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
       <path cliprule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" fillrule="evenodd">
       </path>
      </svg>
     </span>
     ) : null}
                                                            
                                                        )}
    </combobox.option>
    ))}
                                            
                                        )}
   </combobox.options>
  </transition>
 </div>
 <div classname="{styles.catalogsort}">
  <h3 classname="{styles.searchlabel}">
   Sort by
  </h3>
  <select aria-label="Sort by" classname="max-w-xs" label labelplacement='{"outside"}' onselectionchange="{setSortbyvalue}" placeholder="Sort by" selectedkeys="{sortbyvalue}">
   {sortbyOptions.map((item) =&gt; (
   <selectitem key="{item.value}" value="{item.value}">
    {item.name}
   </selectitem>
   ))}
  </select>
 </div>
 <div classname="{styles.yearmobil}">
  <h3 classname="{styles.searchlabel}">
   Year
  </h3>
  <select aria-label="year" classname="w-full" label labelplacement="outside" placeholder="Select Year">
   {yearOptions.map((year) =&gt; (
   <selectitem = key="{year.value}" onclick="{()">
    handleYearClick(year.value)}
            &gt;
                {year.name}
   </selectitem>
   ))}
  </select>
 </div>
 <div classname="{styles.yearmobil}">
  <h3 classname="{styles.searchlabel}">
   Airing Status
  </h3>
  <select aria-label="airing" classname="w-full" label labelplacement="outside" onselectionchange="{setAiringvalue}" placeholder="Select Status" selectedkeys="{airingvalue}">
   {airingOptions.map((status) =&gt; (
   <selectitem key="{status.value}" value="{status.value}">
    {status.name}
   </selectitem>
   ))}
  </select>
 </div>
 <div classname="{styles.bottomtwo}">
  <div classname="{styles.yearmobil}">
   <h3 classname="{styles.searchlabel}">
    Format
   </h3>
   <select aria-label="format" classname="w-full" label labelplacement="outside" onselectionchange="{setFormatvalue}" placeholder="Select Format" selectedkeys="{formatvalue}">
    {formatOptions.map((format) =&gt; (
    <selectitem key="{format.value}" value="{format.value}">
     {format.name}
    </selectitem>
    ))}
   </select>
  </div>
  <div classname="{styles.yearmobil}">
   <h3 classname="{styles.searchlabel}">
    Season
   </h3>
   <select aria-label="season" classname="w-full" label labelplacement="outside" onselectionchange="{setSeasonvalue}" placeholder="Select Season" selectedkeys="{seasonvalue}">
    {seasonOptions.map((season) =&gt; (
    <selectitem key="{season.value}" value="{season.value}">
     {season.name}
    </selectitem>
    ))}
   </select>
  </div>
 </div>
</div>
<div classname="{styles.catalogbottom}">
 <div classname="{styles.catalogleft}">
  <div classname="{styles.accordion}">
   <accordion defaultexpandedkeys='{["2"]}' iscompact variant="splitted">
    <accordionitem aria-label="Accordion 1" key="2" title="Season">
     <radiogroup color="secondary" onvaluechange="{setSeasonvalue}" rounded="lg" value="{seasonvalue}">
      {seasonOptions.map((season) =&gt; (
      <radio key="{season.value}" value="{season.value}">
       {season.name}
      </radio>
      ))}
     </radiogroup>
    </accordionitem>
   </accordion>
  </div>
  <div classname="{styles.accordion}">
   <accordion defaultexpandedkeys='{["3"]}' iscompact variant="splitted">
    <accordionitem aria-label="Accordion 1" key="3" title="Format">
     <radiogroup color="secondary" onvaluechange="{setFormatvalue}" value="{formatvalue}">
      {formatOptions.map((format) =&gt; (
      <radio key="{format.value}" value="{format.value}">
       {format.name}
      </radio>
      ))}
     </radiogroup>
    </accordionitem>
   </accordion>
  </div>
  <div classname="{styles.accordion}">
   <accordion defaultexpandedkeys='{["1"]}' iscompact variant="splitted">
    <accordionitem aria-label="Accordion 1" key="1" title="Year">
     <div classname="{styles.year}">
      {yearOptions.map((year) =&gt; (
      <div ${selectedyear="year.value" : = ? classname="{`${styles.yearItem}" key="{year.value}" onclick="{()" styles.hoveryear}`} styles.selectedyear>
       handleYearClick(year.value)}
                            &gt;
                                {year.name}
      </div>
      ))}
     </div>
    </accordionitem>
   </accordion>
  </div>
  <div classname="{styles.accordion}">
   <accordion defaultexpandedkeys='{["4"]}' iscompact variant="splitted">
    <accordionitem aria-label="Accordion 1" key="4" title="Airing Status">
     <radiogroup color="secondary" onvaluechange="{setAiringvalue}" value="{airingvalue}">
      {airingOptions.map((status) =&gt; (
      <radio key="{status.value}" value="{status.value}">
       {status.name}
      </radio>
      ))}
     </radiogroup>
    </accordionitem>
   </accordion>
  </div>
  <div classname="{styles.accordion}">
   <accordion defaultexpandedkeys='{["5"]}' iscompact variant="splitted">
    <accordionitem aria-label="Accordion 1" key="5" title="Sort by">
     <radiogroup color="secondary" onvaluechange="{setSortbyvalue}" value="{sortbyvalue}">
      {sortbyOptions.map((option) =&gt; (
      <radio key="{option.value}" value="{option.value}">
       {option.name}
      </radio>
      ))}
     </radiogroup>
    </accordionitem>
   </accordion>
  </div>
 </div>
 <div classname="{styles.catalogright}">
  <searchcard airingvalue="{airingvalue}" formatvalue="{formatvalue}" genrevalue="{genrevalue}" searchvalue="{searchvalue}" seasonvalue="{seasonvalue}" selectedyear="{selectedYear}" sortbyvalue="{sortbyvalue}">
  </searchcard>
 </div>
</div>
);
}

export default Catalog;
