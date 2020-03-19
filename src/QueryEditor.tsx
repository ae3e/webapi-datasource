import React, { PureComponent, ChangeEvent } from 'react';

import { DataSource } from './DataSource';
import { MyQuery, MyDataSourceOptions } from './types';

import { FormField, FormLabel, Select } from '@grafana/ui';

import { QueryEditorProps } from '@grafana/data';

import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';
import 'brace/theme/tomorrow_night';
import 'brace/theme/github';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

interface State {}

export class QueryEditor extends PureComponent<Props, State> {
  onUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('Url change!');
    const { onChange, query } = this.props;
    const request = {
      ...query.request,
      url: event.target.value,
    };
    onChange({ ...query, request });
  };

  onMethodChange = (value: any) => {
    console.log('Method change!');
    const { onChange, query } = this.props;
    const request = {
      ...query.request,
      method: value.value,
    };
    onChange({ ...query, request });
  }; 

  onBodyChange = (evt: any, editor? : any) => {
    console.log('Query change!');
    const { onChange, query } = this.props;
    const request = {
      ...query.request,
      query: JSON.parse(editor.getValue()),
    };
    onChange({ ...query, request });
  };

  onScriptChange = (evt: any, editor? : any) => {
    console.log('Script change!');
    const { onChange, query } = this.props;
    const request = {
      ...query.request,
      script: editor.getValue(),
    };
    onChange({ ...query, request });
  };

  render() {

    const { query } = this.props;
    let { request } = query;
    if (!request) {
      request = {
        query: '{ }',
        url: '',
        method:'',
        script:''
      };
    }

    return (
      <div className="gf-form-group">
        <div className="gf-form"  style={{ display: 'block', width: '100%' }}>
          <FormField label="Url" labelWidth={12} inputWidth={30} onChange={this.onUrlChange} value={request.url} placeholder="http://" />
        </div>
        <div className="gf-form">
          <FormLabel className="width-12" tooltip="Choose an HTTP method.">
            Method
          </FormLabel>
          <Select
            value={request.method?{label:request.method,value:request.method}:{label:'GET',value:'GET'}}
            placeholder="Choose..."
            options={[{ label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
          ]}
            width={6}
            allowCustomValue={true}
            onChange={this.onMethodChange}
          />
        </div>
        {request.method==='POST' && <div className="gf-form" style={{ display: 'block', width: '100%' }}>
          <FormLabel className="width-12" tooltip="Set JSON body">
            Body
          </FormLabel>
          <AceEditor
            mode="javascript"
            theme="tomorrow_night"
            name="dashboard_script"
            height="300px"
            width="100%"
            value={JSON.stringify(request.query, null, 2)}
            onBlur={this.onBodyChange}
          />
        </div>}
        <div className="gf-form" style={{ display: 'block', width: '100%' }}>
          <FormLabel className="width-12" tooltip="Set script to return formatted data as described in Grafana's documentation">
            Script
          </FormLabel>
          <AceEditor
            mode="javascript"
            theme="tomorrow_night"
            name="dashboard_script"
            height="300px"
            width="100%"
            value={request.script}
            onBlur={this.onScriptChange}
          />
        </div>
      </div>
    );
  }
}
