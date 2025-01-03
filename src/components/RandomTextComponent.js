"use client";

import React, { useState } from "react";

const RandomTextComponent = () => {
  // Array of random texts with associated links
  const randomTexts = [
    {
      text: "", // No text needed as we are displaying a banner
      link: "https://ko-fi.com/usemakima",
      image: "https://raw.githubusercontent.com/InstaTechHD/airin/refs/heads/master/public/kofi-support.png"
    },
    // {
    //   text: "Have you tried customizing the app to your liking? Try it if you haven't!",
    //   link: "/settings",
    // },
    // {
    //   text: "Did you know? Makima secures your AniList account when you sync?",
    //   link: "/user/profile",
    // },
    // {
    //   text: "Join our Discord for some exciting events, giveaways and more!",
    //   link: "https://discord.gg/zvD8xDhqzu",
    // },
  ];

  // Generate a random text
  const getRandomText = () => {
    const randomIndex = Math.floor(Math.random() * randomTexts.length);
    return randomTexts[randomIndex];
  };

  // Set the initial random text
  const [randomText] = useState(getRandomText());

  return (
    <div className="mx-3 bg-[#1a1a1f] px-5 py-3 rounded-lg text-bold flex flex-row items-center">
      <svg
        width="25px"
        height="25px"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
        />
      </svg>
      <p className="text-[11px] text-[#bfc6d0] lg:max-w-[65%] line-clamp-3">
        <a className="text-blue-500 hover:text-blue-600" href={randomText.link}>
          {randomText.image ? (
            <img src={randomText.image} alt="Support me on Ko-fi" className="kofi-banner" />
          ) : (
            randomText.text
          )}
        </a>
      </p>
    </div>
  );
};

export default RandomTextComponent;
