const ChildProcess = require('child_process');
const Fs = require('fs');
const Path = require('path');
const Readline = require('readline');
const File = require('server-service-file');

const FileService = new File.File();

const Environments = require('../src/common/environment.json');
const PackageInfo = require('../package.json');

const InputPath = './dist';

const OutputPath = './.temps/build';

setTimeout(async () => {
    const Version = PackageInfo['webversion'] || PackageInfo['version'];

    try {
        console.log('\x1b[0m' + '\x1b[34m' + `build v${Version} start` + '\x1b[0m');

        if (Fs.existsSync(`${OutputPath}/${Version}`)) {
            Fs.rmdirSync(`${OutputPath}/${Version}`, { recursive: true });
        }

        const TotalCount = Object.keys(Environments).length;
        const EnvironmentDirectory = Object.keys(Environments).entries();
        for (let [index, value] of EnvironmentDirectory) {
            console.log();
            console.log('\x1b[0m' + '\x1b[34m' + `build v${Version}-${value} (${index + 1}/${TotalCount}) start` + '\x1b[0m');

            await new Promise((resolve, reject) => {
                let workerStdout = undefined;
    
                let worker = ChildProcess.exec(`npm run build`, { env: { Runtime_Environment: value } });
                worker.once('error', (err) => {
                    return reject(err);
                });
                worker.once('close', (code, signal) => {
                    if (!!workerStdout) {
                        workerStdout.close();
                    }
    
                    return resolve();
                });
    
                workerStdout = Readline.createInterface({
                    input: worker.stdout,
                }).on('line', (chunk) => {
                    console.log(`${chunk}`);
                });
            });

            FileService.copyFolder(`${InputPath}`, `${OutputPath}/${Version}/${value.toLowerCase()}/dist`);
            
            console.log('\x1b[0m' + '\x1b[32m' + `build v${Version}-${value} (${index + 1}/${TotalCount}) done` + '\x1b[0m');
        }

        console.log();
        console.log('\x1b[0m' + '\x1b[32m' + `build v${Version} done` + '\x1b[0m');
    } catch (e) {
        console.log('\x1b[0m' + '\x1b[31m' + `build v${Version} fail, ${e instanceof Error ? e.message : e}` + '\x1b[0m');
    }
}, 0);
