import { createSignal, Show } from "solid-js";

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
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject",
        "lint": "eslint .",
        "lint:fix": "eslint --fix",
        "format": "prettier --write './**/*.{js,jsx,ts,tsx,css,md,json}' --config ./.prettierrc"
    },
    "eslintConfig": {
        "extends": [
            "react-app",
            "react-app/jest"
        ]
    },
    "browserslist": {
        "production": [
            ">0.2%",
            "not dead",
            "not op_mini all"
        ],
        "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
        ]
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
}`


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
        props.sendJsonToParent({ dependencies: null, devDependencies: null, error: "Error" });
    }

    function handleInputChange(event) {
        setInputValue(event.target.value);
        props.sendJsonToParent({ dependencies: null, devDependencies: null, error: null });
    }
    function setJsonExample() {
        setInputValue(JsonExample);
    }

    return (
        <>
            <label for="message" class="block mb-2 text-sm font-medium  text-white">
                Paste content of <b>Package.json</b> here:
            </label>
            <textarea
                class="block p-2.5 w-full text-xs max-h-[500px] h-[500px] rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your thoughts here..."
                onChange={handleInputChange}
                value={inputValue()}
            />

            <div class="flex justify-between py-2 w-full gap-2">
                <div
                    onClick={() => sendJsonToP()}
                    class="cursor-pointer border focus:ring-4 focus:outline-none w-1/3 font-medium rounded-lg text-sm px-5 py-2 text-center  border-blue-500 text-blue-400 hover:text-white hover:bg-blue-500 focus:ring-blue-800"
                >
                    Lookup
                </div>
                <div
                    onClick={() => setJsonExample()}
                    class="cursor-pointer  border focus:ring-4 focus:outline-none w-1/3 font-medium rounded-lg text-sm px-5 py-2 text-center  border-green-500 text-green-400 hover:text-white hover:bg-green-500 focus:ring-green-800"
                >
                    Example
                </div>
                <div
                    onClick={() => clearTextArea()}
                    class="cursor-pointer border  focus:ring-4 focus:outline-none w-1/3 font-medium rounded-lg text-sm px-5 py-2 text-center border-red-500 text-red-400 hover:text-white hover:bg-red-600 focus:ring-red-900"
                >
                    Clear
                </div>
            </div>

            <Show when={inputError()}>
                <div class="border-2 rounded-md border-red-500 flex flex-col items-center py-2 px-4 animate-pulse duration-500">
                    <div class=" text-lg text-red-600 text-center font-medium">Error</div>
                    <div class=" text-white text-center text-sm">{inputError()}</div>
                </div>
            </Show>
        </>
    );
}
