import { createSignal } from "solid-js";

export default function InputZone(props) {
  const [inputValue, setInputValue] = createSignal("");

  function sendJsonToP() {
    try {
      const packageJson = JSON.parse(inputValue());
      const dependencies = packageJson.dependencies;
      const devDependencies = packageJson.devDependencies;
      console.log(props);
      props.sendJsonToParent({ dependencies: dependencies, devDependencies: devDependencies, error: null });
    } catch (err) {
      console.log(err);
      props.sendJsonToParent({ dependencies: null, devDependencies: null, error: "Error" });
    }
  }

  function clearTextArea() {
    setInputValue("");
    props.sendJsonToParent({ dependencies: null, devDependencies: null, error: "Error" });
  }

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  return (
    <>
      <label for="message" class="block mb-2 text-sm font-medium  text-white">
        Paste content of <b>Package.json</b> here:
      </label>
      <textarea
        id="message"
        rows="4"
        class="block p-2.5 w-full text-sm max-h-[400px] h-[400px] rounded-lg border  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        placeholder="Write your thoughts here..."
        onChange={handleInputChange}
        value={inputValue()}
      ></textarea>

      <div class="flex justify-between pt-2">
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
    </>
  );
}
