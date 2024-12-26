"use client";
import React, { useEffect, useState } from "react";
import { Select, SelectItem, Tooltip } from "@nextui-org/react";
import styles from '../styles/Episodesection.module.css';
import { getEpisodes } from "@/actions/episode";
import { ProvidersMap } from "@/utils/EpisodeFunctions";
import EpImageList from "./Episodelists/EpImageList";
import EpNumList from "./Episodelists/EpNumList";
import EpImgContent from "./Episodelists/EpImgContent";
import { toast } from "sonner";
import { useSubtype } from '@/lib/store';
import { useStore } from 'zustand';
import axios from 'axios';

function Episodesection({ data, id, progress, setUrl }) {
  const subtype = useStore(useSubtype, (state) => state.subtype);
  const [loading, setloading] = useState(true);
  const [reversed, setReversed] = useState(false);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [selectedRange, setSelectedRange] = useState("1-100");

  const [eplisttype, setEplistType] = useState(2);
  const [showSelect, setShowSelect] = useState(false);

  const [defaultProvider, setdefaultProvider] = useState("");
  const [suboptions, setSuboptions] = useState(null);
  const [episodeData, setEpisodeData] = useState(null);
  const [dubcount, setDubcount] = useState(0);
  const [currentEpisodes, setCurrentEpisodes] = useState(null);

  useEffect(() => {
    const listtype = localStorage.getItem('eplisttype');
    if (listtype) {
      setEplistType(parseInt(listtype, 10));
    }
  }, []);

  const toggleShowSelect = () => {
    setShowSelect(!showSelect);
  };

  const handleSubDub = (e) => {
    useSubtype.setState({ subtype: e.target.value })
  };

  const handleOptionClick = (option) => {
    setEplistType(option);
    localStorage.setItem('eplisttype', option.toString());
  };

  useEffect(() => {
    const fetchepisodes = async () => {
      try {
        const response = await getEpisodes(id, data?.status === "RELEASING", false);
        setEpisodeData(response);
        if (response) {
          const { suboptions, dubLength } = ProvidersMap(response, defaultProvider, setdefaultProvider);
          setSuboptions(suboptions);
          setDubcount(dubLength);
        }
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
      }
    };

    const fetchMangaPages = async () => {
      try {
        const response = await axios.get(`https://api.mangadex.org/manga/${id}/feed`);
        const pages = response.data.data.map((page, index) => ({
          number: index + 1,
          id: page.id,
          url: `/manga/read/${id}/page/${index + 1}`,
          title: `Page ${index + 1}`,
        }));
        setEpisodeData(pages);
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
      }
    };

    if (data?.type === 'MANGA') {
      fetchMangaPages();
    } else if (data?.type !== 'NOT_YET_RELEASED') {
      fetchepisodes();
    }
  }, [data?.id, data?.type, defaultProvider]);

  const handleProviderChange = (event) => {
    setdefaultProvider(event.target.value);
  };

  useEffect(() => {
    const provider = episodeData?.find((i) => i.providerId === defaultProvider);
    const filteredEp = provider?.consumet === true
      ? subtype === 'sub' ? provider?.episodes?.sub : provider?.episodes?.dub
      : subtype === 'dub'
        ? provider?.episodes?.slice(0, dubcount) : provider?.episodes;

    setCurrentEpisodes(filteredEp ?? []);
  }, [subtype, episodeData, defaultProvider]);

  const totalEpisodes = currentEpisodes?.length || 0;

  const episodeRangeOptions = [];
  if (totalEpisodes <= 100) {
    episodeRangeOptions.push({ label: `1-${totalEpisodes}`, value: `1-${totalEpisodes}` });
  } else {
    for (let i = 0; i < totalEpisodes; i += 100) {
      const start = i + 1;
      const end = Math.min(i + 100, totalEpisodes);
      const label = `${start}-${end}`;
      episodeRangeOptions.push({ label, value: `${start}-${end}` });
    }
  }

  const handleRangeChange = (e) => {
    const [start, end] = e.target.value.split('-').map(Number);
    const selectedEpisodes = currentEpisodes?.slice(start - 1, end);
    setFilteredEpisodes(selectedEpisodes);
    setSelectedRange(e.target.value);
  };

  useEffect(() => {
    const initialEpisodes = currentEpisodes?.slice(0, 100);
    setFilteredEpisodes(initialEpisodes || null);
  }, [currentEpisodes, totalEpisodes]);

  const reverseOrder = () => {
    setReversed(!reversed);
  };

  const refreshEpisodes = async () => {
    setloading(true);
    try {
      const response = await getEpisodes(id, data?.status === "RELEASING", true);
      setEpisodeData(response);
      if (response) {
        const { suboptions, dubLength } = ProvidersMap(response, defaultProvider, setdefaultProvider);
        setSuboptions(suboptions);
        setDubcount(dubLength);
      }
      setloading(false);
      toast.success("Episodes refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing episodes:", error);
      toast.error("Oops! Something went wrong. If episodes don't appear, please refresh the page.");
      setloading(false);
    }
  };

  useEffect(() => {
    if (currentEpisodes) {
      const episode = data?.nextAiringEpisode ? currentEpisodes?.find((i) => i.number === progress + 1) : currentEpisodes[0];
      if (episode) {
        const watchurl = `/anime/watch?id=${data?.id}&host=${defaultProvider}&epid=${encodeURIComponent(episode?.id || episode?.episodeId)}&ep=${episode?.number}&type=${subtype}`;
        setUrl(watchurl);
      } else {
        setUrl(null);
      }
    }
  }, [currentEpisodes, progress, defaultProvider]);

  return (
    <div className={styles.episodesection}>
      <div className={styles.eptopsection}>
        <div className={styles.epleft}>
          <div className={styles.cardhead}>
            <span className={styles.bar}></span>
            <h1 className={styles.headtitle}>Episodes</h1>
          </div>
          {data?.status !== 'NOT_YET_RELEASED' && data?.type !== 'MANGA' &&
            <Tooltip content="Refresh Episodes">
              <button className={styles.refresh} onClick={refreshEpisodes}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-[22px] h-[22px] ${loading ? "animate-spin" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25[...]
                </svg>
              </button>
            </Tooltip>
          }
        </div>
        {!loading && <>
          {<>
            <div className={styles.epright}>
              <div className={styles.selects}>
                {totalEpisodes > 100 && (
                  <div className="flex flex-col w-[120px] mr-2">
                    <Select
                      label=""
                      aria-label="Episode Range"
                      placeholder={`Episodes`}
                      labelPlacement="outside"
                      selectedKeys={[selectedRange.toString()]}
                      disallowEmptySelection={true}
                      classNames={{
                        base: "!m-0 !p-0 ",
                        mainWrapper: "p-0 m-0 h-[34px]",
                        trigger: "m-0 !min-h-[34px] !max-w-[115px] pr-0",
                        value: "",
                        listbox: "m-0 p-0",
                      }}
                      radius="sm"
                      onChange={handleRangeChange}
                    >
                      {episodeRangeOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}
                <div className="flex w-[133px] flex-col gap-2 mr-3">
                  <Select
                    label=""
                    aria-label="Switch"
                    placeholder={`Switch`}
                    labelPlacement="outside"
                    selectedKeys={[defaultProvider]}
                    classNames={{
                      base: "!m-0 !p-0 ",
                      mainWrapper: "p-0 m-0 h-[34px]",
                      trigger: "m-0 !min-h-[34px] !max-w-[128px] pr-0",
                      value: "",
                      listbox: "m-0 p-0",
                    }}
                    radius="sm"
                    onChange={handleProviderChange}
                    disallowEmptySelection={true}
                  >
                    {episodeData?.map((item) => (
                      <SelectItem key={item.providerId} value={item.providerId}>
                        {item.providerId}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex w-[75px] flex-col gap-2 mr-2">
                  <Select
                    label=""
                    aria-label="Switch"
                    placeholder={`Switch`}
                    labelPlacement="outside"
                    selectedKeys={[subtype]}
                    classNames={{
                      base: "!m-0 !p-0 ",
                      mainWrapper: "p-0 m-0 !h-[34px]",
                      trigger: "m-0 !min-h-[34px] !max-w-[70px] pr-0",
                      value: "",
                      listbox: "m-0 p-0",
                    }}
                    radius="sm"
                    onChange={handleSubDub}
                    disallowEmptySelection={true}
                  >
                    {suboptions?.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className={styles.epchangeicons}>
                <div className={styles.epchangeopt}>
                  <span
                    className={`mx-[6px] cursor-pointer ${eplisttype === 1 ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={`${eplisttype === 1 ? '#ca1313' : 'currentColor'}`} className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6[...]
                    </svg>
                  </span>
                  <span
                    className={`mx-[6px] cursor-pointer ${eplisttype === 2 ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(2)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={`${eplisttype === 2 ? '#ca1313' : 'currentColor'}`} className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.04[...]
                    </svg>
                  </span>
                  <span
                    className={`mx-[6px] cursor-pointer ${eplisttype === 3 ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(3)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={`${eplisttype === 3 ? '#ca1313' : 'currentColor'}`} className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                    </svg>
                  </span>
                </div>
                <button className={styles.refresh} onClick={reverseOrder}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[22px] h-[22px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                  </svg>
                </button>
                <span className={styles.toggleicons} onClick={toggleShowSelect}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.[...]
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </span>
              </div>
            </div>
          </>
          }
        </>}
      </div>
      {showSelect && (
        <div className={styles.selectmobile}>
          <div className="flex w-[75px] flex-col gap-2 mr-2">
            <Select
              label=""
              aria-label="Switch"
              placeholder={`Switch`}
              labelPlacement="outside"
              selectedKeys={[subtype]}
              classNames={{
                base: "!m-0 !p-0 ",
                mainWrapper: "p-0 m-0 !h-[34px]",
                trigger: "m-0 !min-h-[34px] !max-w-[70px] pr-0",
                value: "",
                listbox: "m-0 p-0",
              }}
              radius="sm"
              onChange={handleSubDub}
              disallowEmptySelection={true}
            >
              {suboptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </Select>
          </div>
          {totalEpisodes > 100 && (
            <div className="flex flex-col w-[120px] mr-2">
              <Select
                label=""
                aria-label="Episode Range"
                placeholder={`Episodes`}
                labelPlacement="outside"
                selectedKeys={[selectedRange.toString()]}
                disallowEmptySelection={true}
                classNames={{
                  base: "!m-0 !p-0 ",
                  mainWrapper: "p-0 m-0 h-[34px]",
                  trigger: "m-0 !min-h-[34px] !max-w-[115px] pr-0",
                  value: "",
                  listbox: "m-0 p-0",
                }}
                radius="sm"
                onChange={handleRangeChange}
              >
                {episodeRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}
          <div className="flex w-[133px] flex-col gap-2 mr-3">
            <Select
              label=""
              aria-label="Switch"
              placeholder={`Switch`}
              labelPlacement="outside"
              selectedKeys={[defaultProvider]}
              classNames={{
                base: "!m-0 !p-0 ",
                mainWrapper: "p-0 m-0 h-[34px]",
                trigger: "m-0 !min-h-[34px] !max-w-[128px] pr-0",
                value: "",
                listbox: "m-0 p-0",
              }}
              radius="sm"
              onChange={handleProviderChange}
              disallowEmptySelection={true}
            >
              {episodeData?.map((item) => (
                <SelectItem key={item.providerId} value={item.providerId}>
                  {item.providerId}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      )}
      {loading && (
        <>
          {data?.type === 'MANGA' ? (
            <div className="text-[17px] font-semibold">
              <p className="text-center mt-4">Coming Soon! </p>
              <p className="text-center mb-4 ">Cannot Fetch Manga, Feature Coming Soon.</p>
            </div>
          ) : data?.status === 'NOT_YET_RELEASED' ? (
            <div className="text-[17px] font-semibold">
              <p className="text-center mt-4">Coming Soon! </p>
              <p className="text-center mb-4">Sorry, this anime isn't out yet. Keep an eye out for updates!</p>
            </div>

          ) : (
            <div className="text-[17px] font-semibold">
              <p className="text-center mt-4 mb-1">Please Wait... </p>
              <p className="text-center mb-4">Loading Episode Data</p>
            </div>
          )}
        </>
      )}

      {!loading && !filteredEpisodes && (
        <div className="text-[17px] font-semibold">
          <p className="text-center mt-4">Oh no! </p>
          <p className="text-center mb-4">This anime is currently unavailable. Check back later for updates!</p>
        </div>
      )}
      {!loading && (
        <>
          {eplisttype === 3 && (
            <div className={styles.epnumlist}>
              <EpNumList data={data} epdata={filteredEpisodes} defaultProvider={defaultProvider} subtype={subtype} progress={progress}/>
            </div>
          )}
          {eplisttype === 2 && (
            <div className={styles.epimgconist}>
              <EpImgContent data={data} epdata={filteredEpisodes} defaultProvider={defaultProvider} subtype={subtype} progress={progress}/>
            </div>
          )}
          {eplisttype === 1 && (
            <div className={styles.epimagelist}>
              <EpImageList data={data} epdata={filteredEpisodes} defaultProvider={defaultProvider} subtype={subtype} progress={progress}/>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Episodesection;
