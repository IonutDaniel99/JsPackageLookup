import semver from "semver";
import { For, createEffect, createSignal, onMount } from "solid-js";
import Loading from "./Loading";

import { ImArrowUpRight2, ImArrowDownRight2 } from "solid-icons/im";
import { FaSolidEquals } from "solid-icons/fa";

export default function PackageShow({ dependencies, devDependencies }) {
  const dep = Object.entries(dependencies);
  const devDep = Object.entries(devDependencies);

  const [depPromis, setDepPromis] = createSignal({});
  const [devDepPromis, setDevDepPromis] = createSignal({});

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
    const cleanVersion1 = semver.clean(actual.replace("^", ""));
    const cleanVersion2 = semver.clean(latest.replace("^", ""));
    if (cleanVersion1 === cleanVersion2) return "Equal";
    const x = semver.gte(cleanVersion1, cleanVersion2);
    return x !== true ? "Higher" : "Lower";
  };

  onMount(async () => {
    const depList = await Promise.all(dep.map(([name]) => getLibraryDetails(name)));
    setDepPromis(
      depList.reduce((acc, val, index) => {
        acc[dep[index][0]] = val;
        return acc;
      }, {})
    );

    const devDepList = await Promise.all(devDep.map(([name]) => getLibraryDetails(name)));
    setDevDepPromis(
      devDepList.reduce((acc, val, index) => {
        acc[devDep[index][0]] = val;
        return acc;
      }, {})
    );
  });

  function returnDiffIcons(diffValue) {
    switch (diffValue.toLowerCase()) {
      case "higher":
        return <ImArrowUpRight2 color="lime" class="h-5 w-5" />;
      case "equal":
        return <FaSolidEquals color="yellow" class="h-5 w-5" />;
      case "lower":
        return <ImArrowDownRight2 color="red" class="h-5 w-5" />;
    }
  }

  return (
    <div class="h-full flex flex-col gap-10">
      <div class="overflow-y-auto overflow-x-auto lg:overflow-x-hidden max-h-80  border-2 rounded-md border-slate-700">
        <table class="text-sm text-left text-gray-500 w-full relative">
          <caption class="caption-top px-6 py-2 text-base font-bold  bg-gray-700 text-gray-200 border-b-2 border-gray-600">Dependencies</caption>
          <thead class=" bg-gray-700 text-gray-300">
            <tr class="sticky top-0 bg-gray-700 border-b-2 border-slate-600 w-full">
              <th class="px-6 py-2 text-xs w-2/12 text-white">Library Name</th>
              <th class="px-6 py-2 text-center text-xs w-2/12">Difference</th>
              <th class="px-6 py-2 text-center text-xs w-2/12">Current Version</th>
              <th class="px-6 py-2 text-center text-xs w-2/12">Latest Version</th>
              <th class="px-6 py-2 text-center text-xs w-2/12">Author</th>
              <th class="px-6 py-2 text-center text-xs w-1/12">Webpage</th>
            </tr>
          </thead>
          <tbody class=" border-b bg-gray-800 border-gray-700" style="height: 10vh;">
            <For each={Object.entries(depPromis())} fallback={<Loading />}>
              {([item, data], i) => {
                const library_name = item;
                const library_diff = checkVersionDiff(dep[i()][1], data["dist-tags"].latest);
                const library_actual = dep[i()][1];
                const library_current = data["dist-tags"].latest;
                const library_author = data.author?.name ? data.author.name : "-";
                const library_page = data.homepage ? data.homepage : null;
                return (
                  <tr class={`w-full hover:bg-gray-700 ${i() % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}`}>
                    <td class="px-6 py-2 text-xs font-medium whitespace-nowrap text-white">{library_name}</td>
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
                        <a href={library_page}>R</a>
                      </Show>
                    </td>
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
      </div>
      <div class="overflow-y-auto overflow-x-auto lg:overflow-x-hidden max-h-80  border-2 rounded-md border-slate-700">
        <table class="text-sm text-left text-gray-500 w-full relative">
          <caption class="caption-top px-6 py-2 text-base font-bold  bg-gray-700 text-gray-200 border-b-2 border-gray-600">Development Dependencies</caption>
          <thead class=" bg-gray-700 text-gray-300">
            <tr class="sticky top-0 bg-gray-700 border-b-2 border-slate-600 w-full">
              <th class="px-6 py-2 text-xs w-2/12 text-white">Library Name</th>
              <th class="px-6 py-2 text-center text-xs w-2/12">Difference</th>
              <th class="px-6 py-2 text-center text-xs w-2/12">Current Version</th>
              <th class="px-6 py-2 text-center text-xs w-2/12">Latest Version</th>
              <th class="px-6 py-2 text-center text-xs w-2/12">Author</th>
              <th class="px-6 py-2 text-center text-xs w-1/12">Webpage</th>
            </tr>
          </thead>
          <tbody class="border-b bg-gray-800 border-gray-700 ">
            <For each={Object.entries(devDepPromis())} fallback={<Loading />}>
              {([item, data], i) => {
                const library_name = item;
                const library_diff = checkVersionDiff(devDep[i()][1], data["dist-tags"].latest);
                const library_actual = devDep[i()][1];
                const library_current = data["dist-tags"].latest;
                const library_author = data.author?.name ? data.author.name : "-";
                const library_page = data.homepage ? data.homepage : null;
                return (
                  <tr class={`w-full hover:bg-gray-700  ${i() % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}`}>
                    <th class="px-6 py-2 text-xs   font-medium whitespace-nowrap text-white">{library_name}</th>
                    <td class="px-6 py-2 text-xs  text-center text-stone-200">
                      <span class="flex items-center justify-center gap-3">
                        {returnDiffIcons(library_diff)} {library_diff}
                      </span>
                    </td>
                    <td class="px-6 py-2 text-xs  text-center text-stone-200">{library_actual.replace(/[^\d.]/g, "")}</td>
                    <td class="px-6 py-2 text-xs  text-center text-stone-200">{library_current.replace(/[^\d.]/g, "")}</td>
                    <td class="px-6 py-2 text-xs  text-center text-stone-200">{library_author}</td>
                    <td class="px-6 py-2 text-xs  text-center text-stone-200">
                      <Show when={library_page !== null}>
                        <a href={library_page}>R</a>
                      </Show>
                    </td>
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
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
