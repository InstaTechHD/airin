"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import styles from '../../styles/AnimeDetailsTop.module.css'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@nextui-org/react";
import Link from 'next/link'
import Addtolist from './Addtolist';
import { signIn } from 'next-auth/react';
import { useTitle } from '@/lib/store';
import { useStore } from 'zustand';

function AnimeDetailsTop({ data, list, session, setList, url }) {
  const animetitle = useStore(useTitle, (state) => state.animetitle);
  const [openlist, setOpenlist] = useState(false);

  const isAnime = data?.type === 'ANIME' || true;

  function Handlelist() {
    setOpenlist(!openlist);
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const isAdult = data.isAdult; // Assume isAdult is a property in the data
  const isUpcoming = data.status === 'RELEASING' || data.status === 'NOT_YET_RELEASED';

  return (
    <div className={styles.detailsbanner}>
      <div
        className={styles.detailsbgimage}
        style={{ backgroundImage: `url(${data?.bannerImage || data?.coverImage.extraLarge || null})`, backgroundPosition: "center", backgroundSize: "cover", height: "100%" }}
      ></div>
      <div className={styles.gradientOverlay}></div>
      <>
        <Button className={styles.detailstrailer} onPress={onOpen}>Watch Trailer</Button>
        <Modal backdrop='blur' isOpen={isOpen} onOpenChange={onOpenChange} size={"2xl"} placement="center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-0">{data.title?.[animetitle] || data?.title?.romaji}</ModalHeader>
                <ModalBody>
                  <div>
                    <iframe
                      title="Trailer"
                      className='w-[620px] h-[350px] mb-4'
                      src={`https://www.youtube.com/embed/${data?.trailer?.id}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
      <div className={styles.detailsinfo}>
        <div className={styles.detailsimgcon}>
          <Image src={data?.coverImage?.extraLarge} alt='Image' width={200} height={200} className={`${styles.detailsimage} ${isAdult ? styles.adultIcon : ''} ${isUpcoming ? styles.pulseGreen : ''}`} />
        </div>
        <div className={styles.detailstitle}>
          <h1 className={`${styles.title} text-[1.7rem] font-[500]`}>
            {data?.title?.[animetitle] || data?.title?.romaji}
          </h1>
          <h4 className={`${styles.alttitle}`}>
            {animetitle === 'romaji' ? data?.title?.english : data?.title?.romaji}
          </h4>
          <p className={styles.scores}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[17px] h-[17px] mr-[2px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.161.534l1.229 5.904c.093.448-.383.791-.78.581l-4.86-2.519a.563.563 0 00-.545 0l-4.86 2.52c-.397.209-.872-.133-.78-.581l1.229-5.904a.563.563 0 00-.161-.534L2.066 10.385c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.11z" />
            </svg>
            {data?.averageScore / 10} | <span className={`${data?.status === 'RELEASING' ? styles.activestatus : styles.notactive}`}> {data?.status}</span>
          </p>
          <div className='flex'>
            {isAnime ? (
              <Link className={`${styles.detailswatch} ${!url && 'opacity-50 bg-black pointer-events-none'} hover:opacity-80 transition-all`} href={url ?? ''}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 mr-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.3[...]
                {list !== null && list?.status === 'COMPLETED' ? 'Rewatch' : list !== null && list?.progress > 0 ? `Watch Ep ${list?.progress+1}` : `Play Now`}
              </Link>
            ) : (
              <button className={`${styles.detailswatch} opacity-40 bg-black`} disabled>
                Read Now
              </button>
            )}
            <Button className={styles.detailsaddlist} onClick={Handlelist}>{
              list && list?.status !== null
                ? 'Edit List'
                : 'Add to List'
            }</Button>
            {session?.user ? (
              <Modal isOpen={openlist} onOpenChange={Handlelist} size={"3xl"} backdrop="opaque" hideCloseButton={true} placement="center" radius="sm" scrollBehavior="outside"
                classNames={{
                  body: "p-0",
                }}>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalBody className=''>
                        <div className='relative'>
                          <div
                            className="w-full !h-40 brightness-50 rounded-t-md"
                            style={{ backgroundImage: `url(${data?.bannerImage || data?.coverImage.extraLarge || null})`, backgroundPosition: "center", backgroundSize: "cover", height: "100%", }}
                          ></div>
                          <div className='absolute z-10 bottom-1 sm:bottom-0 sm:top-[65%] left-0 sm:left-3 md:left-10 flex flex-row items-center'>
                            <Image src={data?.coverImage?.extraLarge} alt='Image' width={120} height={120} className="hidden sm:flex rounded-md" priority={true}/>
                            <div className='px-2 sm:px-4 mb-4 font-medium !text-xl text-white max-w-full line-clamp-2'>{data?.title?.[animetitle] || data?.title?.romaji}</div>
                          </div>
                        </div>
                        <div className='mt-2 sm:mt-20 md:px-[5%] px-[2%] mb-2'>
                          <Addtolist session={session} setList={setList} list={list}
                            id={data?.id} eplength={data?.episodes || data?.nextAiringEpisode?.episode - 1 || 24} Handlelist={Handlelist} />
                        </div>
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
            ) : (
              <Modal isOpen={openlist} onOpenChange={Handlelist} size={"xs"} backdrop="opaque" hideCloseButton={true} placement="center" radius="sm"
                classNames={{
                  body: "py-6 px-3",
                }}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalBody className=''>
                        <div className="text-center flex flex-col justify-center items-center">
                          <p className="text-lg mb-3">Login to edit your list.</p>
                          <button className="font-semibold outline-none border-none py-2 px-4 bg-[#4d148c] rounded-md flex items-center" onClick={() => signIn('AniListProvider')}>
                            <Image alt="anilist-icon" loading="lazy" width="25" height="25" src="/anilist.svg" className='mr-2' />
                            Login With Anilist</button>
                        </div>
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimeDetailsTop
