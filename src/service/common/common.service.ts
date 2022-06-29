import { HttpPagingResponse } from "@common/http-paging.response";
import { HttpResponse } from "@common/http.response";
import { PagingRepsone } from "@data/response/paging.response";

export class CommonService<T> {
  public getPagingResponse(postResponse: T[] | any, perPage: number, page: number, total: number): HttpResponse<T[]> | HttpPagingResponse<T[]> {
    let totalPages = Math.ceil(total / perPage);

    if (!perPage) {
      const metaData = new PagingRepsone(page, total, total, 1);
      return HttpPagingResponse.success(postResponse, metaData);
    }
    const metaData = new PagingRepsone(page, perPage, total, totalPages);
    return HttpPagingResponse.success(postResponse, metaData);

  }
  async removeUndefined(obj: any) {
    return Object.keys(obj).reduce((acc, key) => {
      const _acc = acc;
      if (obj[key] !== undefined) _acc[key] = obj[key];
      return _acc;
    }, {})
  }
}

