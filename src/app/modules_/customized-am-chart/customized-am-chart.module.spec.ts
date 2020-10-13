import { CustomizedAmChartModule } from './customized-am-chart.module';

describe('CustomizedAmChartModule', () => {
  let customizedAmChartModule: CustomizedAmChartModule;

  beforeEach(() => {
    customizedAmChartModule = new CustomizedAmChartModule();
  });

  it('should create an instance', () => {
    expect(customizedAmChartModule).toBeTruthy();
  });
});
