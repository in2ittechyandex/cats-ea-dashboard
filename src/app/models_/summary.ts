export class TechReports {
    public id: Number;
    public name: String;
    public title: String;
    public isReportLoaded: Boolean = false;
    public data: any;
    public repHeaders: any;
    public color: any = 'green';
    constructor(obj: any) {
        this.id = obj.id;
        this.name = obj.name;
        this.title = obj.title ? obj.title : '';
        this.isReportLoaded = obj.isChartLoaded ? obj.isChartLoaded : false;
        this.data = (obj && obj['data']) ? obj.data : [];
        this.color = obj.color ? obj.color : 'green';
    }
  }
