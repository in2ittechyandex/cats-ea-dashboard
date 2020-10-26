export class Report {
    public reportId: Number;
    public colSpan: Number;
    public name: String;
    public title: String;
    public url: String;
    public chartType: String = '';
    public isChartLoaded: Boolean = false;
    public isFilterLoaded: Boolean = false;
    public filters: Array<Filter> = [];
    public chartData: any;
    public isMultilevelDrill: Boolean = false;
    public isMultiLevelChartLoaded: Boolean = false;
    public mlChartData: any;
    public drillData: any;
    public repHeaders: any;

    constructor(obj: any) {
        this.reportId = obj.reportId;
        this.colSpan = obj.colSpan;
        this.name = obj.name;
        this.title = obj.title;
        this.url = obj.url;

        this.isChartLoaded = obj.isChartLoaded ? obj.isChartLoaded : false;
        this.isFilterLoaded = obj.isFilterLoaded ? obj.isFilterLoaded : false;

        if (obj['chartType']) {
            this.chartType = obj.chartType;
        }

        this.filters = (obj && obj['filters']) ? obj.filters : [];
        this.chartData = (obj && obj['chartData']) ? obj.chartData : [];
        this.isMultilevelDrill = (obj && obj['isMultilevelDrill']) ? obj.isMultilevelDrill : false;
        this.mlChartData = (obj && obj['mlChartData']) ? obj.mlChartData : {};
        this.isMultiLevelChartLoaded = false;
    }
}

export class TabSummary {
    public summaryReportId: Number;
    public name: String;
    public url: String;
    public title: String;
    public link: String;
    public isSummaryLoaded: Boolean = false;
    public summaryData: any = '';
    public ticketsUrl: String;

    constructor(obj: any) {
        this.summaryReportId = obj.summaryReportId;
        this.name = obj.name;
        this.url = obj.url;
        this.title = (obj && obj['title']) ? obj['title'] : 'No Description Available';
        this.link = (obj && obj['link']) ? obj['link'] : '';
        this.isSummaryLoaded = obj['isSummaryLoaded'] ? obj['isSummaryLoaded'] : false;
        this.summaryData = obj['summaryData'] ? obj['summaryData'] : '';
        this.ticketsUrl = (obj && obj['ticketsUrl']) ? obj['ticketsUrl'] : '';
    }

}

export class UserTab {
    public id: Number;
    public name: String;
    public status: Number;
    public updatedDateTime: Number;
    public description: String;
    public reportUrl: Array<Report> = [];
    public summarReportUrl: Array<TabSummary> = [];

    constructor(obj: any) {
        this.id = obj.id;
        this.name = obj.name;
        this.status = obj['status'] ? obj['status'] : 1;
        if (obj['updatedDateTime']) {
            this.updatedDateTime = obj['updatedDateTime'];
        }
        this.description = obj['description'] ? obj['description'] : '';
        if (obj && obj['reportUrl']) {
            obj.reportUrl.forEach(element => {
                this.reportUrl.push(new Report(element));
            });
        }

        if (obj && obj['summarReportUrl']) {
            obj.summarReportUrl.forEach(element => {
                this.summarReportUrl.push(new TabSummary(element));
            });

        }

    }
}

export class FilterValue {
    public name: String;
    public displayName: String;
    public id: Number;
    public value: Boolean;

    constructor(obj) {
        this.name = obj.name;
        this.id = obj.id;
        this.displayName = obj.displayName;
        this.value = obj['value'] ? obj['value'] : false;
    }
}

export class Filter {
    public name: String;
    public id: Number;
    public isMultiSelect: Boolean;
    public values: Array<FilterValue> = [];
    public isListenOnBlur: Boolean;
    public modifiedFilters: Array<FilterValue> = [];
    public editFilters: Array<FilterValue> = [];

    constructor(obj) {
        this.name = obj.name;
        this.id = obj.id;
        this.isMultiSelect = obj['isMultiSelect'] ? obj['isMultiSelect'] : false;
        // this.values = obj.values;
        this.isListenOnBlur = obj['isListenOnBlur'] ? obj['isListenOnBlur'] : false;
        this.modifiedFilters = obj['modifiedFilters'] ? obj['modifiedFilters'] : [];

        if (obj.values && obj.values != '') {
            obj.values.forEach(value => {
                this.values.push(new FilterValue(value));
                this.editFilters.push(new FilterValue(value)); // Ramji made changes on 04-06-2019 for deep copy
            });
        } else {
            obj.values = [];
        }

    }
}

