import semver from "semver";
import { For, Show, createSignal, onMount } from "solid-js";
import TableContianer from "./TableContainer";

export default function PackageShow({ dependencies, devDependencies }) {
    const dep = Object.entries(dependencies);
    const devDep = Object.entries(devDependencies);

    return (
        <div class="h-full flex flex-col gap-10">
            <Show when={dep}>
                <TableContianer title={"Dependencies"} dependencies={dep} />
            </Show>
            <Show when={devDep}>
                <TableContianer title={"Development Dependencies"} dependencies={devDep} />
            </Show>
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
