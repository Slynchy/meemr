# meemr

`meemr` is an open-source meme generator website template written in TypeScript, designed to be lightweight and minimalistic for the smallest bandwidth usage possible.

## Notes before use

This was rushed to be released within 4 days of starting the project, so it's quite rough around the edges. I'd suggest waiting until I've at least finished writing the full setup guide to use!

Furthermore, I am not responsible for any illegal hosting of copyrighted content through the use of this software, nor is any warranty provided for this software; it is provided as-is.

## Prerequisites

* NodeJS
* ffmpeg
* A video file in an FFMPEG-compatible format
* .srt file from the video

## Setup

1. Clone the repository somewhere 
1. `npm install` the dependencies
1. Run `node scripts/parseSrtFile.js [filename]` where `filename` is the path to your `.srt` file
    * The .srt parser does not play nice with some encodings; make sure the file is encoded as UTF8 or plaintext
1. Create a `.ts` file from the JSON file similar to the example in `src`
1. Cut your movies into thumbnails/full images using FFMPEG
    * I used this command: `.\ffmpeg.exe -i '.\input.mp4' -vf "scale=240:-1" -vsync 2 -r 5 -qscale:v 2 thumbnails-%05d.jpeg`
    * For full images: `.\ffmpeg.exe -i '.\input.mp4' -vf "scale=640:-1" -vsync 2 -r 5 -qscale:v 2 full-%05d.jpeg`
    * Take note of your `-r` value
1. Place the thumbnails+full images into `dist/0`
    * Additional content can go in as `dist/1`, `dist/2`, etc.
1. Replace `FPS_OF_VIDEO` constant with your `-r` value from above
1. Update `ContentIndex.ts` to import your srt files
    * You should have the same number of imports as folders under `dist`
1. Run `npm run build`
