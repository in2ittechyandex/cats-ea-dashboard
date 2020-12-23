import { PatternModule } from './pattern.module';

describe('PatternModule', () => {
  let patternModule: PatternModule;

  beforeEach(() => {
    patternModule = new PatternModule();
  });

  it('should create an instance', () => {
    expect(patternModule).toBeTruthy();
  });
});
