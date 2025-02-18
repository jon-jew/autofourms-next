import { toast } from "react-toastify";

const toastSuccess = (message: string) => {
    toast.success(message);
};

const toastError = (message: string) => {
    toast.error(message);
};

function toTitleCase(text: string) {
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
};

function toCamelCase(str: string) {
    // Using replace method with regEx
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

const getWheelOptions = (start: number, end: number, increment: number) => {
    const result = [];
    for (let i = start; i <= end; i += increment) result.push({ label: `${i}"`, value: i });

    return result;
}

const getWheelOffsets = () => {
    const result = [];
    for (let i = -30; i <= 70; i++)
        result.push({ label: i > 0 ? `+${i}` : i, value: i });
    return result;
}

export {
    toTitleCase,
    toCamelCase,
    getWheelOptions,
    getWheelOffsets,
    toastSuccess,
    toastError,
};