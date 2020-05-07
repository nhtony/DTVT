import { DAL } from "../database/DAL";

class CRUD extends DAL {


    private selectSQL: string | undefined;
    private insertSQL: string | undefined;
    private updateSQL: string | undefined;
    private deleteSQL: string | undefined;

    private flag = '';
    private temp = false;
    private isInit = false;
    private tableName = '';

    private init() {
        this.isInit = true;
        this.selectSQL = 'SELECT ';
        this.insertSQL = 'INSERT INTO ';
        this.updateSQL = 'UPDATE ';
        this.deleteSQL = 'DELETE ';
    }

    protected select(sels: Array<any>) {
        if(!this.isInit) throw new Error('Please init first');

        const sel = sels.length === 0 ? '*' : sels.join();
        this.selectSQL += `${sel} FROM ${this.tableName}`;
        this.flag = 's';
        this.temp = true;
    }

    protected insert(obj: any) {
        if(!this.isInit) throw new Error('Please init first');
    
        const cols = Object.keys(obj);
        const vals = Object.values(obj);
        let tempVal = '';
        vals.forEach((val, index) => {
            tempVal += `'${val}'`;
            if (index < vals.length - 1) tempVal += ',';
        });
        const strCols = `(${cols.join()})`;
        const strVals = `(${tempVal})`;
        this.insertSQL += `${this.tableName} ${strCols} VALUES ${strVals}`;
        this.flag = 'i';
        this.temp = true;
    }

    protected update(obj: any) {

        if(!this.isInit) throw new Error('Please init first');

        let str: string = '';
        const cols = Object.keys(obj);
        const vals = Object.values(obj);

        for (let i = 0; i < cols.length; i++) {
            str += `${cols[i]} = '${vals[i]}'`;
            if (i < cols.length - 1) str += ',';
        }

        this.updateSQL += this.tableName + ' SET ' + str;

        this.flag = 'u';
        this.temp = true;
    }

    protected where(obj: any, condition: string = 'AND') {
       
        let str: string = '';
        const cols = Object.keys(obj);
        const vals = Object.values(obj);

        for (let i = 0; i < cols.length; i++) {
            str += `${cols[i]} = '${vals[i]}'`;
            if (i < cols.length - 1) str += ` ${condition} `;
        }

        if (this.temp) {
            switch (this.flag) {
                case 's':
                    this.selectSQL += ` WHERE ${str}`;
                    break;
                case 'i':
                    this.insertSQL += ` WHERE ${str}`;
                    break;
                case 'u':
                    this.updateSQL += ` WHERE ${str}`;
                    break;
                case 'd':
                    this.deleteSQL += ` WHERE ${str}`;
                    break;
                default:
                    throw new Error('No query at all');
            }
        } else {
            throw new Error('Invalid Query');
        }
    }

    public createQueryBuilder(tableName: string) {
        this.tableName = tableName;
        this.init();
    }

    public getQuery() {
        switch (this.flag) {
            case 's':
                return this.selectSQL;
            case 'i':
                return this.insertSQL;
            case 'u':
                return this.updateSQL;
            case 'd':
                return this.deleteSQL;
            default:
                throw new Error('No query at all');
        }
    }
}

export default CRUD;