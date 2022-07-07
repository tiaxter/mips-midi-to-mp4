/* eslint-disable react/no-danger */
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
// @ts-ignore
import {oneDark} from "react-syntax-highlighter/dist/esm/styles/prism";

import {useEffect, useRef, useState} from "react";
import { useCurrentFrame, useVideoConfig} from "remotion";

type Props = {
    code: string,
    timings: number[],
};

export const AssemblyRunPlayback = ({ code, timings }: Props) => {
    // Video information
    const {fps} = useVideoConfig();
    const frame = useCurrentFrame();
    const playbackTimeMs = (frame/fps) * 1000;

    // States
    const [currentExecutedLine, setCurrentExecutedLine] = useState(0);
    const [timeToWait, setTimeToWait] = useState<any>(null);

    // Functions
    const isInViewport = (elem: Element) => {
        const bounding = elem.getBoundingClientRect();
        return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // Some shitty logic
    useEffect(() => {
        if (playbackTimeMs < timeToWait) {
            return;
        }

        if (timeToWait !== null && playbackTimeMs > timeToWait) {
            setTimeToWait(null);
        }


        setCurrentExecutedLine(currentExecutedLine + 1);
    }, [playbackTimeMs]);

    // The logic for make right stuff
    useEffect(() => {
        // Scroll to the hightlighted line
        // const highlightedLine = document.querySelector(`code > span[style]:not([style=''])`);
        // if (highlightedLine !== null && !isInViewport(highlightedLine)) {
        //     highlightedLine.scrollIntoView();
        // }

        setTimeToWait(playbackTimeMs + timings[currentExecutedLine]);
    }, [currentExecutedLine]);

    return (
        <SyntaxHighlighter
            wrapLines
            showLineNumbers
            lineNumberStyle={{display: 'none'}}
            codeTagProps={{
                className: 'flex flex-col'
            }}
            lineProps={(lineNumber: number) => {
                if (lineNumber === currentExecutedLine) {
                    return {
                        style: {
                            display: "inline-block",
                            width: "calc(100%)",
                            backgroundColor: "rgba(255, 255, 255, 0.25)",
                            borderLeft: "1px solid rgba(255, 255, 255, 0.6)",
                            borderRight: "1px solid rgba(255, 255, 255, 0.6)",
                        },
                    };
                }

                return {};
            }}
            style={oneDark}
            language="perl"
        >
            {code}
        </SyntaxHighlighter>
    );
};