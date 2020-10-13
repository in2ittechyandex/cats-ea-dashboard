import { NumberToDatePipe } from './number-to-date.pipe';

describe('NumberToDatePipe', () => {
  it('create an instance', () => {
    const pipe = new NumberToDatePipe();
    expect(pipe).toBeTruthy();
  });
});
