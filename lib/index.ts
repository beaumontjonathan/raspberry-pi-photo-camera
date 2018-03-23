import {exec} from 'child_process';

export function takePicture(fileName: string): Promise<void> {
    return snap(fileName)
}

async function snap(fileName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        exec(`raspistill -o ${fileName}.jpg`, (err, stdout, stderr) => {
            if (err || stderr) reject();
            else resolve();
        });
    });
}