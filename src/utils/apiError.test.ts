import { GENERIC_ERROR_KEY, getApiErrorMessage } from './apiError';

describe('getApiErrorMessage', () => {
  it('should read a field error object off a 422 rejection', () => {
    const error = {
      status: 422,
      data: { status: 422, errors: { company: 'company should not be empty' } },
    };

    expect(getApiErrorMessage(error)).toBe('company should not be empty');
  });

  it('should join multiple field errors one per line', () => {
    const error = {
      status: 422,
      data: {
        errors: {
          company: 'company should not be empty',
          position: 'position should not be empty',
        },
      },
    };

    expect(getApiErrorMessage(error)).toBe(
      'company should not be empty\nposition should not be empty',
    );
  });

  it('should expand an array of field errors', () => {
    const error = {
      status: 422,
      data: {
        errors: [
          { field: 'company', message: 'company should not be empty' },
          { field: 'position', message: 'position should not be empty' },
        ],
      },
    };

    expect(getApiErrorMessage(error)).toBe(
      'company should not be empty\nposition should not be empty',
    );
  });

  it('should expand the nested fieldErrors shape', () => {
    const error = {
      status: 422,
      data: {
        errors: [
          { field: 'name', fieldErrors: ['too short', 'must be lowercase'] },
        ],
      },
    };

    expect(getApiErrorMessage(error)).toBe('too short\nmust be lowercase');
  });

  it('should expand a per-field array inside the object shape', () => {
    const error = {
      status: 422,
      data: { errors: { name: ['too short', 'must be lowercase'] } },
    };

    expect(getApiErrorMessage(error)).toBe('too short\nmust be lowercase');
  });

  it('should deduplicate repeated messages', () => {
    const error = {
      status: 422,
      data: { errors: { company: 'is required', position: 'is required' } },
    };

    expect(getApiErrorMessage(error)).toBe('is required');
  });

  it('should prefer field errors over a top level message', () => {
    const error = {
      status: 422,
      data: {
        message: 'validation failed',
        errors: { company: 'company should not be empty' },
      },
    };

    expect(getApiErrorMessage(error)).toBe('company should not be empty');
  });

  it('should fall back to the top level message', () => {
    const error = { status: 400, data: { message: 'Booking already closed' } };

    expect(getApiErrorMessage(error)).toBe('Booking already closed');
  });

  it('should read a plain error message', () => {
    expect(getApiErrorMessage(new Error('Network request failed')))
      .toBe('Network request failed');
  });

  it('should treat the api.ts sentinel as no detail', () => {
    const error = new Error(GENERIC_ERROR_KEY) as Error & { status?: number };
    error.status = 500;

    expect(getApiErrorMessage(error)).toBeNull();
  });

  it('should skip non-string error values instead of stringifying them', () => {
    const error = {
      status: 422,
      data: { errors: { meta: { code: 'E_001' }, company: 'company should not be empty' } },
    };

    expect(getApiErrorMessage(error)).toBe('company should not be empty');
  });

  it('should return null for unrecognised shapes', () => {
    expect(getApiErrorMessage(undefined)).toBeNull();
    expect(getApiErrorMessage(null)).toBeNull();
    expect(getApiErrorMessage('boom')).toBeNull();
    expect(getApiErrorMessage({})).toBeNull();
    expect(getApiErrorMessage({ status: 422, data: { status: 422 } })).toBeNull();
    expect(getApiErrorMessage({ status: 422, data: { errors: {} } })).toBeNull();
    expect(getApiErrorMessage({ status: 422, data: { message: '   ' } })).toBeNull();
  });
});
