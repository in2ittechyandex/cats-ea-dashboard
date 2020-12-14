import { TacacsModule } from './tacacs.module';

describe('TacacsModule', () => {
  let tacacsModule: TacacsModule;

  beforeEach(() => {
    tacacsModule = new TacacsModule();
  });

  it('should create an instance', () => {
    expect(tacacsModule).toBeTruthy();
  });
});
