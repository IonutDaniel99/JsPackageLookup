import { createSignal, Show, onMount, createEffect } from "solid-js";
import "highlight.js/styles/github.css";

const JsonExample = `{
    "name": "CustomExample",
    "version": "0.1.1",
    "private": true,
    "dependencies": {
        "@emotion/react": "^11.10.5",
        "@emotion/styled": "^11.10.5",
        "@mui/material": "^5.10.15",
        "@testing-library/jest-dom": "^5.16.5",
        "@testing-library/react": "^13.4.0",
        "@testing-library/user-event": "^13.5.0",
        "axios": "^1.1.3",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "vite": "^4.1.1",
        "vite-plugin-solid": "^2.5.0",
        "react-router-dom": "^6.4.3",
        "react-scripts": "5.0.1",
        "tailwind": "^4.0.0",
        "web-vitals": "^2.1.4"
    },
    "devDependencies": {
        "@tailwindcss/line-clamp": "^0.4.2",
        "autoprefixer": "^10.4.13",
        "eslint": "^8.27.0",
        "eslint-config-prettier": "^8.5.0",
        "eslint-plugin-prettier": "^4.2.1",
        "eslint-plugin-react": "^7.31.10",
        "eslint-plugin-tailwindcss": "^3.7.0",
        "postcss": "^8.4.19",
        "prettier": "^2.7.1",
        "tailwindcss": "^3.2.4"
    }
}`;

export default function InputZone(props) {
  const [inputValue, setInputValue] = createSignal("");
  const [inputError, setInputError] = createSignal("");

  function sendJsonToP() {
    try {
      const packageJson = JSON.parse(inputValue());
      const dependencies = packageJson.dependencies ? packageJson.dependencies : {};
      const devDependencies = packageJson.devDependencies ? packageJson.devDependencies : {};
      props.sendJsonToParent({ dependencies: dependencies, devDependencies: devDependencies, error: null });
      setInputError("");
      setInputValue("");
    } catch (err) {
      verifyError(err);
      props.sendJsonToParent({ dependencies: null, devDependencies: null, error: "Error" });
    }
  }
  function verifyError(err) {
    console.log(err.message);
    setInputError(err.message);
  }
  function clearTextArea() {
    setInputValue("");
    setInputError("");

    props.sendJsonToParent({ dependencies: null, devDependencies: null, error: "Error" });
  }
  function handleInputChange(event) {
    setInputValue(event.target.value);
    props.sendJsonToParent({ dependencies: null, devDependencies: null, error: null });
  }
  function setJsonExample() {
    setInputError("");
    setInputValue(JsonExample);
  }

  return (
    <>
      <h1 for="message" class="block mb-2 text-xs xl:text-sm font-medium  text-white">
        Paste content of <b>Package.json</b> here:
      </h1>
      <div class="relative h-5/6">
        <textarea
          class="relative font-mono block p-2.5 w-full text-xs h-full top-0 right-0 rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-300 resize-none scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900"
          placeholder="Write your code here..."
          className="language-typescript"
          onChange={handleInputChange}
          value={inputValue()}
          wrap="off"
        ></textarea>
        <Show when={inputError()}>
          <div class="absolute bottom-0 border-t bg-gray-700 border-red-500 flex flex-col items-center py-2 px-4 w-full rounded-b-lg">
            <div class=" text-lg text-red-600 text-center font-bold  animate-pulse duration-500">Error</div>
            <div class=" text-white text-center text-sm  animate-pulse duration-500">{inputError()}</div>
          </div>
        </Show>
      </div>

      <div class="flex justify-between flex-col xl:flex-row py-2 w-full gap-2">
        <div
          onClick={() => clearTextArea()}
          class="cursor-pointer border  focus:ring-4 focus:outline-none w-full xl:w-1/3 font-medium rounded-lg text-sm px-5 py-2 text-center border-red-500 text-red-400 hover:text-white hover:bg-red-600 focus:ring-red-900"
        >
          Clear
        </div>
        <div
          onClick={() => setJsonExample()}
          class="cursor-pointer  border focus:ring-4 focus:outline-none w-full xl:w-1/3 font-medium rounded-lg text-sm px-5 py-2 text-center  border-green-500 text-green-400 hover:text-white hover:bg-green-500 focus:ring-green-800"
        >
          Example
        </div>
        <div
          onClick={() => sendJsonToP()}
          class="cursor-pointer border focus:ring-4 focus:outline-none w-full xl:w-1/3 font-medium rounded-lg text-sm px-5 py-2 text-center  border-blue-500 text-blue-400 hover:text-white hover:bg-blue-500 focus:ring-blue-800"
        >
          Lookup
        </div>
      </div>
    </>
  );
}
