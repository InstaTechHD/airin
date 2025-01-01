"use client"
import React, { useState, useEffect } from 'react';
import styles from '../../styles/Catalog.module.css';
import { Accordion, AccordionItem, Select, SelectItem, RadioGroup, Radio, Input } from "@nextui-org/react";
import { seasonOptions, genreOptions, tagsOptions, formatOptions, yearOptions, sortbyOptions, airingOptions, mangaOptions, animeOptions } from './options';
import { Combobox, Transition } from '@headlessui/react';
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

  useEffect(() => {
    setSelectedYear(year || null);
    setSeasonvalue(season || null);
    setFormatvalue(format || null);
    setGenrevalue(genre || []);
    setSortbyvalue(sortby || null);
    setAiringvalue(airing || null);
    setSearchvalue(search || "");
  }, [year, season, format, genre, search, sortby, airing]);

  const handleResize = () => {
    if (window.innerWidth <= 1024) {
      setShowTopBottom(false);
    } else {
      setShowTopBottom(true);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTopBottom = () => {
    setShowTopBottom(!showTopBottom);
  };

  const resetValues = () => {
    setSelectedYear(null);
    setSeasonvalue(null);
    setFormatvalue(null);
    setGenrevalue([]);
    setQuery('');
    setSortbyvalue(null);
    setAiringvalue(null);
    setSearchvalue("");
  };

  const handleYearClick = (yearId) => {
    setSelectedYear(yearId);
  };

  const filteredGenre =
    query === ""
      ? genreOptions
      : genreOptions.filter((item) =>
          item.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const filteredTags =
    query === ""
      ? tagsOptions
      : tagsOptions.filter((item) =>
          item.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const isFormEmpty = !selectedYear && !seasonvalue && !formatvalue && genrevalue.length === 0 && !query && !sortbyvalue && !airingvalue && !searchvalue;

  return (
    <div className={styles.catalog}>
      <div className={styles.catalogtop}>
        <div className={styles.catalogsort}>
          <h3 className={styles.searchlabel}>Manga</h3>
          <Select
            label=""
            aria-label='manga'
            labelPlacement='outside'
            placeholder="Select Manga"
            className="w-full"
            selectedKeys={mangavalue}
            onSelectionChange={setMangaValue}
          >
            {mangaOptions.map((manga) => (
              <SelectItem key={manga.value} value={manga.value}>
                {manga.name}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className={styles.catalogsort}>
          <h3 className={styles.searchlabel}>Anime</h3>
          <Select
            label=""
            aria-label='anime'
            labelPlacement='outside'
            placeholder="Select Anime"
            className="w-full"
            selectedKeys={animevalue}
            onSelectionChange={setAnimeValue}
          >
            {animeOptions.map((anime) => (
              <SelectItem key={anime.value} value={anime.value}>
                {anime.name}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className={styles.searchmobil}>
          <div className={styles.search}>
            <h3 className={styles.searchlabel}>Search</h3>
            <Input
              key={"outside"}
              type="text"
              label=""
              aria-label="Search"
              labelPlacement={"outside"}
              placeholder="Search Anime"
              value={searchvalue}
              onValueChange={setSearchvalue}
              isClearable
              autoComplete="off"
              startContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-2xl text-default">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              }
            />
          </div>
          <button className='flex lg:hidden items-end cursor-default' onClick={toggleTopBottom}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mb-2 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.007H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 17.25h.007v.007H3.75V17.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>
          <button className='flex lg:hidden items-end cursor-default' onClick={resetValues} disabled={isFormEmpty}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mb-2 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.75 5.79m14.478-.166c.327-.052.655-.107.983-.165m-16.44.165c.34-.059.68-.114 1.022-.166m0 0L5.84 19.673A2.25 2.25 0 0 0 8.084 21.75h7.832a2.25 2.25 0 0 0 2.244-2.077L19.25 5.79m-14.478-.166c.342.052.682.107 1.022.166m-1.022-.165A48.108 48.108 0 0 1 12 5.25c2.757 0 5.514.218 8.228.621" />
            </svg>
          </button>
        </div>
        {showTopBottom && (
          <>
            <div className={styles.toptwo}>
              <div className={styles.genres}>
                <h3 className={styles.searchlabel}>Genres</h3>
                <Combobox value={genrevalue} onChange={setGenrevalue} multiple>
                  <div className="relative w-full cursor-default overflow-hidden rounded-[0.6rem] text-left shadow-md focus:outline-none sm:text-sm">
                    <Combobox.Input
                      className="w-full border-none py-[9px] pl-3 pr-10 text-sm leading-5 bg-[#27272a] text-[#b2b2b2] focus:ring-0 outline-none"
                      displayValue={(item) => item?.map((item) => item?.name).join(", ")}
                      placeholder="Select Genres"
                      onChange={(event) => setQuery(event.target.value)}
                      autoComplete="off"
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" className="h-5 w-5 text-gray-400">
                        <path fillRule="evenodd" d="M10 3a1 1 0 0 1 .707.293l5 5a1 1 0 1 1-1.414 1.414L11 6.414V16a1 1 0 1 1-2 0V6.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l5-5A1 1 0 0 1 10 3z" clipRule="evenodd" />
                      </svg>
                    </Combobox.Button>
                  </div>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                    afterLeave={() => setQuery("")}
                  >
                    <Combobox.Options className="absolute z-50 mt-1 max-h-[220px] overflow-auto !rounded-lg bg-[#18181b] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredGenre.length === 0 && filteredTags.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-white">
                          No Such Genre.
                        </div>
                      ) : (
                        <>
                          {filteredGenre.map((item) => (
                            <Combobox.Option
                              key={item.value}
                              className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-[#27272a] text-white' : 'text-[#b2b2b2]'}`}
                              value={item}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium text-white' : 'font-normal'}`}>
                                    {item.name}
                                  </span>
                                  {selected ? (
                                    <span className={`absolute inset-y-0 right-4 flex items-center pl-3 ${active ? 'text-white' : ''}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" className="h-5 w-5">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 0 1 .707.293l5 5a1 1 0 1 1-1.414 1.414L11 6.414V16a1 1 0 1 1-2 0V6.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l5-5A1 1 0 0 1 10 3z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                          {filteredTags.map((item) => (
                            <Combobox.Option
                              key={item.value}
                              className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-[#27272a] text-white' : 'text-[#b2b2b2]'}`}
                              value={item}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium text-white' : 'font-normal'}`}>
                                    {item.name}
                                  </span>
                                  {selected ? (
                                    <span className={`absolute inset-y-0 right-4 flex items-center pl-3 ${active ? 'text-white' : ''}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" className="h-5 w-5">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 0 1 .707.293l5 5a1 1 0 1 1-1.414 1.414L11 6.414V16a1 1 0 1 1-2 0V6.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l5-5A1 1 0 0 1 10 3z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </>
                      )}
                    </Combobox.Options>
              </Transition>
            </Combobox>
          </div>
        </div>
      </>
    )}
    <div className={styles.catalogsort}>
      <h3 className={styles.searchlabel}>Sort by</h3>
      <Select
        labelPlacement={"outside"}
        label=""
        aria-label="Sort by"
        placeholder="Sort by"
        selectedKeys={sortbyvalue}
        className="max-w-xs"
        onSelectionChange={setSortbyvalue}
      >
        {sortbyOptions.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.name}
          </SelectItem>
        ))}
      </Select>
    </div>
    <div className={styles.yearmobil}>
      <h3 className={styles.searchlabel}>Year</h3>
      <Select
        label=""
        aria-label='year'
        labelPlacement='outside'
        placeholder="Select Year"
        className="w-full"
      >
        {yearOptions.map((year) => (
          <SelectItem key={year.value} onClick={() => handleYearClick(year.value)}>
            {year.name}
          </SelectItem>
        ))}
      </Select>
    </div>
    <div className={styles.yearmobil}>
      <h3 className={styles.searchlabel}>Airing Status</h3>
      <Select
        label=""
        aria-label='airing'
        labelPlacement='outside'
        placeholder="Select Status"
        className="w-full"
        selectedKeys={airingvalue}
        onSelectionChange={setAiringvalue}
      >
        {airingOptions.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.name}
          </SelectItem>
        ))}
      </Select>
    </div>
    <div className={styles.bottomtwo}>
      <div className={styles.yearmobil}>
        <h3 className={styles.searchlabel}>Format</h3>
        <Select
          label=""
          aria-label='format'
          labelPlacement='outside'
          placeholder="Select Format"
          className="w-full"
          selectedKeys={formatvalue}
          onSelectionChange={setFormatvalue}
        >
          {formatOptions.map((format) => (
            <SelectItem key={format.value} value={format.value}>
              {format.name}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className={styles.yearmobil}>
        <h3 className={styles.searchlabel}>Season</h3>
        <Select
          label=""
          aria-label='season'
          labelPlacement='outside'
          placeholder="Select Season"
          className="w-full"
          selectedKeys={seasonvalue}
          onSelectionChange={setSeasonvalue}
        >
          {seasonOptions.map((season) => (
            <SelectItem key={season.value} value={season.value}>
              {season.name}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  </div>
  <div className={styles.catalogbottom}>
    <div className={styles.catalogleft}>
      <div className={styles.accordion}>
        <Accordion isCompact variant="splitted" defaultExpandedKeys={["2"]}>
          <AccordionItem key="2" aria-label="Accordion 1" title="Season">
            <RadioGroup
              color="secondary"
              rounded="lg"
              value={seasonvalue}
              onValueChange={setSeasonvalue}
            >
              {seasonOptions.map((season) => (
                <Radio value={season.value} key={season.value}>{season.name}</Radio>
              ))}
            </RadioGroup>
          </AccordionItem>
        </Accordion>
      </div>
      <div className={styles.accordion}>
        <Accordion isCompact variant="splitted" defaultExpandedKeys={["3"]}>
          <AccordionItem key="3" aria-label="Accordion 1" title="Format">
            <RadioGroup
              color="secondary"
              value={formatvalue}
              onValueChange={setFormatvalue}
            >
              {formatOptions.map((format) => (
                <Radio value={format.value} key={format.value}>{format.name}</Radio>
              ))}
            </RadioGroup>
          </AccordionItem>
        </Accordion>
      </div>
      <div className={styles.accordion}>
        <Accordion defaultExpandedKeys={["1"]} isCompact variant="splitted">
          <AccordionItem aria-label="Accordion 1" key="1" title="Year">
            <div className={styles.year}>
              {yearOptions.map((year) => (
                <div
                  key={year.value}
                  className={`${styles.yearItem} ${selectedYear === year.value ? styles.selectedYear : styles.hoverYear}`}
                  onClick={() => handleYearClick(year.value)}
                >
                  {year.name}
                </div>
              ))}
            </div>
          </AccordionItem>
        </Accordion>
      </div>
      <div className={styles.accordion}>
        <Accordion defaultExpandedKeys={["4"]} isCompact variant="splitted">
          <AccordionItem aria-label="Accordion 1" key="4" title="Airing Status">
            <RadioGroup color="secondary" onValueChange={setAiringvalue} value={airingvalue}>
              {airingOptions.map((status) => (
                <Radio key={status.value} value={status.value}>
                  {status.name}
                </Radio>
              ))}
            </RadioGroup>
          </AccordionItem>
        </Accordion>
      </div>
      <div className={styles.accordion}>
        <Accordion defaultExpandedKeys={["5"]} isCompact variant="splitted">
          <AccordionItem aria-label="Accordion 1" key="5" title="Sort by">
            <RadioGroup color="secondary" onValueChange={setSortbyvalue} value={sortbyvalue}>
              {sortbyOptions.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.name}
                </Radio>
              ))}
            </RadioGroup>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
    <div className={styles.catalogright}>
      <Searchcard
        airingvalue={airingvalue}
        formatvalue={formatvalue}
        genrevalue={genrevalue}
        searchvalue={searchvalue}
        seasonvalue={seasonvalue}
        selectedyear={selectedYear}
        sortbyvalue={sortbyvalue}
      />
    </div>
  </div>
</div>
);
}

export default Catalog;
  
