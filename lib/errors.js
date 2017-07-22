class ErrorMercadoTest extends Error {
  constructor (message, type, status) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.msg = message;
    this.type = type;
    this.status = status || 500;
  }
};

const TypeErrorMercadoTest = {
    BAD_REQUEST: 'bad_request',
    NOT_FOUND: 'not_found'
}
module.exports.ErrorMercadoTest = ErrorMercadoTest;
module.exports.TypeErrorMercadoTest = TypeErrorMercadoTest;

// ----------------- COMMON --------------
class Error400 extends ErrorMercadoTest {
  constructor (message, type) {
    super(message || 'There was an unexpected problem', type || TypeErrorMercadoTest.BAD_REQUEST, 400);
  }
};
class Error404 extends ErrorMercadoTest {
  constructor (message, type) {
    super(message, type || TypeErrorMercadoTest.NOT_FOUND, 404);
  }
};

// ---------- IMPLEMENTATION ---------------
module.exports.Items = class Items {
    static badRequest() {
        return new Error400();
    }
    static notFound(message) {
        return new Error404(message);
    }
};

module.exports.Currencies = class Currencies {
    static badRequest() {
        return new Error400();
    }
    static notFound(message) {
        return new Error404(message);
    }
};

module.exports.Sites = class Sites {
    static badRequest() {
        return new Error400();
    }
    static notFound(message) {
        return new Error404(message);
    }
};