"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "../../styles/AnimeDetailsTop.module.css";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import Addtolist from "./Addtolist";
import { signIn } from "next-auth/react";
import { useTitle } from "@/lib/store";
import { useStore } from "zustand";

function AnimeDetailsTop({ data, list, session, setList, url }) {
  const animetitle = useStore(useTitle, (state) => state.animetitle);
  const [openlist, setOpenlist] = useState(false);

  const isAnime = data?.type === "ANIME";

  function Handlelist() {
    setOpenlist(!openlist);
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const isAdult = data.isAdult; // Assume isAdult is a property in the data
  const isUpcoming =
    data.status === "RELEASING" || data.status === "NOT_YET_RELEASED";

  return (
    <div className={styles.detailsbanner}>
      <div
        className={styles.detailsbgimage}
        style={{
          backgroundImage: `url(${data?.bannerImage || data?.coverImage.extraLarge || null})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "100%",
        }}
      ></div>
      <div className={styles.gradientOverlay}></div>
      <>
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
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-0">
                  {data.title?.[animetitle] || data?.title?.romaji}
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
              </>
            )}
          </ModalContent>
        </Modal>
      </>
      <div className={styles.detailsinfo}>
        <div className={styles.detailsimgcon}>
          <Image
            src={data?.coverImage?.extraLarge}
            alt="Image"
            width={200}
            height={200}
            className={`${styles.detailsimage} ${
              isAdult ? styles.adultIcon : ""
            } ${isUpcoming ? styles.pulseGreen : ""}`}
          />
        </div>
        <div className={styles.detailstitle}>
          <h1 className={`${styles.title} text-[1.7rem] font-[500]`}>
            {data?.title?.[animetitle] || data?.title?.romaji}
          </h1>
          <h4 className={`${styles.alttitle}`}>
            {animetitle === "romaji"
              ? data?.title?.english
              : data?.title?.romaji}
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
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.161.534l1.229 5.904c.093.448-.383.791-.78.581l-4.86-2.519a.563.563 0 00-.545 0l-4.86 2.52c-.397.209-.872-.133-.78-.581l1.229-5.904a.563.563 0 00-.161-.534L2.066 10.385c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.11z"
              />
            </svg>
            {data?.averageScore / 10} |{" "}
            <span
              className={`${
                data?.status === "RELEASING"
                  ? styles.activestatus
                  : styles.notactive
              }`}
            >
              {data?.status}
            </span>
          </p>
          <div className="flex">
            {isAnime ? (
              <Link
                className={`${styles.detailswatch} ${
                  !url && "opacity-50 bg-black pointer-events-none"
                } hover:opacity-80 transition-all`}
                href={url ?? ""}
              >
                {list !== null && list?.status === "COMPLETED"
                  ? "Rewatch"
                  : list !== null && list?.progress > 0
                  ? `Watch Ep ${list?.progress + 1}`
                  : `Play Now`}
              </Link>
            ) : (
              <>
                {data?.type === "MANGA" ? (
                  <button
                    className={`${styles.detailswatch} hover:opacity-80 transition-all bg-primary`}
                    onClick={() => {
                      if (url) {
                        window.open(url, "_blank");
                      } else {
                        alert("No URL available for this manga.");
                      }
                    }}
                  >
                    Read Now
                  </button>
                ) : (
                  <button
                    className={`${styles.detailswatch} opacity-40 bg-black`}
                    disabled
                  >
                    Read Now
                  </button>
                )}
              </>
            )}
            <Button className={styles.detailsaddlist} onClick={Handlelist}>
              {list && list?.status !== null ? "Edit List" : "Add to List"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeDetailsTop;
