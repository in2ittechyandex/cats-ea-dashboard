import { AlarmsModule } from './alarms.module';

describe('AlarmsModule', () => {
  let alarmsModule: AlarmsModule;

  beforeEach(() => {
    alarmsModule = new AlarmsModule();
  });

  it('should create an instance', () => {
    expect(alarmsModule).toBeTruthy();
  });
});
