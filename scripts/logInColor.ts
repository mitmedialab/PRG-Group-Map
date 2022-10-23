import chalk from "chalk";

export const enum Color {
    Cyan,
    Green,
    Red,
    Grey
}

const applyColor = (msg: string, color: Color): string => {
    switch (color) {
        case Color.Cyan:
            return chalk.cyan(msg);
        case Color.Green:
            return chalk.green(msg);
        case Color.Red:
            return chalk.red(msg);
        case Color.Grey:
            return chalk.gray(msg);
    }

}

export const log = (msg: string, color: Color) => console.log(applyColor(msg, color));
export const error = (msg: string, color: Color = Color.Red) => console.error(applyColor(msg, color));

