import {
  Injectable
} from '@angular/core';
import {
  Subject
} from 'rxjs';
import {
  I18NService
} from '@syndesis/ui/platform';
import {
  CodeMirror
} from '@syndesis/ui/vendor';

@Injectable()
export class MustacheMode {

  private _errors: any[] = [];

  private validationChangeSource = new Subject<any[]>();

  validationChanged$ = this.validationChangeSource.asObservable();

  constructor(private i18NService: I18NService) {}

  public name(): string {
    return 'mustache';
  }

  public define(): void {
    CodeMirror.defineMode(this.name(), function(config, parserConfig) {
      return {
        token: function(stream, state) {
          let ch;
          if (stream.match('{{')) {
            // tslint:disable-next-line
            while ((ch = stream.next()) != null) {
              if (ch == '}' && stream.next() == '}') {
                stream.eat('}');
                return 'mustache';
              }
            }
          }

          while (stream.next() != null && !stream.match('{{', false)) {
            // Read it but don't do anything
          }

          return null;
        }
      };
    });

    CodeMirror.registerHelper('lint', 'mustache', (text, options) => { return this.validator(text, options) });
  }

  private validator(text: string, options: any): any[] {
    this._errors = [];

    let line: number = 0;
    let startCol: number = 0;
    let endCol: number;

    let openSymbol: number = 0;
    let closeSymbol: number = 0;
    let reset: boolean = false;

    for (var i = 0; i < text.length; i++) {

      // Increase the column count
      endCol++;
      startCol = endCol - 1;

      if (reset) {
        // Successfully parsed a symbol so reset for next
        openSymbol = 0;
        closeSymbol = 0;
      }

      const ch = text.charAt(i);
      if (ch === '{') {
        if (closeSymbol > 0) {
          // Found an open symbol before all close symbols
          const msg = this.i18NService.localize('integrations.steps.templater-illegal-open-symbol', [line, endCol]);
          this._errors.push({
            message: msg,
            severity: 'error',
            from: CodeMirror.Pos(line, startCol),
            to: CodeMirror.Pos(line, endCol)
          });
          reset = true;
          continue;
        }

        if (openSymbol >= 2) {
          // Too many open symbols encountered
          const msg = this.i18NService.localize('integrations.steps.templater-too-many-open-symbols', [line, endCol]);
          this._errors.push({ message: msg, severity: 'error', from: CodeMirror.Pos(line, startCol), to: CodeMirror.Pos(line, endCol) });
          reset = true;
          continue;
        }

        openSymbol++;

      } else if (ch === '}') {
        if (openSymbol < 2) {
          // Found a close symbol before all the open symbols
          const msg = this.i18NService.localize('integrations.steps.templater-illegal-close-symbol', [line, endCol]);
          this._errors.push({ message: msg, severity: 'error', from: CodeMirror.Pos(line, startCol), to: CodeMirror.Pos(line, endCol) });
          reset = true;
          continue;
        }

        if (closeSymbol >= 2) {
          // Too many close symbols encountered
          const msg = this.i18NService.localize('integrations.steps.templater-too-many-close-symbols', [line, endCol]);
          this._errors.push({ message: msg, severity: 'error', from: CodeMirror.Pos(line, startCol), to: CodeMirror.Pos(line, endCol) });
          reset = true;
          continue;
        }

        closeSymbol++;
        continue;
      } else {

        //
        // Handle all other types of character
        //

        if (openSymbol === 1) {
          // Should have encountered another open symbol but not
          const msg = this.i18NService.localize('integrations.steps.templater-expected-open-symbol', [line, endCol]);
          this._errors.push({ message: msg, severity: 'error', from: CodeMirror.Pos(line, startCol), to: CodeMirror.Pos(line, endCol) });
          reset = true;
          continue;
        }

        if (closeSymbol === 1) {
          // Should have encountered another close symbol but not
          const msg = this.i18NService.localize('integrations.steps.templater-expected-close-symbol', [line, endCol]);
          this._errors.push({ message: msg, severity: 'error', from: CodeMirror.Pos(line, startCol), to: CodeMirror.Pos(line, endCol) });
          reset = true;
          continue;
        }

        if (ch === '\n') {
          // Encountered a carriage return so increment line and reset end column
          line++;
          endCol = 0;
        }
      }

      reset = openSymbol == 2 && closeSymbol == 2;
    }

    this.validationChangeSource.next(this._errors);
    return this._errors;
  }
}
