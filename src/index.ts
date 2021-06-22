// import { CabinInTheWoods } from "./CabinInTheWoods";
// import { Pirates1 } from "./Pirates1";
import { CONTENT_INDEX } from "./ContentIndex";

// CONSTANTS
const FPS_OF_VIDEO: number = 5;

// RUNTIME GLOBALS
let hasInput = false;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");
    document.getElementById("searchBar").focus();
});

function addInput(_canvas: HTMLCanvasElement, x: number, y: number) {
    return new Promise<void>((resolve: Function, reject: Function) => {
        const input = document.createElement('textarea');

        input.id = "activeCanvasTextbox";
        // input.type = 'text';
        let fontSize: number = Math.round(64 * (_canvas.width / 640));
        input.style.background = "none";
        input.style.caretColor = "white";
        input.style.color = "white";
        input.style.fontFamily = "Oswald";
        input.style.fontSize = `${fontSize}px`;
        input.style.textAlign = "center";
        input.style.position = 'fixed';
        input.style.left = (x - (_canvas.width / 2)) + 'px';
        if (y > (_canvas.height / 2)) {
            // bottom
            input.style.top = `${_canvas.height - 200}px`;
        } else {
            // top
            input.style.top = "10px";
        }
        input.style.width = `${_canvas.width - 10}px`;
        input.style.height = `${fontSize}px`;
        input.style.overflow = "hidden";
        input.style.resize = "none";
        input.style.padding = "30px 0";

        document.getElementById("canvasWrapper").appendChild(input);

        input.onkeydown = (e: KeyboardEvent) => {
            if (handleEnter(_canvas, input, e, x, parseInt(input.style.top))) {
                resolve();
            }
        }

        input.focus();

        hasInput = true;
    });
}

function handleEnter(_canvas: HTMLCanvasElement, inputElement: HTMLTextAreaElement, e: KeyboardEvent, x: number, y: number) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
        if (e.shiftKey) {
            //     inputElement.value += "\\n";
            return;
        }

        // drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.getElementById("canvasWrapper").removeChild(inputElement);
        hasInput = false;
        const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
        const lines: string[] = inputElement.value.split("\\n");
        let fontSize: number = Math.round(64 * (canvas.width / 640));
        for (let i = 0; i < lines.length; i++) {
            const text: string = (lines[i]).toUpperCase();

            ctx.strokeStyle = "black";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `${fontSize}px Oswald`;
            while (ctx.measureText(text).width > canvas.width) {
                ctx.font = `${--fontSize}px Oswald`;
            }

            ctx.fillText(text,
                _canvas.width / 2,
                y + (fontSize * i) + fontSize
            );
            ctx.strokeText(text,
                _canvas.width / 2, y + (fontSize * i) + fontSize);
        }
        return true;
    }
    requestAnimationFrame(() => inputElement.value = inputElement.value.toUpperCase());
    return false;
}

function search() {

    // get the search request and sanitize it
    const searchContent: string = (document.getElementById("searchBar") as HTMLInputElement).value;
    const results = [];
    for (let i = 0; i < CONTENT_INDEX.length; i++) {
        const currContent = CONTENT_INDEX[i];
        const _results = currContent.filter((e) => {
            return sanitizeString(e.text).indexOf(sanitizeString(searchContent)) !== -1;
        }).map((e) => {
            e.id = i.toString();
            return e;
        });
        if (_results.length > 0) {
            results.push(..._results);
        }
    }

    if (results.length === 0) {
        alert("Failed to find quote!");
        return;
    }

    // hide search bar
    document.getElementById("searchBarDiv").remove();
    // hide splash
    document.getElementById("splashImage").remove();

    // Get the main result div
    const searchResultMainDiv: HTMLDivElement = document.getElementById("resultDiv") as HTMLDivElement;
    const elements: HTMLCollectionOf<HTMLImageElement> =
        searchResultMainDiv.getElementsByClassName("searchResult") as HTMLCollectionOf<HTMLImageElement>;

    for (let i = 0; i < results.length; i++) {
        if (i >= elements.length)
            break;
        const result = results[i];
        const element = elements[i];

        // Calculate the frame number based on FPS
        const startTimeMS: number = result.startTime + ((result.endTime - result.startTime) / 2);
        const startTimeS: number = Math.floor(startTimeMS / 1000);
        const frame: number = Math.floor(startTimeS * FPS_OF_VIDEO);
        const frameNum: number = frame + i;
        let fileNumPro: string = frameNum.toString();
        // Format string to be 5 digits
        while (fileNumPro.length < 5) {
            fileNumPro = "0" + fileNumPro;
        }

        if (results.length === 1) {
            handleSelectedFrame(frameNum, result.id);
            return;
        }

        const url: string = `./${result.id}/thumbnails-${fileNumPro}.jpeg`;
        element.src = url;
        element.onclick = () => {
            handleSelectedFrame(frameNum, result.id);
        }
    }

}

