import { execSync } from 'child_process';

execSync('tsx  ../bin.ts build -d  -p ../../', { cwd: __dirname });
// consola 打印信息不会显示
debugger;
