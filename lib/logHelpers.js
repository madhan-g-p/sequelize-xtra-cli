const chalk=require("chalk")
const {log,info,error,warn} = console;
module.exports = {
    log(){
        log(...arguments)
    },
    info(){
        log();
        info( chalk.bgBlue.whiteBright(" i "),chalk.blueBright("[INFO] "),...arguments);
        log();
    },
    warn(){
        log();
        warn(chalk.yellow("⚠️  [WARN] "),...arguments)
        log();
    },
    errored(){
        log();
        error(chalk.red("🛑 [ERROR] "),...arguments)
        log();
    },
    success(){
        log();
        log(chalk.green("✅ [SUCCESS] "),...arguments)
        log();
    }
}