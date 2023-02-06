import { networkInterfaces } from 'os';
//获取本机ip地址
export function getIPAdresses() {
    const interfaces = networkInterfaces();
    const ips: string[] = [];
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                ips.push(alias.address);
            }
        }
    }
    return ips;
}
