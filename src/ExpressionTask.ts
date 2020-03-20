import { FlowTask, FlowTaskPackageType } from '@devhelpr/flowrunner';
import * as jexl from 'jexl';
import * as Promise from 'promise';

export class ExpressionTask extends FlowTask {
  public execute(node: any, services: any) {
    return new Promise((resolve, reject) => {
      if (node.expression !== 'undefined' && node.expression !== '') {
        // force properties to number
        let payload: any = {};
        if (node.forceNumeric === true) {
          for (var property in node.payload) {
            if (node.payload.hasOwnProperty(property)) {
              payload[property] = parseFloat(node.payload[property]) || 0;
            }
          }
        } else {
          payload = node.payload;
        }

        jexl
          .eval(node.expression, payload)
          .then((result: any) => {
            if (result === 'undefined') {
              reject();
            } else {
              let resultToPayload = result;
              if (node.rounding && node.rounding == 'floor') {
                resultToPayload = Math.floor(resultToPayload);
              }

              if (node.assignAsPropertyFromObject !== undefined && node.assignAsPropertyFromObject !== '') {
                node.payload[node.assignAsPropertyFromObject][node.assignToProperty] = resultToPayload;
              } else {
                node.payload[node.assignToProperty] = resultToPayload;
              }

              resolve(node.payload);
            }
          })
          .catch((err: any) => {
            console.log('ExpressionTask - error', err);

            reject();
          });
      } else {
        reject();
      }
    });
  }

  public getDescription() {
    return 'Node that executes an expression';
  }

  public getName() {
    return 'ExpressionTask';
  }

  public getFullName() {
    return 'Expression';
  }

  public getIcon() {
    return 'expression';
  }

  public getShape() {
    return 'rect';
  }

  public getDefaultColor() {
    return '#00ff80ff';
  }

  public getTaskType() {
    return 'both';
  }

  public getPackageType() {
    return FlowTaskPackageType.DEFAULT_NODE;
  }

  public getCategory() {
    return 'FlowCanvas';
  }

  public getController() {
    return 'FlowCanvasController';
  }

  public getConfigMetaData() {
    return [
      { name: 'assignToProperty', defaultValue: '', valueType: 'string', required: true },
      { name: 'assignAsPropertyFromObject', defaultValue: '', valueType: 'string', required: false },
      { name: 'expression', defaultValue: '', valueType: 'string', required: false },
      { name: 'forceNumeric', defaultValue: false, valueType: 'boolean', required: false },
    ];
  }
}
