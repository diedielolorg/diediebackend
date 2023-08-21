// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   Logger,
//   Inject,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   constructor(private logger: Logger) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const { method, url, body } = context.getArgByIndex(0);
//     this.logger.log(`Request to ${method} ${url}`);

//     return next
//       .handle()
//       .pipe(
//         tap((data) =>
//           this.logger.log(
//             `Response from ${method} ${url} \n response: ${JSON.stringify(
//               data,
//             )}`,
//           ),
//         ),
//       );
//   }
// }

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
