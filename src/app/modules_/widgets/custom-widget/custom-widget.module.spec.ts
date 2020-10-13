import { CustomWidgetModule } from './custom-widget.module';

describe('CustomWidgetModule', () => {
  let customWidgetModule: CustomWidgetModule;

  beforeEach(() => {
    customWidgetModule = new CustomWidgetModule();
  });

  it('should create an instance', () => {
    expect(customWidgetModule).toBeTruthy();
  });
});
