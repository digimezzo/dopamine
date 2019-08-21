"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var electron_log_1 = require("electron-log");
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.info = function (message, callerClass, callerMethod) {
        electron_log_1.default.info(this.formattedMessage(message, callerClass, callerMethod));
    };
    Logger.prototype.warn = function (message, callerClass, callerMethod) {
        electron_log_1.default.warn(this.formattedMessage(message, callerClass, callerMethod));
    };
    Logger.prototype.error = function (message, callerClass, callerMethod) {
        electron_log_1.default.error(this.formattedMessage(message, callerClass, callerMethod));
    };
    Logger.prototype.formattedMessage = function (message, callerClass, callerMethod) {
        return "[" + callerClass + "] [" + callerMethod + "] " + message;
    };
    Logger = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], Logger);
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map