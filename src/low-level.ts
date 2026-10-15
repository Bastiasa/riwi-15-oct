import inquirer from "inquirer";
import { defineProgram, formatCop, showProgramsSelector } from "./utils.js";

const LOW_LEVEL_PROGRAMS = [
    defineProgram("Clasificador de temperatura", async (recall) => {
        const { temperatureText } = await inquirer.prompt([
            {
                type: "input",
                message: "Escriba una temperatura en grados celsius",
                name: "temperatureText",
            },
        ]);

        const temperature = parseFloat(temperatureText);

        if (!isFinite(temperature)) {
            console.error(
                "El número que ha dado no es un texto. Intentémoslo otra vez:",
            );
            await recall(false);
            return;
        }

        if (temperature < 10) {
            console.log("Coño hermano, hace cule frío, ponte chaqueta.");
        }

        if (temperature >= 10 && temperature <= 24) {
            console.log("Todo bien broski, el clima está templao'.");
        }

        if (temperature >= 25) {
            console.log(
                "A la madre, está haciendo más calor que en Barranquilla, vaya tome agua mijo.",
            );
        }
    }),

    defineProgram("Cobro del parqueadero", async (recall) => {
        let { parkingHours, role } = await inquirer.prompt([
            {
                type: "number",
                name: "parkingHours",
                message: "Introduce las horas en el parqueadero",
            },

            {
                type: "select",
                name: "role",
                message: "Seleccione su rol",
                choices: [
                    {
                        name: "Coder",
                        value: "coder",
                    },

                    {
                        name: "Otro",
                        value: "Other",
                    },
                ],
            },
        ]);

        let finalCost = 0;

        const applyDiscountIfIsCoder = () => {
            if (role === "coder") {
                return finalCost - finalCost * 0.15;
            }
            return finalCost;
        };

        finalCost += 3000;
        parkingHours -= 1;

        if (parkingHours > 0) {
            for (let i = 0; i < parkingHours; i++) {
                finalCost += 2000;
            }
        }

        finalCost = Math.min(20_000, finalCost);
        finalCost = applyDiscountIfIsCoder();

        console.log(`El cobro del parqueadero es $ ${formatCop(finalCost)}`);
    }),

    defineProgram("Cuenta regresiva de lanzamiento", async (recall) => {
        const { n } = await inquirer.prompt([
            {
                name: "n",
                type: "number",
                message:
                    "Escriba un número mayor a cero para empezar la cuenta regresiva.",
            },
        ]);

        if (n <= 0) {
            console.error("El número debe ser mayor a cero.");
            await recall(false);
            return;
        }

        console.log("¡Empieza la cuenta regresiva!");

        for (let i = n; i > 0; i--) {
            console.log(`¡${i}!`);
        }

        console.log("DESPEGUEEEEE.");
    }),

    defineProgram("RiwiCoder", async (recall) => {
        const { n } = await inquirer.prompt([
            {
                name: "n",
                message: "Escribe un número",
                type: "number",
            },
        ]);

        const lines = [];

        for (let i = 0; i < n; i++) {
            const five = i % 5 === 0;
            const three = i % 3 === 0;

            let message = "";
            if (five && three) {
                message = "RiwiCoder";
            } else if (five) {
                message = "Coder";
            } else if (three) {
                message = "Riwi";
            } else {
                message = i.toString();
            }

            lines.push(message);
        }

        console.log("Resultado: ", lines.join(" "));
    }),

    defineProgram("Adivina el número", async (recall) => {
        const secret = Math.floor(Math.random() * 20);
        let given = -1;

        do {
            if (given > 0 && given !== secret) {
                console.log("Intenta otra vez.");
            }

            const { inputNumber } = await inquirer.prompt([
                {
                    type: "number",
                    name: "inputNumber",
                    message:
                        "Intenta adivinar el número entre 1 y 20 que estoy pensando.",
                },
            ]);

            given = inputNumber;
        } while (given !== secret);

        console.log(`¡Adivinaste, era el ${secret}!`);
    }),

    defineProgram("Validar una contraseña segura", async (recall) => {
        const REQUIRED_MIN_LENGTH = 8;
        const NUMBERS = "1234567890";
        const UPPER = "QWERTYUIOPASDFGHJKLÑZXCVBNM";

        while (true) {
            const { givenPassword } = await inquirer.prompt([
                {
                    name: "givenPassword",
                    type: "input",
                    message: "Escribe una contraseña segura.",
                },
            ]);

            let hasNumber = false;
            let hasUpper = false;
            let hasRequiredMinLength =
                givenPassword.length >= REQUIRED_MIN_LENGTH;

            for (let i = 0; i < givenPassword.length; i++) {
                const char = givenPassword.charAt(i);

                if (NUMBERS.includes(char)) {
                    hasNumber = true;
                }

                if (UPPER.includes(char)) {
                    hasUpper = true;
                }
            }

            if (!hasNumber) {
                console.error(
                    "La contraseña debe contener al menos un número.",
                );
            }

            if (!hasUpper) {
                console.error(
                    "La contraseña debe tener al menos una letra mayúscula.",
                );
            }

            if (!hasRequiredMinLength) {
                console.error(
                    "La contraseña debe tener al menos 8 caracteres.",
                );
            }

            if (hasNumber && hasUpper && hasRequiredMinLength) {
                console.log("¡Tu contraseña es segura!");
                break;
            }
        }
    }),
];

export function lowLevelProgramSelector() {
    return showProgramsSelector(LOW_LEVEL_PROGRAMS);
}
