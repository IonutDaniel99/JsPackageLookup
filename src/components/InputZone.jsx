import { createSignal } from "solid-js";

export default function InputZone(props) {

    const [inputValue, setInputValue] = createSignal('');

    function sendJsonToParent() {
        try {
            const packageJson = JSON.parse(inputValue())
            const dependencies = packageJson.dependencies;
            const devDependencies = packageJson.devDependencies;

            props.sendJsonToParent({ dependencies: dependencies, devDependencies: devDependencies, error: null });
        } catch {
            props.sendJsonToParent({ dependencies: null, devDependencies: null, error: "Error" })
        }

    }

    function clearTextArea() {
        setInputValue('')
        props.sendJsonToParent({ dependencies: null, devDependencies: null, error: "Error" })
    }

    function handleInputChange(event) {
        setInputValue(event.target.value);
    }

    return (
        <>
            <h1 class="text-xl pb-2">Paste content of <b>Package.json</b> here:</h1>
            <textarea class="w-full h-[400px] max-h-[400px] border-2 border-black rounded-md resize-none" onChange={handleInputChange} value={inputValue()} />
            <div class="flex justify-between">
                <div onClick={() => sendJsonToParent()} class=" border-2 border-blue-400 w-fit py-2 px-4 rounded-xl bg-blue-500 text-white font-bold cursor-pointer hover:bg-blue-600">Lookup</div>
                <div onClick={() => clearTextArea()} class=" border-2 border-red-400 w-fit py-2 px-4 rounded-xl bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600">Clear</div>

            </div>
        </>
    )
}