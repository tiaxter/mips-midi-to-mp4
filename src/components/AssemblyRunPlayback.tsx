/* eslint-disable react/no-danger */
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
// @ts-ignore
import {oneDark} from "react-syntax-highlighter/dist/esm/styles/prism";

import {useEffect, useRef, useState} from "react";
import { useCurrentFrame, useVideoConfig} from "remotion";

type Props = {
    code: string,
};

export const AssemblyRunPlayback = ({code}: Props) => {
    // Video information
    const {fps} = useVideoConfig();
    const frame = useCurrentFrame();

    // Stuffs
    const lineCodes = code.split("\n");

    // States
    const [currentExecutedLine, setCurrentExecutedLine] = useState(0);
    const [timeToWait, setTimeToWait] = useState<any>(null);
    const [lastSyscallNumber, setLastSyscallNumber] = useState(0);
    const [playbackTimeMs, setPlaybackTimeMs] = useState((frame / fps) * 1000);

    // Functions

    // Some shitty logic
    useEffect(() => {
       setPlaybackTimeMs((frame / fps) * 1000)
    }, [frame]);

    useEffect(() => {
        const currentLine = lineCodes?.[currentExecutedLine - 1]?.replace("\t", "");
        const isCurrentInstructionSyscall = currentLine === "syscall";

        if (playbackTimeMs < timeToWait && isCurrentInstructionSyscall) {
            return;
        }

        if (timeToWait !== null && playbackTimeMs > timeToWait) {
            setTimeToWait(null);
            setLastSyscallNumber(0);
        }


        setCurrentExecutedLine(currentExecutedLine + 1);
    }, [playbackTimeMs]);

    // The logic for make right stuff
    useEffect(() => {
        // Scroll to the hightlighted line
        const highlightedLine = document.querySelector(`code > span[style]:not([style=''])`);
        highlightedLine?.scrollIntoView({ behavior: "smooth" });

        const currentLine = lineCodes?.[currentExecutedLine - 1]?.replace("\t", "") ?? "";
        const lineSuffixGen = (register: string) => `li ${register}`;

        // If $v0 line
        let registerToCheck = "$v0";
        let lineSuffix = lineSuffixGen(registerToCheck);

        if (currentLine.startsWith(lineSuffix)) {
            setLastSyscallNumber(Number(currentLine.replace(lineSuffix, "")));
            return;
        }

        // If sleep
        registerToCheck = "$a0";
        lineSuffix = lineSuffixGen(registerToCheck);
        if (lastSyscallNumber === 32 && currentLine.startsWith(lineSuffix)) {
            setTimeToWait(playbackTimeMs + Number(currentLine.replace(lineSuffix, "")));
            return;
        }

        // If sound
        registerToCheck = "$a1";
        lineSuffix = lineSuffixGen(registerToCheck);
        if (lastSyscallNumber === 33 && currentLine.startsWith(lineSuffix)) {
            setTimeToWait(playbackTimeMs + Number(currentLine.replace(lineSuffix, "")));
        }

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