import { Show, createSignal } from "solid-js";
import InputZone from "./components/InputZone";
import PackageShow from "./components/PackageShow";

function App() {
  const [packageJsonObject, setPackageJsonObject] = createSignal({ dependencies: null, devDependencies: null, error: null });

  function handleJsonFromInputZone(childData) {
    setPackageJsonObject(childData);
  }

  return (
    <div class="h-screen w-screen flex justify-center ">
      <div class="container border-2  mx-auto my-4 pl-4 pr-14 w-4/6 bg-rose-100">
        <nav class="py-4">
          <ul class="flex items-center justify-between gap-4">
            <img class="h-12" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/540px-Npm-logo.svg.png" />
            <div class="flex items-center justify-start gap-4 pb-2">
              <a class="font-bold text-xl">Home</a>
              <a class="font-bold text-xl">News</a>
              <a class="font-bold text-xl">Contact</a>
              <a class="font-bold text-xl">About</a>
            </div>
          </ul>
        </nav>
        <div class="flex">
          <div class="w-3/12 h-full mr-4">
            <InputZone sendJsonToParent={handleJsonFromInputZone} />
          </div>
          <div class="w-9/12 flex flex-col gap-2 pt-9">
            <Show when={(packageJsonObject().dependencies !== null && packageJsonObject().devDependencies !== null) && !packageJsonObject().error}>
              <PackageShow dependencies={packageJsonObject().dependencies} devDependencies={packageJsonObject().devDependencies} />
            </Show>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
