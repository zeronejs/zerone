import path from "path";
import { ClassesInterpret, InterpretCore } from "../src";

const interpretCore = new InterpretCore(path.join(__dirname, 'test.entity.ts'));
const classes = new ClassesInterpret(interpretCore).interpret();


