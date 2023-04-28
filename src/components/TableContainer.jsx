import { OcLinkexternal2 } from "solid-icons/oc";
import { checkForJsonTitle, checkVersionDiff, getLibraryDetails, returnDiffIcons, returnPercentageForSlider } from "../helpers/helpers";
import { Show, createSignal, onMount } from "solid-js";
import NoDependencies from "./NoDependencies";

export default function TableContianer({ title, dependencies }) {

    const [depPromis, setDepPromis] = createSignal({});
    const [numResolved, setNumResolved] = createSignal(0);
    const [showProgress, setShowProgress] = createSignal(true);


    onMount(async () => {
        const depList = await Promise.all(dependencies.map(([name]) => {

            return getLibraryDetails(name).then((data) => {
                setNumResolved(numResolved() + 1)
                return data
            });
        }));

        setDepPromis(
            depList.reduce((acc, val, index) => {
                acc[dependencies[index][0]] = val;
                return acc;
            }, {})
        );
        setShowProgress(false)
    });

    return <div class="overflow-y-auto overflow-x-auto lg:overflow-x-hidden border-2 rounded-md border-slate-700 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900" style={"height: 32vh"}>
        <table class="text-sm text-left text-gray-500 w-full relative">
            <caption class="caption-top px-6 py-2 text-base font-bold  bg-gray-700 text-gray-200 border-b-2 border-gray-600">{title}</caption>
            <thead class=" bg-gray-700 text-gray-300">
                <tr class="sticky top-0 bg-gray-700 border-b-2 border-slate-600 w-full">
                    <th class="px-6 py-2 text-xs w-2/12 text-white">Library Name</th>
                    <th class="px-6 py-2 text-center text-xs w-2/12">Version Diff.</th>
                    <th class="px-6 py-2 text-center text-xs w-2/12">Current Ver.</th>
                    <th class="px-6 py-2 text-center text-xs w-2/12">Latest Ver.</th>
                    <th class="px-6 py-2 text-center text-xs w-2/12">Author</th>
                    <th class="px-6 py-2 text-center text-xs w-1/12">Webpage</th>
                </tr>
            </thead>
            <tbody class=" border-b bg-gray-800 border-gray-700" >
                <Show when={dependencies.length > 0} fallback={<NoDependencies titleCheck={checkForJsonTitle(title)} />}>
                    <For each={Object.entries(depPromis())}>
                        {([item, data], i) => {
                            const library_name = item;
                            if (data) {
                                const library_diff = checkVersionDiff(dependencies[i()][1], data["dist-tags"].latest);
                                const library_actual = dependencies[i()][1];
                                const library_current = data["dist-tags"].latest;
                                const library_author = data.author?.name ? data.author.name : "-";
                                const library_page = data.homepage ? data.homepage : null;
                                return (
                                    <tr class={`w-full hover:bg-gray-700 ${i() % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}`}>
                                        <td class="px-6 py-2 text-xs font-medium whitespace-nowrap text-white capitalize ">{library_name}</td>
                                        <td class="px-6 py-2 text-xs text-center text-stone-200 gap-2">
                                            <span class="flex items-center justify-center gap-3">
                                                {returnDiffIcons(library_diff)} {library_diff}
                                            </span>
                                        </td>
                                        <td class="px-6 py-2 text-xs text-center text-stone-200">{library_actual.replace(/[^\d.]/g, "")}</td>
                                        <td class="px-6 py-2 text-xs text-center text-stone-200">{library_current.replace(/[^\d.]/g, "")}</td>
                                        <td class="px-6 py-2 text-xs text-center text-stone-200">{library_author}</td>
                                        <td class="px-6 py-2 text-xs text-center text-stone-200">
                                            <Show when={library_page !== null}>
                                                <a href={library_page} target="_blank">
                                                    <span class="flex items-center justify-center gap-3">
                                                        <OcLinkexternal2 class="h-4 w-4" />
                                                    </span>
                                                </a>
                                            </Show>
                                        </td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr class={`w-full hover:bg-gray-700 ${i() % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}`}>
                                        <td class="px-6 py-2 text-xs font-medium whitespace-nowrap text-white capitalize ">{library_name}</td>
                                        <td class="px-6 py-2 text-xs text-center text-stone-200 gap-2" colSpan={4}>
                                            <span class="flex items-center justify-center">
                                                Library not found on&nbsp;<a href="www.npmjs.com" class="text-blue-400">NpmJS.com</a>
                                            </span>
                                        </td>
                                        <td class="px-6 py-2 text-xs text-center text-stone-200">
                                            <a href={`https://www.npmjs.com/search?q=${library_name}`} target="_blank">
                                                <span class="flex items-center justify-center gap-3">
                                                    <OcLinkexternal2 class="h-4 w-4" />
                                                </span>
                                            </a>
                                        </td>
                                    </tr>
                                )
                            }
                        }}
                    </For>
                </Show>
                <Show when={showProgress()}>
                    <tr class="w-full">
                        <td class="py-2 text-center" colSpan={6}>
                            <div class="flex justify-between mb-1 w-80 text-center m-auto px-2">
                                <span class="text-sm font-medium text-white">Loading {returnPercentageForSlider(dependencies, numResolved())}%</span>
                                <span class="text-sm font-medium text-white">{numResolved()} out of {dependencies.length}</span>
                            </div>
                            <div class="rounded-full h-2.5 bg-gray-700  text-center m-auto w-80">
                                <div class="bg-red-600 h-2.5 rounded-full" style={`width: ${returnPercentageForSlider(dependencies, numResolved())}%`}></div>
                            </div>
                        </td>
                    </tr>
                </Show>
            </tbody>
        </table>
    </div>
}

