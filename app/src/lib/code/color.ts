const colors = [
    "003f5c",
    "2f4b7c",
    "665191",
    "a05195",
    "d45087",
    "f95d6a",
    "ff7c43",
    "ffa600",
    "00876c",
    "3d9b70",
    "63ae74",
    "89c079",
    "afd27f",
    "d6e487",
    "fff492",
    "fed777",
    "fbba63",
    "f69c56",
    "ee7e50",
    "e35e4e",
    "d43d51"
].reverse();

export const getColorCss = (index: number) => {
    const color = colors[index];
    const [red, green, blue] = [
        color.substring(0, 2),
        color.substring(2, 4),
        color.substring(4, 6),
    ].map((x) => Math.round(Math.min(parseInt(x, 16) * 1.2, 255)));
    return { rgb: `rgb(${red}, ${green}, ${blue})`, hex: `#${color}` }
}

export const getNextColorIndex = (index: number) => (index + 1) % colors.length;