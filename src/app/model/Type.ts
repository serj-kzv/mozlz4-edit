import Engine from "./Engine";

export default class Type {
    constructor(
        public name: string = '',
        public engines: Engine[] = []
    ) {
    }
}
