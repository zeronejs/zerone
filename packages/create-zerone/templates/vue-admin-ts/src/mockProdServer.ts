// import { createProdMockServer } from 'vite-plugin-mock';
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';
// import roleMock from '../mock/role';
import userMock from '../mock/user';
import tableMock from '../mock/table';

export function setupProdMockServer() {
    createProdMockServer([...tableMock, ...userMock]);
}
