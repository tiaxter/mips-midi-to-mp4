import {Img, staticFile} from "remotion";

type Props = {
    title: string,
    artist: string,
};

export const TrackTitle = ({ title, artist } : Props) => {
    return (
        <div className="flex items-center px-2 py-1">
            <Img
                className="m-5 rounded-md shadow-md"
                width={75}
                height={75}
                src={staticFile("cover.jpeg")} alt="Music cover image"
            />
            <h1 className="text-4xl text-white">{title} - {artist}</h1>
        </div>
    );
}