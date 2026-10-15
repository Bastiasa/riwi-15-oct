import inquirer from "inquirer";

const formatter = new Intl.NumberFormat("es-CO", {
    currency: "COP",
});

export interface ProgramInfo {
    name: string;
    program: () => Promise<void> | void;
}

export function formatCop(n: number) {
    return formatter.format(n);
}

export async function showProgramsSelector(programs: ProgramInfo[]) {
    const { selectedProgram } = await inquirer.prompt([
        {
            type: "select",
            name: "selectedProgram",
            message: "Seleccione un programa",
            choices: [
                ...programs.map((p) => ({
                    name: p.name,
                    value: p.program,
                })),

                { name: "Volver", value: null },
            ],
        },
    ]);

    if (selectedProgram === null) {
        return;
    }

    await selectedProgram();

    await inquirer.prompt([
        {
            type: "input",
            name: "abc",
            message: "Presione enter para volver al menú.",
        },
    ]);
}

export function defineProgram(
    name: string,
    programProcess: (
        recall: (showTitle?: boolean) => Promise<void>,
    ) => Promise<any>,
) {
    function program(showTitle = true) {
        if (showTitle) {
            console.log(name);
        }

        return programProcess(program);
    }
    return {
        program,
        name,
    };
}

export function calcSum(values: number[]) {
    return values.reduce((prev, curr) => prev + curr, 0);
}

export function calcAverage(values: number[]) {
    return calcSum(values) / values.length;
}

export function calcHigher(values: number[]) {
    return values.reduce((prev, curr) => (prev > curr ? prev : curr), 0);
}

export function calcSmaller(values: number[]) {
    return values.reduce((prev, curr) => (prev < curr ? prev : curr), 0);
}
