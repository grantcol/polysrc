import { YT_API_KEY } from '../constants/credentials';

export function getChannel(channelId, maxResults=10) {
  let url = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`
  return fetch(url)
          .then((result) => { result.json() })
          .then((json) => { console.log(json) })
          .catch((err) => { console.error(err) })
}

export function getVideoSrc(videoId) {
  return `http://www.youtube.com/watch?v=${videoId}`;
}

export function getVideos(videoIds) {
  return videoIds.map((id) => { getVideoSrc(id) });
}

export function buildIframe(src, aspectRatio='16:9') {
  switch(aspectRatio) {
    case '16:9':
      return (
        <div className="embed-responsive embed-responsive-16by9">
          <iframe className="embed-responsive-item" src={src}></iframe>
        </div>
      )
    case '4:3':
    return (
      <div className="embed-responsive embed-responsive-4by3">
        <iframe className="embed-responsive-item" src={src}></iframe>
      </div>
    )
    default:
      return "";
  }
}

export function buildThumbnail(src, img){}
