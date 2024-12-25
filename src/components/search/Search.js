"use client"
import { Fragment, useEffect, useRef, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import Link from 'next/link';
import UseDebounce from "@/utils/UseDebounce";
import { AdvancedSearch } from "@/lib/Anilistfunctions";
import { useRouter } from 'next/navigation';
import { useTitle, useSearchbar } from '@/lib/store';
import { useStore } from 'zustand';

function Search() {
    const router = useRouter();
    const animetitle = useStore(useTitle, (state) => state.animetitle);
    const Isopen = useStore(useSearchbar, (state) => state.Isopen);
    const [query, setQuery] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const debouncedSearch = UseDebounce(query, 500);
    const [nextPage, setNextPage] = useState(false);

    let focusInput = useRef(null);

    async function searchdata() {
        setLoading(true);
        const res = await AdvancedSearch(debouncedSearch);
        setData(res?.media);
        setNextPage(res?.pageInfo?.hasNextPage);
        console.log(res);
        setLoading(false);
    }

    useEffect(() => {
        if (debouncedSearch) {
            searchdata();
        }
    }, [debouncedSearch]);

    function closeModal() {
        useSearchbar.setState({ Isopen: false });
    }

    function resolveLink(type, id) {
        if (type === "MANGA") {
            return `/manga/read/${id}`;
        } else if (type === "ANIME") {
            return `/anime/info/${id}`;
        }
        return "#";
    }

    return (
        <Transition appear show={Isopen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[99999]"
                initialFocus={focusInput}
                onClose={closeModal}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                                <Combobox
                                    as="div"
                                    className="relative"
                                    onChange={() => {
                                        useSearchbar.setState({ Isopen: false });
                                        setData(null);
                                        setQuery("");
                                    }}
                                >
                                    <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-700">
                                            Search
                                        </h3>
                                        <button
                                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                            onClick={closeModal}
                                        >
                                            ✖
                                        </button>
                                    </div>
                                    <div className="px-4 py-3">
                                        <Combobox.Input
                                            ref={focusInput}
                                            className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                                            placeholder="Search for anime or manga..."
                                            onChange={(event) => setQuery(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    useSearchbar.setState({ Isopen: false });
                                                    router.push(`/anime/catalog?search=${encodeURIComponent(event.target.value)}`);
                                                    setData(null);
                                                    setQuery("");
                                                }
                                            }}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <Combobox.Options
                                        static
                                        className="bg-white border-t border-gray-200 max-h-80 overflow-y-auto"
                                    >
                                        {!loading ? (
                                            <Fragment>
                                                {data?.length > 0
                                                    ? data?.map((item) => (
                                                        <Combobox.Option
                                                            key={item.id}
                                                            value={item.id}
                                                            className={({ active }) =>
                                                                `flex items-center gap-3 px-4 py-2 ${
                                                                    active ? "bg-indigo-50" : ""
                                                                }`
                                                            }
                                                        >
                                                            <Link href={resolveLink(item.type, item.id)}>
                                                                <div className="flex items-center">
                                                                    <img
                                                                        src={item.image || item.coverImage.large}
                                                                        alt={item.title.romaji}
                                                                        className="w-12 h-16 object-cover rounded"
                                                                    />
                                                                    <div className="ml-3">
                                                                        <p className="text-sm font-medium text-gray-800 line-clamp-2">
                                                                            {item.title[animetitle] || item.title.romaji}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {item.type} - {item?.status || "Unknown"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </Combobox.Option>
                                                    ))
                                                    : query !== "" && (
                                                        <p className="px-4 py-2 text-sm text-gray-500">
                                                            No results found.
                                                        </p>
                                                    )}
                                                {data && nextPage && (
                                                    <div className="px-4 py-2">
                                                        <Link href={`/anime/catalog?search=${encodeURIComponent(query)}`}>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    useSearchbar.setState({ Isopen: false });
                                                                    setQuery("");
                                                                }}
                                                                className="w-full bg-indigo-500 text-white px-4 py-2 rounded-md"
                                                            >
                                                                View More Results
                                                            </button>
                                                        </Link>
                                                    </div>
                                                )}
                                            </Fragment>
                                        ) : (
                                            <div className="px-4 py-2 text-center text-gray-500">
                                                Loading...
                                            </div>
                                        )}
                                    </Combobox.Options>
                                </Combobox>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default Search;
