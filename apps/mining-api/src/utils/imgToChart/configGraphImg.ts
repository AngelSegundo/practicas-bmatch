
export class RecordSizeProperties {
    private static instance: RecordSizeProperties|null;

    ResolutionPdfAsimg: number;
    setSpaceBetweenBars: number;
    numberBars: number;
    sizeRecord: SizeRecord 
    numberSpacesBetweenBars: number;
    successPdfAsimg: boolean

    private constructor() {
        this.ResolutionPdfAsimg = 500
        this.setSpaceBetweenBars = 10;
        this.numberBars = 13;
        this.sizeRecord =  {
            x: 30,
            y: 390,
            height: 46,
            width: 182,
        };
        this.numberSpacesBetweenBars = 14;
        this.successPdfAsimg = false;
    }
    public setSizeRecord= (key:  keyof SizeRecord, value:number):void=>{
        this.sizeRecord[key] = value
    } 
    public static getInstance(): RecordSizeProperties {
        if (!RecordSizeProperties.instance) {
            RecordSizeProperties.instance = new RecordSizeProperties();
        }
        return RecordSizeProperties.instance;
    }
    public static destroyInstance(): void {
        RecordSizeProperties.instance = null;
    }
    
}

interface SizeRecord{
    x:number,
    y: number,
    height: number,
    width: number
}