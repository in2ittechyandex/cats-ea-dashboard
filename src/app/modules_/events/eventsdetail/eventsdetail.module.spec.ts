import { EventsdetailModule } from './eventsdetail.module';

describe('EventsdetailModule', () => {
  let eventsdetailModule: EventsdetailModule;

  beforeEach(() => {
    eventsdetailModule = new EventsdetailModule();
  });

  it('should create an instance', () => {
    expect(eventsdetailModule).toBeTruthy();
  });
});
