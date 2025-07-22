import { MikroORM } from "@mikro-orm/postgresql";
import config from "../mikro-orm.config";


const orm = MikroORM.initSync(config);

export default orm;