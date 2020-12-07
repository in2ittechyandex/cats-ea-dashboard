import { SyslogModule } from './syslog.module';

describe('SyslogModule', () => {
  let syslogModule: SyslogModule;

  beforeEach(() => {
    syslogModule = new SyslogModule();
  });

  it('should create an instance', () => {
    expect(syslogModule).toBeTruthy();
  });
});
