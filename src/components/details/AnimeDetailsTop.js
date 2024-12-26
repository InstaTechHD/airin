"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../styles/AnimeDetailsTop.module.css";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import Addtolist from "./Addtolist";
import { signIn } from "next-auth/react";
import { useTitle } from "@/lib/store";
import { useStore } from "zustand";
import axios from "axios";

async function fetchMangaDexData(mangaId) {
  const response = await axios.get(`https://api.mangadex.org/manga/${mangaId}`);
  return response.data;
}

async function fetchMangaPages(mangaId) {
  const response = await axios.get(`https://api.mangadex.org/manga/${mangaId}/feed`);
  return response.data;
}

function AnimeDetailsTop({ data, list, session, setList, url }) {
  const animetitle = useStore(useTitle, (state) => state.animetitle);
  const [openlist, setOpenlist] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [mangaData, setMangaData] = useState(null);
  const [pages, setPages] = useState([]);

  const isAnime = data?.type === "ANIME";

  useEffect(() => {
    if (!isAnime) {
      fetchMangaDexData(data.id).then(setMangaData);
      fetchMangaPages(data.id).then((response) => {
        setPages(response.data);
      });
    }
  }, [data, isAnime]);

  function Handlelist() {
    setOpenlist(!openlist);
  }

  return (
    <div className={styles.detailsbanner}>
      <div
        className={styles.detailsbgimage}
        style={{
          backgroundImage: `url(${data?.bannerImage || data?.coverImage?.extraLarge || null})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "100%",
        }}
      ></div>
      <div className={styles.gradientOverlay}></div>
      <Button className={styles.detailstrailer} onPress={onOpen}>
        Watch Trailer
      </Button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={"2xl"}
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-0">
            {data?.title?.[animetitle] || data?.title?.romaji}
          </ModalHeader>
          <ModalBody>
            <div>
              <iframe
                title="Trailer"
                className="w-[620px] h-[350px] mb-4"
                src={`https://www.youtube.com/embed/${data?.trailer?.id}`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className={styles.detailsinfo}>
        <div className={styles.detailsimgcon}>
          <Image
            src={data?.coverImage?.extraLarge}
            alt="Image"
            width={200}
            height={200}
            className={styles.detailsimage}
          />
        </div>
        <div className={styles.detailstitle}>
          <h1 className={`${styles.title} text-[1.7rem] font-[500]`}>
            {data?.title?.[animetitle] || data?.title?.romaji}
          </h1>
          <h4 className={`${styles.alttitle}`}>
            {animetitle === "romaji" ? data?.title?.english : data?.title?.romaji}
          </h4>
          <p className={styles.scores}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-[17px] h-[17px] mr-[2px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.549l1.25 5.223c.117.49-.404.874-.808.588l-4.591-3.282a.563.563 0 00-.66 0l-4.591 3.282c-.404.286-.925-.098-.808-.588l1.25-5.223a.563.563 0 00-.182-.549L2.086 10.39c-.38-.325-.178-.948.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
              />
            </svg>
            {data?.averageScore / 10} |{" "}
            <span
              className={`${
                data?.status === "RELEASING" ? styles.activestatus : styles.notactive
              }`}
            >
              {data?.status}
            </span>
          </p>
          <div>
            {isAnime ? (
              <Link
                className={`${styles.detailswatch} ${
                  !url && "opacity-50 bg-black pointer-events-none"
                } hover:opacity-80 transition-all`}
                href={url ?? ""}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="w-5 h-5 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                {list !== null && list?.status === "COMPLETED"
                  ? "Rewatch"
                  : list !== null && list?.progress > 0
                  ? `Watch Ep ${list?.progress + 1}`
                  : `Play Now`}
              </Link>
            ) : (
              <Link
                className={`${styles.detailswatch} hover:opacity-80 transition-all`}
                href={`/manga/read/${data.id}`}
              >
                Read Now
              </Link>
            )}
          </div>
          <Addtolist
            Handlelist={Handlelist}
            openlist={openlist}
            session={session}
            list={list}
            data={data}
            setList={setList}
          />
        </div>
      </div>
    </div>
  );
}

export default AnimeDetailsTop;
