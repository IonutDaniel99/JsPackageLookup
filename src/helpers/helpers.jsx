import { FaSolidEquals } from "solid-icons/fa";
import { ImArrowDownRight2, ImArrowUpRight2 } from "solid-icons/im";
import semver from "semver";

export function returnDiffIcons(diffValue) {
    switch (diffValue.toLowerCase()) {
        case "higher":
            return <ImArrowUpRight2 class="h-4 w-4" color="#059669" />;
        case "equal":
            return <FaSolidEquals class="h-4 w-4" color="#d97706" />;
        case "lower":
            return <ImArrowDownRight2 class="h-4 w-4" color="#dc2626" />;
    }
}


export const checkVersionDiff = (actual, latest) => {
    const cleanVersion1 = semver.clean(actual.replace(/[~^]/g, ''));
    const cleanVersion2 = semver.clean(latest.replace(/[~^]/g, ''));
    if (cleanVersion1 === cleanVersion2) return "Equal";
    const x = semver.gte(cleanVersion1, cleanVersion2);
    return x == true ? "Higher" : "Lower";
};

export const getLibraryDetails = async (libraryName) => {
    try {
        const response = await fetch(`https://registry.npmjs.org/${libraryName}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const checkForJsonTitle = (title) => {
    return title === "Dependencies" ? "dependencies" : "devDependencies"
}

export const returnPercentageForSlider = (arrayLength, currentNumber) => {
    const x = (currentNumber / arrayLength.length) * 100
    return x.toFixed(0);
}
