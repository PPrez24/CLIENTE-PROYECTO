import { TestBed } from '@angular/core/testing';
import { ActivitiesService } from './activities';

describe('ActivitiesService', () => {
  let service: ActivitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivitiesService);
    // Limpiar localStorage antes de cada prueba para evitar contaminación
    localStorage.removeItem('agenda_activities_v1');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new activity', () => {
    const newActivity = service.create({
      title: 'Test Activity',
      type: 'Académico',
      date: '2025-01-01',
      status: 'pendiente'
    });
    expect(newActivity.id).toBeDefined();
    expect(newActivity.title).toBe('Test Activity');
    expect(service.list().length).toBeGreaterThan(0);
  });

  it('should remove an activity', () => {
    const activity = service.create({
      title: 'To Delete',
      type: 'Deportivo',
      date: '2025-01-01',
      status: 'pendiente'
    });
    const id = activity.id;
    const result = service.remove(id);
    expect(result).toBeTrue();
    expect(service.getById(id)).toBeUndefined();
  });
});
