import { For, Show, createSignal } from "solid-js";
import InputZone from "./components/InputZone";
import PackageShow from "./components/PackageShow";
import Logo from './assets/Logo.svg'

import { inject } from '@vercel/analytics';

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  DialogOverlay,
} from 'solid-headless';

import versions from "./version.json"

function App() {

  inject();


  const [packageJsonObject, setPackageJsonObject] = createSignal({ dependencies: null, devDependencies: null, error: null });
  function handleJsonFromInputZone(childData) {
    setPackageJsonObject(childData);
  }


  const [isOpen, setIsOpen] = createSignal(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div class="h-screen w-screen flex justify-center bg-gray-900">
        <div class="m-4 w-full px-10 bg-gray-800 rounded-xl 2xl:mx-auto 2xl:container 2xl:w-4/6  ">
          <nav class="py-4">
            <ul class="flex items-center justify-between gap-4 text-white">
              <img class="h-12" src={Logo} />
              <div class="flex items-center justify-start gap-4 pb-2">
                <a class="font-semibold text-lg hover:underline underline-offset-8 group" href="https://status.npmjs.org/" target="_blank"><span class="group-hover:text-rose-500">NPM</span> Status</a>
                <span class="relative px-1 scale-150 bottom-[2px] text-gray-500">•</span>
                <span class="font-semibold text-lg hover:underline underline-offset-8 cursor-pointer" onClick={() => openModal()}>About</span>
              </div>
            </ul>
          </nav>
          <div class="flex pt-10">
            <div class="w-3/12 h-full mr-4">
              <InputZone sendJsonToParent={handleJsonFromInputZone} />
            </div>
            <div class="w-9/12 flex flex-col gap-2 pt-7">
              <Show when={(packageJsonObject().dependencies !== null && packageJsonObject().devDependencies !== null) && !packageJsonObject().error}>
                <PackageShow dependencies={packageJsonObject().dependencies} devDependencies={packageJsonObject().devDependencies} />
              </Show>
            </div>
          </div>

        </div>
      </div>
      <Transition appear show={isOpen()}>
        <Dialog
          isOpen
          class="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center h-screen w-screen"
          onClose={closeModal}
        >
          <div class="px-4 flex items-center justify-center">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogOverlay class="fixed inset-0 bg-gray-900 bg-opacity-50" />
            </TransitionChild>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              class="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel class="w-[1000px] h-[700px] inline-block max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-100 shadow-xl rounded-2xl">
                <DialogTitle
                  as="h3"
                  class="text-lg leading-6 text-gray-900 font-bold"
                >
                  About
                </DialogTitle>
                <div class="p-2 flex flex-col justify-between h-full">
                  <div class="mt-2 h-full mb-8 overflow-y-auto border border-gray-400 p-2 rounded-md scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-slate-200">
                    <For each={Object.entries(versions)}>
                      {([item, data], i) => {
                        return <>
                          <p class="font-bold">Version {item}</p>
                          <ul class="list-disc ml-8 pb-2">
                            <For each={data}>
                              {(version, z) =>
                                <li>{version}</li>
                              }
                            </For>
                          </ul>
                        </>
                      }}
                    </For>
                  </div>
                  <div>
                    <div class="w-full flex items-center justify-center mb-4">
                      <p class="text-sm">Created by <a href="https://github.com/IonutDaniel99" class="text-blue-500 font-semibold underline underline-offset-4 outline-offset-0 outline-0 focus-visible:outline-offset-0" target="_blank">Ionut Daniel (GitHub)</a>
                        &nbsp;using <a href="https://github.com/IonutDaniel99" class="text-blue-500 font-semibold underline underline-offset-4 outline-offset-0 outline-0 focus-visible:outline-offset-0" target="_blank">SolidJs</a>.
                      </p>
                    </div>
                    <div class="mb-2 flex gap-2 float-right">
                      <button
                        type="button"
                        class="border focus:outline-none cus:ring-4 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700 cursor-not-allowed"
                        onClick={closeModal}
                        disabled
                      >
                        Donate
                      </button>
                      <button
                        type="button"
                        class="border focus:outline-none cus:ring-4 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>

                  </div>

                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
export default App;
