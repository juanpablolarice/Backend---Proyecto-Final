const program = require('commander')
const dotenv = require('dotenv');
dotenv.config();

let enviroment;
let persistence;

program
    .option('-d', 'Variable para debug', false)
    .option('--persist <mode>', 'Modo de persistencia', "mongodb")
    .option('--mode <mode>', 'Modo de trabajo', 'dev')
program.parse();

if (program.opts().mode == 'production') {
    enviroment = 'production'
} else {
    // default
    enviroment = 'development'
}

if (program.opts().persist == 'filesystem') {
    persistence = 'filesystem'
}else{
    // default
    persistence = 'mongodb'
}

dotenv.config({
    path: enviroment === 'production' ? './.env.production' : './.env.development'
});

module.exports = {
    PORT: process.env.PORT,
    DB: process.env.DB,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GMAIL_ACCOUNT: process.env.GMAIL_ACCOUNT,
    GMAIL_APP_PASSWD: process.env.GMAIL_APP_PASSWD,
    ENVIROMENT: enviroment,
    PERSISTENCE: persistence
};
