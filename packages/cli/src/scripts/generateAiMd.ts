import { execSync } from 'child_process';

// const value = execSync('ts-node  ../bin.ts api -d -js -p ./generate/entities', { cwd: __dirname });
const value = execSync('ts-node  ../bin.ts ai-md', { cwd: __dirname });
// console.log(value.toString());
// consola 打印信息不会显示
debugger;
