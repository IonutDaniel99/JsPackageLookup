import { createSignal } from "solid-js";

export default function InputZone(props) {

    const [inputValue, setInputValue] = createSignal('');

    function sendJsonToP() {
        try {
            const packageJson = JSON.parse(inputValue())
            const dependencies = packageJson.dependencies;
            const devDependencies = packageJson.devDependencies;
            console.log(props)
            props.sendJsonToParent({ dependencies: dependencies, devDependencies: devDependencies, error: null });
        } catch (err) {
            console.log(err)
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
            <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Paste content of <b>Package.json</b> here:</label>
            <textarea id="message" rows="4" class="block p-2.5 w-full text-sm max-h-[400px] h-[400px] text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."
                onChange={handleInputChange} value={inputValue()}
            ></textarea>

            <div class="flex justify-between pt-2">
                <div onClick={() => sendJsonToP()} class=" border-2 border-blue-400 w-fit py-2 px-4 rounded-xl bg-blue-500 text-white font-bold cursor-pointer hover:bg-blue-600">Lookup</div>
                <div onClick={() => clearTextArea()} class=" border-2 border-red-400 w-fit py-2 px-4 rounded-xl bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600">Clear</div>

            </div>
        </>
    )
}