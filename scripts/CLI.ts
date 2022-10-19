import commandLineArgs from 'command-line-args';

export type PresentOrNot = undefined;

type OptionType = StringConstructor | BooleanConstructor;

type CommandLineOption<T extends OptionType> = {
    type: T,
    defaultValue?: T extends StringConstructor ? string : boolean,
    alias: string,
    description: string,
    trueIfPresent?: T extends StringConstructor ? never : boolean;
};

const help: CommandLineOption<BooleanConstructor> = {
    type: Boolean,
    alias: 'h',
    description: 'Display a help message',
    trueIfPresent: true
};

type CommandLineOptions = Record<string, CommandLineOption<OptionType>>;

export const processCommandLineArgs = <T extends CommandLineOptions>(
    command: string,
    options: T,
    parseOptions: commandLineArgs.ParseOptions = { partial: true }
) => {
    const optionsAndHelp = { ...options, help };

    type Args = { [k in keyof T]: (T[k]['type'] extends StringConstructor ? string : boolean) | undefined };

    const definitions = Object.entries(optionsAndHelp)
        .map(([name, { alias, type, defaultValue }]) => ({ name, alias, type, defaultValue }));

    const args = commandLineArgs(definitions, parseOptions);

    /*
    if (Object.keys(args).length === 0) {
        console.error("No command line input given. See help below:");

        args["help"] = null;
    }*/

    const valuesForType = (name: string, type: OptionType) =>
        type === String
            ? "[\"text\"]"
            : optionsAndHelp[name].trueIfPresent ? "" : "[true or false]";

    if ("help" in args) {
        const nameFlags = (definitions.map(({ name, type }) => `--${name} ${valuesForType(name, type)}`)).join("");
        const aliasFlags = (definitions.map(({ alias, type, name }) => `-${alias} ${valuesForType(name, type)}`)).join("");

        console.log(`Usage:`);
        console.log(`\t${command} ${nameFlags}`);
        console.log(`\t${command} ${aliasFlags}`);

        console.log('Options:');
        Object.entries(optionsAndHelp).forEach(([name, { alias, description, trueIfPresent }]) => {
            console.log(`\t-${alias} --${name}\t\t${description}${trueIfPresent ? ", true if present" : ""}`);
        });
        process.exit(0);
    }

    for (const arg in args) {
        console.log(args);
        if (options[arg].trueIfPresent) {
            args[arg] = true;
        }
    }

    return args as Args;
};