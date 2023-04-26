import { createSignal, Show } from "solid-js";

export default function InputZone(props) {
  const [inputValue, setInputValue] = createSignal("");
  const [inputError, setInputError] = createSignal("");

  function sendJsonToP() {
    try {
      const packageJson = JSON.parse(inputValue());
      const dependencies = packageJson.dependencies;
      const devDependencies = packageJson.devDependencies;
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

  return (
    <>
      <label for="message" class="block mb-2 text-sm font-medium  text-white">
        Paste content of <b>Package.json</b> here:
      </label>
      <textarea
        id="message"
        rows="4"
        class="block p-2.5 w-full text-sm max-h-[500px] h-[500px] rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-300 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Write your thoughts here..."
        onChange={handleInputChange}
        value={inputValue()}
      />

      <div class="flex justify-between py-2">
        <div
          onClick={() => sendJsonToP()}
          class="cursor-pointer  border focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2 text-center  border-blue-500 text-blue-400 hover:text-white hover:bg-blue-500 focus:ring-blue-800"
        >
          Lookup
        </div>
        <div
          onClick={() => clearTextArea()}
          class="cursor-pointer border  focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2 text-center border-red-500 text-red-400 hover:text-white hover:bg-red-600 focus:ring-red-900"
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
