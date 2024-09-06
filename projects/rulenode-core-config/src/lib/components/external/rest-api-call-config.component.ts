import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpRequestType } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-external-node-rest-api-call-config',
  templateUrl: './rest-api-call-config.component.html',
  styleUrls: []
})
export class RestApiCallConfigComponent extends RuleNodeConfigurationComponent {

  restApiCallConfigForm: UntypedFormGroup;

  proxySchemes: string[] = ['http', 'https'];

  httpRequestTypes = Object.keys(HttpRequestType);

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.restApiCallConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.restApiCallConfigForm = this.fb.group({
      restEndpointUrlPattern: [configuration ? configuration.restEndpointUrlPattern : null, [Validators.required]],
      requestMethod: [configuration ? configuration.requestMethod : null, [Validators.required]],
      closeConnectionAfterEachRequest: [configuration ? configuration.closeConnectionAfterEachRequest : false, []],
      useSimpleClientHttpFactory: [configuration ? configuration.useSimpleClientHttpFactory : false, []],
      parseToPlainText: [configuration ? configuration.parseToPlainText : false, []],
      ignoreRequestBody: [configuration ? configuration.ignoreRequestBody : false, []],
      enableProxy: [configuration ? configuration.enableProxy : false, []],
      useSystemProxyProperties: [configuration ? configuration.enableProxy : false, []],
      proxyScheme: [configuration ? configuration.proxyHost : null, []],
      proxyHost: [configuration ? configuration.proxyHost : null, []],
      proxyPort: [configuration ? configuration.proxyPort : null, []],
      proxyUser: [configuration ? configuration.proxyUser :null, []],
      proxyPassword: [configuration ? configuration.proxyPassword :null, []],
      readTimeoutMs: [configuration ? configuration.readTimeoutMs : null, []],
      maxParallelRequestsCount: [configuration ? configuration.maxParallelRequestsCount : null, [Validators.min(0)]],
      headers: [configuration ? configuration.headers : null, []],
      credentials: [configuration ? configuration.credentials : null, []],
      maxInMemoryBufferSizeInKb: [configuration ? configuration.maxInMemoryBufferSizeInKb : null, [Validators.min(1)]]
    });
  }

  protected validatorTriggers(): string[] {
    return ['useSimpleClientHttpFactory', 'enableProxy', 'useSystemProxyProperties'];
  }

  protected updateValidators(emitEvent: boolean) {
    const useSimpleClientHttpFactory: boolean = this.restApiCallConfigForm.get('useSimpleClientHttpFactory').value;
    const enableProxy: boolean = this.restApiCallConfigForm.get('enableProxy').value;
    const useSystemProxyProperties: boolean = this.restApiCallConfigForm.get('useSystemProxyProperties').value;

    if (enableProxy && !useSystemProxyProperties) {
      this.restApiCallConfigForm.get('proxyHost').setValidators(enableProxy ? [Validators.required] : []);
      this.restApiCallConfigForm.get('proxyPort').setValidators(enableProxy ?
        [Validators.required, Validators.min(1), Validators.max(65535)] : []);
    } else {
      this.restApiCallConfigForm.get('proxyHost').setValidators([]);
      this.restApiCallConfigForm.get('proxyPort').setValidators([]);

      if (useSimpleClientHttpFactory) {
        this.restApiCallConfigForm.get('readTimeoutMs').setValidators([]);
      } else {
        this.restApiCallConfigForm.get('readTimeoutMs').setValidators([Validators.min(0)]);
      }
    }

    this.restApiCallConfigForm.get('readTimeoutMs').updateValueAndValidity({emitEvent});
    this.restApiCallConfigForm.get('proxyHost').updateValueAndValidity({emitEvent});
    this.restApiCallConfigForm.get('proxyPort').updateValueAndValidity({emitEvent});
    this.restApiCallConfigForm.get('credentials').updateValueAndValidity({emitEvent});
  }
}
