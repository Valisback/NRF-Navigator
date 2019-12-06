export class Filter {
    id?: string;
    name: string;
    type: string;
    active: string;
    icon: string;
    color: string;

    constructor(type: string, name: string) {
        this.type = type;
        this.name = name;
        this.active = 'FALSE';
    }
}
