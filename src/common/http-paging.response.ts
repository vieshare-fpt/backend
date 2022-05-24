import { StatusCode } from "@constant/status-code.enum";
import { PagingRepsone } from "@data/response/paging.response";
import { ApiProperty } from "@nestjs/swagger";
import { MessageResponse } from "./message-response";

export class HttpPagingResponse<T> {
    @ApiProperty()
    statusCode: StatusCode;

    @ApiProperty()
    message: string;

    metaData: PagingRepsone;

    data: T;

    static build<T>(): HttpPagingResponseBuilder<T> {
        return new HttpPagingResponseBuilder<T>();
    }

    static success<T>(data?: T, metaData?: PagingRepsone): HttpPagingResponse<T> {
        return this.build<T>()
            .withStatusCode(StatusCode.OK)
            .withMessage(MessageResponse[StatusCode.OK])
            .withMetaData(metaData)
            .withData(data)
            .build()

    }
}

export class HttpPagingResponseBuilder<T>  {

    private statusCode: StatusCode;
    private message: string;
    private metaData: PagingRepsone;
    private data: T;

    withStatusCode(statusCode: StatusCode): HttpPagingResponseBuilder<T> {
        this.statusCode = statusCode;
        return this;
    }

    withMessage(message: string): HttpPagingResponseBuilder<T> {
        this.message = message;
        return this;
    }

    withData(data: T): HttpPagingResponseBuilder<T> {
        this.data = data;
        return this;
    }


    withMetaData(metaData: PagingRepsone): HttpPagingResponseBuilder<T> {
        this.metaData = metaData;
        return this;
    }



    build(): HttpPagingResponse<T> {
        const httpPagingResponse = new HttpPagingResponse<T>();
        httpPagingResponse.statusCode = this.statusCode;
        httpPagingResponse.message = this.message;
        httpPagingResponse.metaData = this.metaData;
        httpPagingResponse.data = this.data;
        return httpPagingResponse;
    }
}