function handleSelectedFrame(frameNum: number, contentId: string): void {
    const searchResultMainDiv: HTMLDivElement = document.getElementById("resultDiv") as HTMLDivElement;
    const elements: HTMLCollectionOf<HTMLImageElement> =
        searchResultMainDiv.getElementsByClassName("searchResult") as HTMLCollectionOf<HTMLImageElement>;

    // Get the individual elements to populate with images
    const elementsCount = elements.length;
    const frameAdj: number = frameNum - Math.floor(elementsCount / 2);
    for (let i = 0; i < elementsCount; i++) {
        const element: HTMLImageElement = elements[i];
        const frameNum: number = frameAdj + i;
        let fileNumPro: string = frameNum.toString();
        // Format string to be 5 digits
        while (fileNumPro.length < 5) {
            fileNumPro = "0" + fileNumPro;
        }
        const url: string = `./${contentId}/thumbnails-${fileNumPro}.jpeg`;
        const fullUrl: string = `./${contentId}/full-${fileNumPro}.jpeg`;
        element.src = url;
        element.onclick = () => {
            removeAllSearchResultElements(element);

            // Setup canvas and draw image
            const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;
            const ctx = canvas.getContext('2d');
            var img = new Image();
            img.onload = function () {

                canvas.width = img.width * 1.75;
                canvas.height = canvas.width * 0.8;
                const height: number = canvas.width * (img.height / img.width);
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img,
                    0,
                    (canvas.height / 2) - (height / 2),
                    canvas.width,
                    height
                );

                // Add the top and bottom text select
                addInput(
                    canvas,
                    canvas.width * 0.5,
                    canvas.height * 0.1
                ).then(() => {
                    return addInput(
                        canvas,
                        canvas.width * 0.5,
                        canvas.height - (canvas.height * 0.2)
                    );
                });
            };
            img.src = fullUrl;
            canvas.style.visibility = "visible";

            // Remove the selected img
            element.remove();
        }
    }
}

/**
 * Iterates over all the searchResult images and removes them. Also removes searchBarDiv
 * @param excludeImgRef If present, exclude deleting this image
 */
function removeAllSearchResultElements(excludeImgRef?: HTMLImageElement): void {
    let elements: HTMLCollectionOf<HTMLImageElement>;
    while (
        (
            elements =
                document.getElementsByClassName("searchResult") as HTMLCollectionOf<HTMLImageElement>
        ).length > 1
        ) {
        for (let i = 0; i < elements.length; i++) {
            if (!excludeImgRef || (excludeImgRef.src !== elements[i].src))
                elements[i].remove();
        }
    }
    document.getElementById("resultDiv").remove();
    try {
        document.getElementById("searchBarDiv").remove();
    } catch (e) {
    }
    document.getElementById("canvasWrapper").style.visibility = "visible";
    for (
        let hint of
        document.getElementsByClassName("hint") as HTMLCollectionOf<HTMLParagraphElement>
        ) {
        hint.style.visibility = "visible";
    }
}

/**
 * Removes apostophes, quotemarks, commas, and full-stops
 * @param _input
 */
function sanitizeString(_input: string): string {
    let output: string = "" + _input;

    output = output.toLowerCase();
    output = output.replace(/'/g, "");
    output = output.replace(/"/g, "");
    output = output.replace(/,/g, "");
    output = output.replace(/\./g, "");

    return output;
}

// Expose the search function to the search button
// @ts-ignore
window.search = search;
