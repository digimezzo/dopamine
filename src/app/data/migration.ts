export interface Migration {
 id: number;
 name: string;
 up: string;
 down: string;
}
