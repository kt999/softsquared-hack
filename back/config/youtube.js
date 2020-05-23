const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

///youtube

//Configure YoutubeMp3Downloader with your settings

const YD = new YoutubeMp3Downloader({
    "ffmpegPath": ffmpegPath,        // Where is the FFmpeg binary located?
    "outputPath": "./public/music",    // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",       // What video quality should be used?
    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});


module.exports = {
    YD : YD
};