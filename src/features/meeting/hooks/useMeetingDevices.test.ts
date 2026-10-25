import { classifyDeviceError } from './useMeetingDevices';

describe('classifyDeviceError', () => {
  it('maps blocked permission to denied', () => {
    expect(classifyDeviceError({ name: 'NotAllowedError' })).toBe('denied');
    expect(classifyDeviceError({ name: 'PermissionDeniedError' })).toBe('denied');
    expect(classifyDeviceError({ name: 'SecurityError' })).toBe('denied');
  });

  it('maps a missing or unusable device to unavailable', () => {
    expect(classifyDeviceError({ name: 'NotFoundError' })).toBe('unavailable');
    expect(classifyDeviceError({ name: 'DevicesNotFoundError' })).toBe('unavailable');
    expect(classifyDeviceError({ name: 'OverconstrainedError' })).toBe('unavailable');
    expect(classifyDeviceError({ name: 'ConstraintNotSatisfiedError' })).toBe('unavailable');
  });

  it('falls back to unknown for anything unrecognised', () => {
    expect(classifyDeviceError({ name: 'AbortError' })).toBe('unknown');
    expect(classifyDeviceError(new Error('boom'))).toBe('unknown');
    expect(classifyDeviceError(null)).toBe('unknown');
    expect(classifyDeviceError(undefined)).toBe('unknown');
  });
});
