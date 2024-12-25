"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useTitle, useSearchbar } from "@/lib/store";
import { useStore } from "zustand";
import UseDebounce from "@/utils/UseDebounce";
import { AdvancedSearch } from "@/lib/Anilistfunctions";

function Search() {
    const router = useRouter();
    const animetitle = useStore(useTitle, (state) => state.animetitle);
    const Isopen = useStore(useSearchbar, (state) => state.Isopen);
    const [query, setQuery] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const debouncedSearch = UseDebounce(query, 500);
    const [searchType, setSearchType] = useState("anime");
    const focusInput = useRef(null);

    async function searchData() {
        setLoading(true);
        const res = await AdvancedSearch(debouncedSearch, searchType);
        setData(res?.media || []);
        setLoading(false);
    }

    useEffect(() => {
        if (debouncedSearch) {
            searchData();
        }
    }, [debouncedSearch, searchType]);

    function closeModal() {
        useSearchbar.setState({ Isopen: false });
    }

    function handleResultClick(item) {
        closeModal();
        setQuery("");
        const basePath = searchType === "anime" ? "/anime/info" : "/manga/read";
        router.push(`${basePath}/${item.id}`);
    }

    return (
        <Transition appear show={Isopen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
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
                    <div className="fixed inset-0 bg-black/75" />
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
                            <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-[#1a1a1f] p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-white">Search</h3>
                                    <select
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.target.value)}
                                        className="bg-black text-sm font-bold px-2 py-1 rounded-lg text-white"
                                    >
                                        <option value="anime">Anime</option>
                                        <option value="manga">Manga</option>
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <Combobox>
                                        <div className="relative">
                                            <Combobox.Input
                                                ref={focusInput}
                                                className="w-full p-3 bg-black text-white rounded-lg"
                                                placeholder={`Search ${searchType}...`}
                                                onChange={(e) => setQuery(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && query) {
                                                        closeModal();
                                                        const catalogPath = `/${searchType}/catalog?search=${encodeURIComponent(query)}`;
                                                        router.push(catalogPath);
                                                    }
                                                }}
                                            />
                                        </div>

                                        <Combobox.Options className="mt-4 max-h-60 overflow-y-auto bg-black rounded-lg text-white">
                                            {loading && (
                                                <div className="text-center py-2">Loading...</div>
                                            )}
                                            {!loading && data?.length > 0 ? (
                                                data.map((item) => (
                                                    <Combobox.Option
                                                        key={item.id}
                                                        value={item.id}
                                                        as="div"
                                                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800"
                                                        onClick={() => handleResultClick(item)}
                                                    >
                                                        <img
                                                            src={item.image || item.coverImage.large}
                                                            alt={item.title[animetitle] || item.title.romaji}
                                                            className="w-12 h-16 rounded"
                                                        />
                                                        <div>
                                                            <p className="font-bold text-sm">
                                                                {item.title[animetitle] || item.title.romaji}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                {searchType === "anime"
                                                                    ? `Episodes: ${item.episodes || "N/A"}`
                                                                    : `Chapters: ${item.chapters || "N/A"}`}
                                                            </p>
                                                        </div>
                                                    </Combobox.Option>
                                                ))
                                            ) : (
                                                !loading &&
                                                query && (
                                                    <div className="text-center py-2 text-gray-400">
                                                        No results found.
                                                    </div>
                                                )
                                            )}
                                        </Combobox.Options>
                                    </Combobox>
                                </div>

                                {/* For quick access: CTRL + S */}
                                <div className="mt-4 text-xs text-center text-gray-400">
                                    For quick access: <span className="font-bold">CTRL + S</span>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default Search;
