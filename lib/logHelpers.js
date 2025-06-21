const chalk=require("chalk")

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