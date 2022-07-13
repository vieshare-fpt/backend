import { HttpChartResponse } from "@common/http-chart.response";
import { HttpPagingResponse } from "@common/http-paging.response";
import { HttpResponse } from "@common/http.response";
import { ChartName } from "@constant/chart-name.enum";
import { TimeFrame } from "@constant/time-frame.enum";
import { PagingRepsone } from "@data/response/paging.response";

export class CommonService<T> {
  public getPagingResponse(dataResponse: T[] | any, perPage: number, page: number, total: number): HttpResponse<T[]> | HttpPagingResponse<T[]> {
    let totalPages = Math.ceil(total / perPage);

    if (!perPage) {
      const metaData = new PagingRepsone(page, total, total, 1);
      return HttpPagingResponse.success(dataResponse, metaData);
    }
    const metaData = new PagingRepsone(page, perPage, total, totalPages);
    return HttpPagingResponse.success(dataResponse, metaData);

  }

  public getChartResponse(dataResponse: T[] | any, labels: Array<string>, chartName: ChartName): HttpResponse<T[]> | HttpPagingResponse<T[]> {


    return HttpChartResponse.success(dataResponse, labels, chartName);


  }
  async removeUndefined(obj: any) {
    return Object.keys(obj).reduce((acc, key) => {
      const _acc = acc;
      if (obj[key] !== undefined) _acc[key] = obj[key];
      return _acc;
    }, {})
  }

  getDaysArray(start: Date, end: Date) {
    for (var arr = [], date = new Date(start); date <= new Date(end); date.setDate(date.getDate() + 1)) {
      arr.push(new Date(date));
    }
    return arr;
  }

  getDaysArrayFormat(start: string, end: string, timeFrame: TimeFrame) {
    let dateStart = new Date(start);
    let dateEnd = new Date(end);
    if (timeFrame == TimeFrame.OneDay) {
      dateStart = new Date(dateStart.setDate(dateStart.getDate() + 1));
      dateEnd = new Date(dateEnd.setDate(dateEnd.getDate() + 1));
      for (var arr = [], date = dateStart; date <= dateEnd; date.setDate(date.getDate() + 1)) {
        arr.push(new Date(date).toISOString().slice(0, 10));
      }
    } else if (timeFrame == TimeFrame.OneMonth) {
      dateStart = new Date(dateStart.setMonth(dateStart.getMonth() + 1));
      dateEnd = new Date(dateEnd.setMonth(dateEnd.getMonth() + 1));
      for (var arr = [], date = dateStart; date <= dateEnd; date.setMonth(date.getMonth() + 1)) {
        arr.push(new Date(date).toISOString().slice(0, 7));
      }
    } else if (timeFrame == TimeFrame.OneYear) {
      dateStart = new Date(dateStart.setFullYear(dateStart.getFullYear() + 1));
      dateEnd = new Date(dateEnd.setFullYear(dateEnd.getFullYear() + 1));
      for (var arr = [], date = dateStart; date <= dateEnd; date.setFullYear(date.getFullYear() + 1)) {
        arr.push(new Date(date).toISOString().slice(0, 4));
      }
    }
    return arr;
  }
}

