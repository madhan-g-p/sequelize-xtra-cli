const chalk=require("chalk")
// const {log,info,error,warn} = console;

// module.exports = {
//     log(){
//         log(...arguments)
//     },
//     info(){
//         log();
//         info( chalk.bgBlue.whiteBright(" i "),chalk.blueBright("[INFO] "),...arguments);
//         log();
//     },
//     warn(){
//         log();
//         warn(chalk.yellow("⚠️  [WARN] "),...arguments)
//         log();
//     },
//     errored(){
//         log();
//         error(chalk.red("🛑 [ERROR] "),...arguments)
//         log();
//     },
//     success(){
//         log();
//         log(chalk.green("✅ [SUCCESS] "),...arguments)
//         log();
//     }
// }

module.exports = {
    log(){
        process.stdout.write([...arguments].join(' ') + '\n');
    },
    info(){
        process.stdout.write('\n' + chalk.bgBlue.whiteBright(" i ") + chalk.blueBright("[INFO] ") + [...arguments].join(' ') + '\n\n');
    },
    warn(){
        process.stdout.write('\n' + chalk.yellow("⚠️  [WARN] ") + [...arguments].join(' ') + '\n\n');
    },
    errored(){
        process.stdout.write('\n' + chalk.red("🛑 [ERROR] ") + [...arguments].join(' ') + '\n\n');
    },
    success(){
        process.stdout.write('\n' + chalk.green("✅ [SUCCESS] ") + [...arguments].join(' ') + '\n\n');
    }
}