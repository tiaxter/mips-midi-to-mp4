const calculateAssemblyExecutionDuration = (code: string) => {
    const codeLines = code.split("\n");
    let lastSyscallCalled = 0;
    let duration = 0;

    for (const codeLine of codeLines) {
        const currentLine = codeLine?.replace("\t", "") ?? "";

        // Check if li $v0
        const [ isSyscallSetInstruction, syscallValue ] = syscallNumberSet(currentLine);
        if (isSyscallSetInstruction) {
            lastSyscallCalled = syscallValue;
        }

        // If timing values
        duration += returnSleepTime(currentLine, lastSyscallCalled) ?? 1;
    }

    return duration;
};

const syscallNumberSet = (codeLine: string) : [boolean, number] => {
    // If $v0 line
    const lineSuffix = `li $v0`;

    return [
        codeLine.startsWith(lineSuffix),
        Number(codeLine.replace(lineSuffix, "")),
    ];
}

const returnSleepTime = (codeLine: string, syscallCode: number): number | null => {
    // If sleep
    let lineSuffix = `li $a0`;

    if (syscallCode === 32 && codeLine.startsWith(lineSuffix)) {
        return Number(codeLine.replace(lineSuffix, "")) + 1;
    }

    // If sound
    lineSuffix = `li $a1`;
    if (syscallCode === 33 && codeLine.startsWith(lineSuffix)) {
        return Number(codeLine.replace(lineSuffix, "")) + 1;
    }

    // If nothing
    return null;
}

export default {
    calculateAssemblyExecutionDuration,
    syscallNumberSet,
    returnSleepTime,
}