import inquirer from "inquirer";
import { ExitPromptError } from "@inquirer/core";
import { lowLevelProgramSelector } from "./low-level.js";
import { mediumLevelProgramSelector } from "./medium-level.js";

export async function startMainProgram() {
    const answers = await inquirer.prompt([
        {
            type: "select",
            name: "programSelected",
            message: "Selecciona el nivel.",
            choices: [
                {
                    name: "Nivel bajo",
                    value: "low-level",
                },

                {
                    name: "Nivel medio",
                    value: "medium-level",
                },

                {
                    name: "Nivel pro",
                    value: "pro-level",
                },
            ],
        },
    ]);

    switch (answers.programSelected) {
        case "low-level":
            await lowLevelProgramSelector();
            break;
        case "medium-level":
            await mediumLevelProgramSelector();
            break;
    }

    return startMainProgram();
}

try {
    await startMainProgram();
} catch (e) {
    if (e instanceof ExitPromptError) {
        console.log("Haz salido exitosamente.");
    } else {
        throw e;
    }
}
