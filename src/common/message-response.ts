import { StatusCode } from '@constant/status-code.enum';

interface IMessageResponse {
  [key: string]: string;
}

export const MessageResponse: IMessageResponse = {
  [StatusCode.INVALID_LOGIN_CREDENTIALS]: 'Email or password invalid.',
  [StatusCode.INVALID_CREDENTIALS]: 'Token invalid or expired.',
  [StatusCode.OK]: 'Success.',
  [StatusCode.ROOM_EXISTED]: 'Meeting existed.',
  [StatusCode.ROOM_NOT_EXISTED]: 'Meeting not existed.',
  [StatusCode.UNEXPECTED]: 'Unexpected error occur.',
  [StatusCode.EMAIL_EXISTED]: 'Email existed.',
  [StatusCode.OLD_PASSWORD_INCORRECT]: 'Old password incorrect.',
  [StatusCode.NOT_HAVE_PERMISSION]: 'User not have permission.',
  [StatusCode.ROOM_REACH_LIMIT]: 'Meeting reach limit.',
  [StatusCode.USERNAME_TAKEN]: 'Username was taken.',
  [StatusCode.USERNAME_REQUIRED]: 'Username is required.',
  [StatusCode.INVITE_NOT_EXISTED]: 'Invite not existed.',
  [StatusCode.BAD_REQUEST]: 'Bad request.',
  [StatusCode.ROOM_CODE_INVALID]: 'Meeting code is invalid.',
  [StatusCode.USER_NOT_EXISTED]: 'User not existed.',
  [StatusCode.AUTHOR_NOT_EXISTED]: 'Author not existed.',
  [StatusCode.CONTACT_EXISTED]: 'Contact existed.',
  [StatusCode.CONTACT_NOT_EXISTED]: 'Contact not existed.',
  [StatusCode.INVALID_FROM_OR_TO]: 'Invalid From or To param. To must be later than From.',
  [StatusCode.POST_NOT_EXISTED]: 'The post does not exist.',
  [StatusCode.USER_NOT_AUTHOR_POST]: 'The user is not the author of the post or has insufficient permissions.',
  [StatusCode.PACKAGE_NOT_EXISTING]: 'The package is not existed.',
  [StatusCode.ONLY_USER_CAN_FOLLOW]: 'Only users can follow.',
  [StatusCode.ONLY_CAN_FOLLOW_WRITER]: 'Can only follow the writer.',
  [StatusCode.FOLLOW_EXISTED]: 'Followed before.',
  [StatusCode.FOLLOW_NOT_EXISTED]: 'Follow not exsited.',
  [StatusCode.WALLET_ALREADY_EXISTED]: 'The user already have a wallet, each user can only own one wallet.',
  [StatusCode.WALLET_NOT_EXISTED]: 'The not existed.',
  [StatusCode.USER_ALREADY_PREMIUM]: "User is already a premium user, can't subscribe to the packages now.",
  [StatusCode.USER_NOT_PREMIUM_CAN_NOT_VOTE_POST]: 'This is a premium post, only premium users can vote for this post, become premium user to vote.',
  [StatusCode.OUT_OF_RANGE_VOTE]: 'Voting only between 0 and 5.',
  [StatusCode.POST_NOT_PREMIUM]: 'Post is note premium post.',
  [StatusCode.BONUS_NOT_EXISTED]: 'Bonus not existed.',
  [StatusCode.BONUS_HAS_WITHDRAWN_BEFORE]: 'Bonus has been withdrawn before.',
  [StatusCode.NOW_CAN_NOT_WITHDRAW_BONUS]: "Now can't withdraw bonus.",
  [StatusCode.COVER_LETTER_NOT_EXISTED]: "Cover letter not existed.",
  [StatusCode.PREVIOUS_COVER_LETTER_NOT_PROCESSED]: 'The previous cover letter has not been processed.',
  [StatusCode.DATE_INVALID]: 'Date Invalid.'
};
