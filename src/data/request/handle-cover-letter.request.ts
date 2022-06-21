import { StatusCoverLetter } from '@constant/status-cover-letter.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class HandleCoverLetterRequest {
  @ApiProperty()
  coverLetterId: string;

  @ApiProperty({ format: "enum", enum: StatusCoverLetter })
  @IsNotEmpty()
  @IsEnum(StatusCoverLetter)
  status: StatusCoverLetter;
}
