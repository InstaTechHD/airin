"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UseDebounce from "@/utils/UseDebounce";
import { AdvancedSearch } from "@/lib/Anilistfunctions";
import { useTitle, useSearchbar } from "@/lib/store";
import { useStore } from "zustand";

function Search() {
    const router = useRouter();
    const animetitle = useStore(useTitle, (state) => state.animetitle);
    const Isopen = useStore(useSearchbar, (state) => state.Isopen);

    const [query, setQuery] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState(false);
    const [searchType, setSearchType] = useState("anime");

    const debouncedSearch = UseDebounce(query, 500);
    const focusInput = useRef(null);

    const closeModal = () => {
        useSearchbar.setState({ Isopen: false });
        setQuery("");
        setData(null);
    };

    const searchData = async () => {
        if (!debouncedSearch) return;
        setLoading(true);

        try {
            const res = await AdvancedSearch(debouncedSearch, searchType);
            setData(res?.media || []);
            setNextPage(res?.pageInfo?.hasNextPage || false);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchData();
    }, [debouncedSearch, searchType]);

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
                    <div className="fixed inset-0 bg-black/90" />
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
                            <Dialog.Panel className="w-full max-w-2xl max-h-[68dvh] transform text-left transition-all">
                                <Combobox
                                    as="div"
                                    className="max-w-[600px] mx-auto rounded-lg shadow-2xl relative flex flex-col bg-[#1a1a1f]"
                                    onChange={closeModal}
                                >
                                    <div className="flex justify-between py-1 px-2">
                                        <div className="flex items-center gap-2">
                                            <p>Quick access:</p>
                                            <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded-md">
                                                CTRL
                                            </div>
                                            <span>+</span>
                                            <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded-md">
                                                S
                                            </div>
                                        </div>
                                        <select
                                            value={searchType}
                                            onChange={(e) => setSearchType(e.target.value)}
                                            className="bg-black text-xs font-bold px-2 py-1 rounded-lg text-white"
                                        >
                                            <option value="anime">Anime</option>
                                            <option value="manga">Manga</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center bg-black text-white text-base font-medium rounded-lg">
                                        <Combobox.Input
                                            ref={focusInput}
                                            className="p-4 w-full bg-transparent border-0 outline-none"
                                            placeholder={`Search ${searchType}...`}
                                            onChange={(event) => setQuery(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter" && query) {
                                                    router.push(
                                                        `/${searchType}/catalog?search=${encodeURIComponent(query)}`
                                                    );
                                                    closeModal();
                                                }
                                            }}
                                            autoComplete="off"
                                        />
                                    </div>

                                    <Combobox.Options
                                        static
                                        className="bg-black rounded-xl mt-2 max-h-[50dvh] overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-gray-600"
                                    >
                                        {!loading ? (
                                            data?.length > 0 ? (
                                                data.map((item) => (
                                                    <Combobox.Option
                                                        key={item.id}
                                                        value={item.id}
                                                        className={({ active }) =>
                                                            `flex items-center gap-3 py-2 px-5 ${
                                                                active ? "bg-gray-800" : ""
                                                            }`
                                                        }
                                                    >
                                                        <Link
                                                            href={`/${searchType}/info/${item.id}`}
                                                            onClick={closeModal}
                                                            className="flex gap-3"
                                                        >
                                                            <img
                                                                src={item.image || item.coverImage.large}
                                                                alt={item.title[animetitle] || item.title.romaji}
                                                                className="w-12 h-16 rounded"
                                                            />
                                                            <div>
                                                                <p className="text-base font-semibold">
                                                                    {item.title[animetitle] || item.title.romaji}
                                                                </p>
                                                                <p className="text-xs text-gray-400">
                                                                    Episodes:{" "}
                                                                    {item.episodes || "N/A"}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    </Combobox.Option>
                                                ))
                                            ) : (
                                                query && (
                                                    <p className="py-4 text-center text-gray-400">
                                                        No results found.
                                                    </p>
                                                )
                                            )
                                        ) : (
                                            <div className="py-4 text-center">Loading...</div>
                                        )}
                                        {nextPage && (
                                            <Link href={`/${searchType}/catalog?search=${encodeURIComponent(query)}`}>
                                                <button
                                                    type="button"
                                                    onClick={closeModal}
                                                    className="w-full py-3 bg-purple-600 text-white rounded-lg"
                                                >
                                                    View More Results
                                                </button>
                                            </Link>
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
