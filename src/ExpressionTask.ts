import { FlowTask, FlowTaskPackageType } from '@devhelpr/flowrunner';
import * as jexl from 'Jexl';
import * as Promise from 'promise';

export class ExpressionTask extends FlowTask {
  public execute(node: any, services: any) {
    return new Promise((resolve, reject) => {
      if (node.expression !== 'undefined' && node.expression !== '') {
        jexl
          .eval(node.expression, node.payload)
          .then((result: any) => {
            if (result === 'undefined') {
              reject();
            } else {
              if (node.assignAsPropertyFromObject !== undefined && node.assignAsPropertyFromObject !== '') {
                node.payload[node.assignAsPropertyFromObject][node.assignToProperty] = result;
              } else {
                node.payload[node.assignToProperty] = result;
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
    ];
  }
}
