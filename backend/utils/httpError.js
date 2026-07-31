export class HttpError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    if (data) this.data = data;
  }
}

// The "message" values below are user-facing (shown in the front), so they're in Spanish.
// Raw technical details (Mongoose/Node error text) are never sent to the client,
// they only go to the server log via console.error in errorHandler.
function describeError(err) {
  if (err instanceof HttpError) {
    return { status: err.status, message: err.message, data: err.data };
  }

  if (err.name === 'CastError') {
    return { status: 400, message: 'Identificador inválido' };
  }

  if (err.name === 'ValidationError') {
    return { status: 400, message: 'Error de validación' };
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] || 'valor';
    return { status: 409, message: `Ya existe un registro con ese ${field}` };
  }

  if (err.type === 'entity.parse.failed') {
    return { status: 400, message: 'JSON inválido en el cuerpo de la petición' };
  }

  return { status: 500, message: 'Error interno del servidor' };
}

export function sendError(res, err) {
  const { status, message, data } = describeError(err);
  const body = { error_code: status, message };
  if (data) Object.assign(body, data);
  return res.status(status).json(body);
}
