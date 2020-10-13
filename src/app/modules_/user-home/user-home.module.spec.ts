import { UserHomeModule } from './user-home.module';

describe('UserHomeModule', () => {
  let userHomeModule: UserHomeModule;

  beforeEach(() => {
    userHomeModule = new UserHomeModule();
  });

  it('should create an instance', () => {
    expect(userHomeModule).toBeTruthy();
  });
});
