import inquirer from "inquirer";
import {
    calcAverage,
    calcHigher,
    calcSmaller,
    calcSum,
    defineProgram,
    formatCop,
    showProgramsSelector,
} from "./utils.js";

function parseArrayNumbers(
    text: string,
    min: number = Number.MIN_VALUE,
    max: number = Number.MAX_VALUE,
) {
    return text
        .replaceAll(" ", "")
        .split(",")
        .map((n) => {
            return Math.min(max, Math.max(min, parseFloat(n)));
        })
        .filter(isFinite);
}

function parseStringArray(text: string) {
    return text.split(",").map((t) => t.trim());
}

const CODERS = [
    "Santiago",
    "Valentina",
    "Sebastián",
    "Camila",
    "Mateo",
    "Isabella",
    "Daniel",
    "Mariana",
    "Samuel",
    "Sofía",
    "Nicolás",
    "Gabriela",
    "Andrés",
    "Luciana",
    "David",
    "Manuela",
    "Alejandro",
    "Laura",
    "Felipe",
    "Daniela",
];

const WEEK_DAYS = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
];

const MEDIUM_LEVEL_PROGRAMS = [
    defineProgram("Notas del módulo", async (recall) => {
        const { rawNumbers } = await inquirer.prompt([
            {
                type: "input",
                name: "rawNumbers",
                message: "Escribe las notas separadas por comas.",
            },
        ]);

        const numbers = parseArrayNumbers(rawNumbers, 0.0, 5.0);

        if (numbers.length < 1) {
            console.error("Debes escribir al menos un número.");
            return await recall(false);
        }

        const higher = calcHigher(numbers);
        const smaller = calcSmaller(numbers);

        const average = calcAverage(numbers);
        const passed = numbers.filter((n) => n >= 3.0).length;

        console.log(
            "Resultado: " +
                (average >= 3.5 ? "Módulo aprobado" : "Debe reforzar"),
        );

        console.log(`Promedio\t\t${average.toFixed(2)}`);
        console.log(`Nota más alta\t\t${higher}`);
        console.log(`Nota más baja\t\t${smaller}`);
        console.log(`Notas aprobadas\t\t${passed}/${numbers.length}`);
    }),

    defineProgram("Control de inventario", async (recall) => {
        const { rawNumbers } = await inquirer.prompt([
            {
                type: "input",
                name: "rawNumbers",
                message:
                    "Escribe el stock de los productos separados por comas.",
            },
        ]);

        const stocks = parseArrayNumbers(rawNumbers, 0.0);

        if (stocks.length <= 0) {
            console.log("No has definido ningún stock.");
            return recall(false);
        }

        console.log("Resultado:");

        stocks.forEach((n, i) => {
            let message = "";
            if (n <= 0) {
                message = "Agotado";
            } else if (n < 5) {
                message = "Stock bajo";
            } else {
                message = "Disponible";
            }

            console.log(`Producto [${i}]: ${message}`);
        });
    }),

    defineProgram("Buscar un coder en la lista", async (recall) => {
        console.log("Los coders son los siguientes: ");
        console.log(CODERS.map((c) => `\t[+] ${c}`).join("\n"));

        while (true) {
            const { coderName } = await inquirer.prompt([
                {
                    type: "input",
                    name: "coderName",
                    message:
                        "Escribe el nombre del coder de quien quieras verificar (Escribe \\q para salir).",
                },
            ]);

            if (coderName == "\\q") {
                break;
            }

            const found = CODERS.find(
                (t) => t.toLowerCase() === coderName.toLowerCase(),
            );

            if (found) {
                console.log(`El coder ${found} está en la lista.`);
            } else {
                console.log(`El coder ${coderName} NO está en la lista.`);
            }
        }
    }),

    defineProgram("Temperaturas de la semana", async (recall) => {
        const { rawNumbers } = await inquirer.prompt([
            {
                type: "input",
                name: "rawNumbers",
                message:
                    "Escribe la temperatura de cada día de la semana separado por comas.",
            },
        ]);

        const temperatures = parseArrayNumbers(rawNumbers);

        if (temperatures.length > 7) {
            console.error("Solo son siete días, máximo.");
            return await recall(false);
        }

        const average = calcAverage(temperatures);
        const overAverage = temperatures.filter((n) => n > average).length;
        const higher = calcHigher(temperatures);
        const higherIndex = temperatures.findIndex((n) => n === higher);
        const above28 = temperatures.filter((n) => n > 28).length;

        console.log("Resultado: ");
        console.log(`Temperatura promedio\t\t${average.toFixed(2)}°`);

        console.log(
            `Día más caluroso\t\t${WEEK_DAYS[higherIndex]} (${higher}°)`,
        );
        console.log(
            `Días por encima del promedio\t\t${overAverage}/${temperatures.length}`,
        );
        console.log(`Resumen: ${above28 > 3 ? "Alerta de calor" : "Común"}`);
    }),

    defineProgram("Número palíndromo", async (recall) => {
        const { n } = await inquirer.prompt([
            {
                type: "number",
                name: "n",
                message: "Escriba un número que crea que es palíndromo.",
            },
        ]);

        const stringNumber: string = n.toString();
        const inversedStringNumber = stringNumber.split("").reverse().join("");

        if (stringNumber === inversedStringNumber) {
            console.log("Es un número palíndromo.");
        } else {
            console.log("NO es un número palíndromo.");
        }
    }),

    defineProgram("Carrito de compras", async (recall) => {
        const { productsPricesRaw } = await inquirer.prompt([
            {
                type: "input",
                name: "productsPricesRaw",
                message:
                    "Escribe los precios de los productos separados por comas.",
            },
        ]);

        const productsPrices = parseArrayNumbers(productsPricesRaw);

        const total = calcSum(productsPrices);
        let finalTotal = total;

        const shippingCost = total > 100_000 ? null : 12_000;

        const discountAvailable = total > 200_000;

        if (discountAvailable) {
            finalTotal = total * 0.9;
        }

        console.log("Resultado: ");
        console.log(`Subtotal\t\t$ ${formatCop(total)}`);
        console.log(`Descuento\t\t${discountAvailable ? "10%" : "No aplica"}`);

        total > 200_000;
        console.log(
            `Envío\t\t${shippingCost ? "$ " + formatCop(shippingCost) : "GRATIS"}`,
        );
    }),
];

export async function mediumLevelProgramSelector() {
    await showProgramsSelector(MEDIUM_LEVEL_PROGRAMS);
}
