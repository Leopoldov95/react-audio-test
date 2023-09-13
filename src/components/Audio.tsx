import * as React from "react";
import { AudioProps } from "../interfaces/Interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faDownload } from "@fortawesome/free-solid-svg-icons";
import WaveSurfer from "wavesurfer.js";
import "./Audio.css";

export const AudioModule: React.FC<AudioProps> = ({
  data,
  isPlaying,
  handlePlay,
}) => {
  const waveformRef = React.useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [waveform, setWaveform] = React.useState<any>(null);
  const [percentage, setPercentage] = React.useState<number>(0);
  const [fill, setFill] = React.useState("0 100");

  React.useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current as HTMLElement,
      waveColor: "#505D68",
      progressColor: "#A1AEB7",
    });

    wavesurfer.load(data.music_link); // Replace with the path to your audio file

    //* Use this for percentage stuff
    wavesurfer.on("loading", (percentage) => {
      setPercentage(percentage);
    });

    wavesurfer.on("ready", () => {
      setLoading(false);
    });

    setWaveform(wavesurfer);

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  React.useEffect(() => {
    const circumference = 2 * Math.PI * 45;
    const dashValue = ((100 - percentage) / 100) * circumference;
    setFill(`${circumference - dashValue} ${dashValue} `);
  }, [percentage]);

  React.useEffect(() => {
    if (waveform) isPlaying ? waveform.play() : waveform.pause();
  }, [isPlaying]);

  const handleAppPlay: VoidFunction = () => {
    handlePlay();
  };

  return (
    <div className="audio">
      <div className="audio__playback">
        <div className="audio__action">
          {!isPlaying ? (
            <button
              disabled={loading}
              className="playback__btn audio__play"
              onClick={handleAppPlay}
            >
              <FontAwesomeIcon icon={faPlay} />
            </button>
          ) : (
            <button
              disabled={loading}
              className="playback__btn audio__pause"
              onClick={handleAppPlay}
            >
              <FontAwesomeIcon icon={faPause}></FontAwesomeIcon>
            </button>
          )}
        </div>
        <div className="audio__details">
          {/* <!-- name --> */}
          <h5 className="audio__title">
            {data.title}
            <a
              href={data.download_link}
              download
              target="_blank"
              className="audio__download"
            >
              <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
            </a>
          </h5>
          <div className="audio__info">
            <div>
              <span className="audio__text__label">Genre:</span>
              <span className="audio__text">
                {data.genre.map((g) => (
                  <span>{g}</span>
                ))}
              </span>
            </div>
            <div>
              <span className="audio__text__label">Tone:</span>
              <span className="audio__text">{data.tone}</span>
            </div>
          </div>
        </div>
        <div className="audio__duration">
          <div>
            <span className="audio__text__label">Duration:</span>
            <span className="audio__text">00:{data.time}</span>
          </div>
        </div>
      </div>
      <div className="audio__wave" id="waveform" ref={waveformRef}>
        {loading && (
          <div className="donut-container">
            <svg
              width="70px"
              height="100%"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle className="donut-background" cx="50" cy="50" r="45" />
              <circle
                className="donut-fill"
                cx="50"
                cy="50"
                r="45"
                strokeDasharray={fill}
              />
              <text className="donut-text" x="50" y="50">
                {percentage}%
              </text>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
