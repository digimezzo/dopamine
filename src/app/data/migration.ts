export abstract class Migration {
    public id: number;
    public name: string;
    public statements: string[] = [];
    public abstract up(): void;

    public sql(statement: string): void {
        this.statements.push(statement);
    }
}
