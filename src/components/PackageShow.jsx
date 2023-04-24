import semver from "semver";
import { For, createEffect, createSignal } from "solid-js";


export default function PackageShow({ dependencies, devDependencies }) {
    const dep = Object.entries(dependencies)
    const devDep = Object.entries(devDependencies)

    const [depPromis, setDepPromis] = createSignal({})
    const [devDepPromis, setDevDepPromis] = createSignal({})

    function getLibraryDetails(libraryName) {
        return fetch(`https://registry.npmjs.org/${libraryName}`)
            .then(async (response) => {
                try {
                    const data = await response.json();
                    return data;
                } catch (err) {
                    console.log(err);
                }
            });
    }

    const getDependencyList = dep.map(async (item, index) => {
        const data = await getLibraryDetails(item[0]);
        return data
    })
    const getDevDependencyList = devDep.map(async (item, index) => {
        const data = await getLibraryDetails(item[0]);
        return data
    })

    Promise.all(getDependencyList)
        .then((promiseDep) => setDepPromis(promiseDep))
        .catch(error => console.error(error));

    Promise.all(getDevDependencyList)
        .then((promiseDevDep) => setDevDepPromis(promiseDevDep))
        .catch(error => console.error(error));

    const checkVersionDiff = (actual, latest) => {
        const cleanVersion1 = semver.clean(actual.replace('^', ''))
        const cleanVersion2 = semver.clean(latest.replace('^', ''))
        if (cleanVersion1 === cleanVersion2) return "equal"
        const x = semver.gte(cleanVersion1, cleanVersion2)
        return x === true ? "higher" : "lower"
    }

    return (
        <>
            <table class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
                <caption class="caption-top px-6 py-2 text-base font-bold text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    Dependencies
                </caption>
                <thead class="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th class="px-6 py-3">Library Name</th>
                        <th class="px-6 py-3 text-center">Difference</th>
                        <th class="px-6 py-3 text-center">Current Version</th>
                        <th class="px-6 py-3 text-center">Latest Version</th>
                        <th class="px-6 py-3 text-center">Author</th>
                        <th class="px-6 py-3 text-center">Webpage</th>
                    </tr>
                </thead>
                <tbody class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <For each={depPromis()}>
                        {(item, i) => {
                            const library_name = item.name
                            const library_diff = checkVersionDiff(dep[i()][1], item["dist-tags"].latest)
                            const library_actual = dep[i()][1]
                            const library_current = item["dist-tags"].latest
                            const library_author = item.author?.name ? item.author.name : "Undefined"
                            const library_page = item.homepage ? item.homepage : "Undefined"
                            return <tr class={`bg-white hover:bg-gray-600 dark:hover:bg-gray-700 ${i() % 2 === 0 ? "dark:bg-gray-800" : "dark:bg-gray-900"}`}>
                                <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{library_name}</th>
                                <td class="px-6 py-2 text-center">{library_diff} </td>
                                <td class="px-6 py-2 text-center">{library_actual}</td>
                                <td class="px-6 py-2 text-center">{library_current}</td>
                                <td class="px-6 py-2 text-center">{library_author}</td>
                                <td class="px-6 py-2 text-center"><a href={library_page}> R</a></td>
                            </tr>
                        }
                        }
                    </For>
                </tbody>
            </table>
            <table class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
                <caption class="caption-top px-6 py-2 text-base font-bold text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    Development Dependencies
                </caption>
                <thead class="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th class="px-6 py-3">Library Name</th>
                        <th class="px-6 py-3 text-center">Difference</th>
                        <th class="px-6 py-3 text-center">Current Version</th>
                        <th class="px-6 py-3 text-center">Latest Version</th>
                        <th class="px-6 py-3 text-center">Author</th>
                        <th class="px-6 py-3 text-center">Webpage</th>
                    </tr>
                </thead>
                <tbody class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <For each={devDepPromis()}>
                        {(item, i) => {
                            const library_name = item.name
                            const library_diff = checkVersionDiff(devDep[i()][1], item["dist-tags"].latest)
                            const library_actual = devDep[i()][1]
                            const library_current = item["dist-tags"].latest
                            const library_author = item.author?.name ? item.author.name : "Undefined"
                            const library_page = item.homepage ? item.homepage : "Undefined"
                            return <tr class={`bg-white hover:bg-gray-600 dark:hover:bg-gray-700  ${i() % 2 === 0 ? "dark:bg-gray-800" : "dark:bg-gray-900"}`}>
                                <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{library_name}</th>
                                <td class="px-6 py-2 text-center">{library_diff} </td>
                                <td class="px-6 py-2 text-center">{library_actual}</td>
                                <td class="px-6 py-2 text-center">{library_current}</td>
                                <td class="px-6 py-2 text-center">{library_author}</td>
                                <td class="px-6 py-2 text-center"><a href={library_page}> R</a></td>
                            </tr>
                        }
                        }
                    </For>
                </tbody>
            </table>
        </>
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