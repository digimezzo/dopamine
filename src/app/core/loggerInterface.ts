export interface LoggerInterface {
  info(message: string, callerClass: string, callerMethod: string);
  warn(message: string, callerClass: string, callerMethod: string);
  error(message: string, callerClass: string, callerMethod: string);
}
