import semver from "semver";
import { For, createEffect, createSignal, onMount } from "solid-js";
import Loading from "./Loading";


export default function PackageShow({ dependencies, devDependencies }) {
    const dep = Object.entries(dependencies)
    const devDep = Object.entries(devDependencies)

    const [depPromis, setDepPromis] = createSignal({})
    const [devDepPromis, setDevDepPromis] = createSignal({})

    const getLibraryDetails = async (libraryName) => {
        try {
            const response = await fetch(`https://registry.npmjs.org/${libraryName}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const checkVersionDiff = (actual, latest) => {
        const cleanVersion1 = semver.clean(actual.replace('^', ''))
        const cleanVersion2 = semver.clean(latest.replace('^', ''))
        if (cleanVersion1 === cleanVersion2) return "equal"
        const x = semver.gte(cleanVersion1, cleanVersion2)
        return x === true ? "higher" : "lower"
    }

    onMount(async () => {
        const depList = await Promise.all(dep.map(([name]) => getLibraryDetails(name)));
        setDepPromis(depList.reduce((acc, val, index) => {
            acc[dep[index][0]] = val;
            return acc;
        }, {}));
        console.log(depPromis())
        const devDepList = await Promise.all(devDep.map(([name]) => getLibraryDetails(name)));
        setDevDepPromis(devDepList.reduce((acc, val, index) => {
            acc[devDep[index][0]] = val;
            return acc;
        }, {}));
    });

    return (
        <div class="h-full flex flex-col gap-10">
            <div class="overflow-y-scroll overflow-x-hidden h-80">
                <table class="text-sm text-left text-gray-500 w-full ">
                    <caption class="caption-top px-6 py-2 text-base font-bold  bg-gray-700 text-gray-200 border-b-2 border-gray-600">
                        Dependencies
                    </caption>
                    <thead class="text-xs bg-gray-700 text-gray-300">
                        <tr>
                            <th class="px-6 py-3">Library Name</th>
                            <th class="px-6 py-3 text-center">Difference</th>
                            <th class="px-6 py-3 text-center">Current Version</th>
                            <th class="px-6 py-3 text-center">Latest Version</th>
                            <th class="px-6 py-3 text-center">Author</th>
                            <th class="px-6 py-3 text-center">Webpage</th>
                        </tr>
                    </thead>
                    <tbody class=" border-b bg-gray-800 border-gray-700" style="height: 10vh;">
                        <For each={Object.entries(depPromis())} fallback={<Loading />}>
                            {([item, data], i) => {
                                const library_name = item
                                const library_diff = checkVersionDiff(dep[i()][1], data["dist-tags"].latest)
                                const library_actual = dep[i()][1]
                                const library_current = data["dist-tags"].latest
                                const library_author = data.author?.name ? data.author.name : ""
                                const library_page = data.homepage ? data.homepage : ""
                                return <tr class={`w-full hover:bg-gray-700 ${i() % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}`}>
                                    <td class="px-6 py-2 font-medium whitespace-nowrap text-white">{library_name}</td>
                                    <td class="px-6 py-2 text-center text-stone-200">{library_diff} </td>
                                    <td class="px-6 py-2 text-center text-stone-200">{library_actual}</td>
                                    <td class="px-6 py-2 text-center text-stone-200">{library_current}</td>
                                    <td class="px-6 py-2 text-center text-stone-200">{library_author}</td>
                                    <td class="px-6 py-2 text-center text-stone-200"><a href={library_page}> R</a></td>
                                </tr>
                            }
                            }
                        </For>
                    </tbody>
                </table>
            </div>
            <div class="overflow-y-scroll overflow-x-hidden h-80">
                <table class="w-full table-fixed text-sm text-left text-gray-500">
                    <caption class="caption-top px-6 py-2 text-base font-bold  bg-gray-700 text-gray-200 border-b-2 border-gray-600">
                        Development Dependencies
                    </caption>
                    <thead class="text-xs bg-gray-700 text-gray-300">
                        <tr>
                            <th class="px-6 py-3">Library Name</th>
                            <th class="px-6 py-3 text-center">Difference</th>
                            <th class="px-6 py-3 text-center">Current Version</th>
                            <th class="px-6 py-3 text-center">Latest Version</th>
                            <th class="px-6 py-3 text-center">Author</th>
                            <th class="px-6 py-3 text-center">Webpage</th>
                        </tr>
                    </thead>
                    <tbody class=" border-b bg-gray-800 border-gray-700 ">
                        <For each={Object.entries(devDepPromis())} fallback={<Loading />}>
                            {([item, data], i) => {
                                const library_name = item
                                const library_diff = checkVersionDiff(devDep[i()][1], data["dist-tags"].latest)
                                const library_actual = devDep[i()][1]
                                const library_current = data["dist-tags"].latest
                                const library_author = data.author?.name ? data.author.name : ""
                                const library_page = data.homepage ? data.homepage : ""
                                return <tr class={` hover:bg-gray-700  ${i() % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}`}>
                                    <th class="px-6 py-2 font-medium whitespace-nowrap text-white">{library_name}</th>
                                    <td class="px-6 py-2 text-center text-stone-200">{library_diff} </td>
                                    <td class="px-6 py-2 text-center text-stone-200">{library_actual}</td>
                                    <td class="px-6 py-2 text-center text-stone-200">{library_current}</td>
                                    <td class="px-6 py-2 text-center text-stone-200">{library_author}</td>
                                    <td class="px-6 py-2 text-center text-stone-200"><a href={library_page}> R</a></td>
                                </tr>
                            }}
                        </For>
                    </tbody>
                </table>
            </div>
        </div>
    )
}


// {
//     "name": "vite-template-solid",
//     "version": "0.0.0",
//     "description": "",
//     "devDependencies": {
//       "tailwindcss": "^3.3.1",
//     },
//     "dependencies": {
//       "solid-js": "^1.6.10",
//       "tailwind": "^4.0.0"
//     }
//   }