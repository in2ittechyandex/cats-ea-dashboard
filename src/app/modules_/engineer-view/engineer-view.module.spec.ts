import { EngineerViewModule } from './engineer-view.module';

describe('EngineerViewModule', () => {
  let engineerViewModule: EngineerViewModule;

  beforeEach(() => {
    engineerViewModule = new EngineerViewModule();
  });

  it('should create an instance', () => {
    expect(engineerViewModule).toBeTruthy();
  });
});
