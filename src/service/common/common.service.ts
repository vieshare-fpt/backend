import { HttpChartResponse } from "@common/http-chart.response";
import { HttpPagingResponse } from "@common/http-paging.response";
import { HttpResponse } from "@common/http.response";
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

  public getChartResponse(dataResponse: T[] | any, labels: Array<string>): HttpResponse<T[]> | HttpPagingResponse<T[]> {


    return HttpChartResponse.success(dataResponse, labels);


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
    dateStart = new Date(dateStart.setDate(dateStart.getDate() + 1));
    let dateEnd = new Date(end);
    dateEnd = new Date(dateEnd.setDate(dateEnd.getDate() + 1));
    for (var arr = [], date = dateStart; date <= dateEnd; date.setDate(date.getDate() + 1)) {
      arr.push(new Date(date).toISOString().slice(0, 10));
    }
    return arr;
  }
}

