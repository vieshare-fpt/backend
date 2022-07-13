import { ChartName } from "@constant/chart-name.enum";
import { StatusCode } from "@constant/status-code.enum";
import { ApiProperty } from "@nestjs/swagger";
import { HttpResponse } from "./http.response";
import { MessageResponse } from "./message-response";

export class HttpChartResponse<T> {
  @ApiProperty()
  statusCode: StatusCode;

  @ApiProperty()
  message: string;

  chartName: ChartName;

  labels: Array<any>;

  data: T;

  static build<T>(): HttpChartResponseBuilder<T> {
    return new HttpChartResponseBuilder<T>();
  }

  static success<T>(data?: T, labels?: Array<any>, chartName?: ChartName): HttpChartResponse<T> {
    return this.build<T>()
      .withStatusCode(StatusCode.OK)
      .withMessage(MessageResponse[StatusCode.OK])
      .withChartName(chartName)
      .withLabels(labels)
      .withData(data)
      .build()

  }
}

export class HttpChartResponseBuilder<T>  {

  private statusCode: StatusCode;
  private message: string;
  private chartName: ChartName;
  private labels: Array<any>;
  private data: T;

  withStatusCode(statusCode: StatusCode): HttpChartResponseBuilder<T> {
    this.statusCode = statusCode;
    return this;
  }

  withMessage(message: string): HttpChartResponseBuilder<T> {
    this.message = message;
    return this;
  }

  withChartName(chartName: ChartName): HttpChartResponseBuilder<T> {
    this.chartName = chartName;
    return this;
  }


  withData(data: T): HttpChartResponseBuilder<T> {
    this.data = data;
    return this;
  }


  withLabels(labels: Array<any>): HttpChartResponseBuilder<T> {
    this.labels = labels;
    return this;
  }



  build(): HttpChartResponse<T> {
    const httpPagingResponse = new HttpChartResponse<T>();
    httpPagingResponse.statusCode = this.statusCode;
    httpPagingResponse.message = this.message;
    httpPagingResponse.chartName = this.chartName;
    httpPagingResponse.labels = this.labels;
    httpPagingResponse.data = this.data;
    return httpPagingResponse;
  }
}
