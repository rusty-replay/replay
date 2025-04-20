export const ERROR_CODE = {
  FORBIDDEN_ACCESS: '접근 권한이 없습니다',
  UNAUTHORIZED_ACCESS: '접근 권한이 없습니다',
  NOT_FOUND_ANALYSIS_VERSION: '존재하지 않는 분석 버전입니다',
  INVALID_HVAC_TYPE: '유효하지 않은 HVAC 유형입니다',
  INVALID_PARAMETER: '유효하지 않은 파라미터입니다',
  INVALID_SOURCE_TYPE: '유효하지 않은 열원 유형입니다',
  // 대안에 연결된 분석 결과가 없습니다
  NOT_FOUND_ANALYSIS_RESULT: '대안에 연결된 분석 결과가 없습니다',
  NOT_MATCH_BUILDING_INFO:
    '대안의 건물 정보 ID와 요청의 건물 정보 ID가 일치하지 않습니다',
  ANALYSIS_RESULT_NOT_FOUND: '대안에 연결된 분석 결과가 없습니다',
  NOT_FOUND_BUILDING_INFO: '존재하지 않는 건물 정보입니다',
  NOT_FOUND_ALTERNATIVE: '해당하는 대안을 찾을 수 없습니다',
  CANNOT_LEAVE_OWNER: '워크스페이스 소유자는 나갈 수 없습니다',
  CANNOT_DELETE_SELF: '자신을 삭제할 수 없습니다',
  CANNOT_DELETE_OWNER: '워크스페이스 소유자는 삭제할 수 없습니다',
  UNAUTHORIZED_DELETE_MEMBER: '삭제할 수 없는 멤버입니다',
  NOT_FOUND_UNIT_AREA: '존재하지 않는 세대 정보입니다',
  NOT_FOUND_BUILDING_BLOCK: '존재하지 않는 동 정보입니다',
  CANNOT_CHANGE_OWNER_ROLE: '소유자 역할을 변경할 수 없습니다',
  CANNOT_CHANGE_TO_OWNER: '소유자로 변경할 수 없습니다',
  INVALID_INVITATION_EMAIL: '유효하지 않은 이메일입니다',
  CANNOT_UPDATE_OWN_ROLE: '자신의 역할을 변경할 수 없습니다',
  LAST_ADMIN_ROLE_CHANGE: '마지막 관리자 역할 변경입니다',
  UNAUTHORIZED_UPDATE_ROLE: '권한이 없는 역할 변경입니다',
  INVITATION_ALREADY_PROCESSED: '이미 처리된 초대입니다',
  INVITATION_NOT_FOUND: '존재하지 않는 초대입니다',
  INVITATION_EXPIRED: '만료된 초대입니다',
  INVITATION_ALREADY_EXISTS: '이미 존재하는 초대입니다',
  UNAUTHORIZED_ACCESS_WORKSPACE: '워크스페이스에 대한 권한이 없습니다',
  INVALID_PROJECT_TYPE: '유효하지 않은 프로젝트 타입입니다',
  //    "건축정보를 찾을 수 없습니다."
  BUILDING_INFO_NOT_FOUND: '건축정보를 찾을 수 없습니다',

  NOT_FOUND_PROJECT: '존재하지 않는 프로젝트입니다',

  NOT_WORKSPACE_MEMBER: '워크스페이스 멤버가 아닙니다',

  // project
  DUPLICATE_PROJECT_NAME: '이미 존재하는 프로젝트 이름입니다',

  // workspace
  WORKSPACE_NOT_FOUND: '존재하지 않는 워크스페이스입니다',
  WORKSPACE_MEMBER_NOT_FOUND: '존재하지 않는 워크스페이스 멤버입니다',
  UNAUTHORIZED_INVITE_MEMBER: '워크스페이스 관리자만 초대할 수 있습니다',

  // member
  MEMBER_NOT_FOUND: '존재하지 않는 멤버입니다',

  //
  MEMBER_ALREADY_EXISTS_IN_WORKSPACE: '이미 초대한 멤버입니다',

  DIFFERENT_SOCIAL_ACCOUNT: '다른 소셜 계정으로 가입된 이메일입니다',
  EMAIL_REGISTERED_WITH_SOCIAL: '이미 소셜 계정으로 가입된 이메일입니다',
  EMAIL_REGISTERED_WITH_PASSWORD: '이미 이메일로 가입된 계정입니다',
  EMAIL_ALREADY_REGISTERED_WITH_DIFFERENT_PROVIDER:
    '이미 다른 소셜 계정으로 가입된 이메일입니다',
  MEMBER_NOT_WITHDRAWN:
    '이미 활성화된 회원입니다. 계정 복구가 필요하지 않습니다',
  FREE_EVENT_LIMIT_EXCEEDED: '무료 이벤트 생성 제한을 초과했습니다',
  SUBSCRIPTION_EXPIRED: '구독이 만료되었습니다',
  WEBHOOK_PROCESSING_FAILED: '웹훅 처리 중 오류가 발생했습니다',
  INVALID_PAST_DATE: '시작날짜보다 과거날짜가 입력되었습니다',
  EVENT_LIMIT_EXCEEDED: '이벤트 생성 제한을 초과했습니다',
  SUBSCRIPTION_NOT_FOUND: '구독 정보를 찾을 수 없습니다',
  NEED_WEBHOOK_SECRET: '웹훅 시크릿이 필요합니다',
  INVALID_WEBHOOK_SECRET: '올바르지 않은 웹훅 시크릿입니다',
  INVALID_WEBHOOK_PAYLOAD: '올바르지 않은 웹훅 페이로드입니다',
  UNVERIFIED_EMAIL:
    '이메일 인증이 완료되지 않은 계정입니다. 먼저 이메일 인증을 완료해주세요',
  INVALID_ACCESS: '유효하지 않은 접근입니다',
  NOT_EMAIL_USER: '이메일로 가입한 사용자인지 다시 한 번 확인해주세요',
  NOT_FOUND_INVITE_CODE: '존재하지 않는 초대 코드입니다',
  ALREADY_GROUP_MEMBER: '이미 그룹 멤버입니다',
  NAME_TOO_LONG: '닉네임은 30자 이하여야 합니다',
  NAME_CANNOT_BE_EMPTY: 'Nickname cannot be empt',
  NOTIFICATION_GROUP_MISMATCH: '알림과 그룹이 일치하지 않습니다',
  NOT_NOTIFICATION_RECIPIENT: '해당 알림의 수신자가 아닙니다',
  NOTIFICATION_NOT_FOUND: '존재하지 않는 알림입니다',
  EVENT_NOT_IN_GROUP: '해당 이벤트는 그룹에 속해있지 않습니다',
  // 해당 멤버는 관리자가 아닙니다.
  MEMBER_NOT_ADMIN: '해당 멤버는 관리자가 아닙니다',

  // 그룹에는 최소 한 명의 관리자가 필요합니다.
  GROUP_NEED_ADMIN: '그룹에는 최소 한 명의 관리자가 필요합니다',

  // 관리자 자신의 권한을 제거할 수 없음
  ADMIN_CANNOT_REMOVE_OWN_ROLE: '관리자는 자신의 권한을 제거할 수 없습니다',
  NO_PERMISSION: '해당 리소스에 대한 권한이 없습니다',
  ADMIN_CANNOT_BE_KICKED: '관리자는 강퇴할 수 없습니다',
  ONLY_ADMIN_CAN_KICK_MEMBER: '관리자만 멤버를 강퇴할 수 있습니다',
  GROUP_DELETED: '삭제된 그룹입니다',
  LAST_MEMBER_CANNOT_LEAVE: '그룹의 마지막 멤버는 나갈 수 없습니다',
  ONLY_ADMIN_CAN_DELETE_GROUP: '그룹을 삭제할 권한이 없습니다',
  TARGET_MEMBER_NOT_FOUND: '해당 멤버를 찾을 수 없습니다',
  ONLY_ADMIN_CAN_GRANT_ROLE: '관리자만 권한을 부여할 수 있습니다',
  ADMIN_NOT_FOUND: '존재하지 않는 관리자입니다',

  CATEGORY_GROUP_MISMATCH: '카테고리와 그룹이 일치하지 않습니다',
  CATEGORY_NOT_FOUND: '존재하지 않는 카테고리입니다',

  // 400
  EXPIRED_CODE: '인증 코드가 만료됐습니다',
  ALREADY_USED_CODE: '인증 코드가 이미 사용되었습니다',
  INVALID_CODE: '유효하지 않은 인증 코드입니다',
  INVALID_DATE_FORMAT: '올바르지 않은 날짜 형식입니다',
  POKE_LIMIT_EXCEEDED: '하루에 최대 세 번만 찌를 수 있습니다.',
  POKE_ALREADY_SENT: '오늘 이미 이 멤버에게 찌른 기록이 있습니다',

  INVALID_FCM_TOKEN: '올바르지 않은 FCM 토큰입니다',

  EVENT_NOT_FOUND: '존재하지 않는 이벤트입니다',
  COMMENT_NOT_FOUND: '존재하지 않는 댓글입니다',
  COMMENT_EVENT_MISMATCH: '댓글과 이벤트가 일치하지 않습니다',
  UNAUTHORIZED_ACTION: '권한이 없는 요청입니다',

  REACTION_NOT_FOUND: '존재하지 않는 반응입니다',
  REACTION_EVENT_MISMATCH: '반응과 이벤트가 일치하지 않습니다',

  INVALID_EMAIL: '올바르지 않은 이메일 형식입니다',
  INVALID_EMAIL_PWD: '이메일 또는 비밀번호가 올바르지 않습니다',
  EVENT_GROUP_MISMATCH: '이벤트와 그룹이 일치하지 않습니다',
  // 중복된 이메일
  DUPLICATE_ACCOUNT_EMAIL: '이미 가입된 이메일입니다. 로그인해주세요',
  UNVERIFIED_EMAIL_EXISTS:
    '인증되지 않은 이메일입니다. 인증 메일을 다시 발송했습니다',
  // 비밀번호는 최소 8자 이상
  INVALID_PASSWORD: '비밀번호는 최소 8자 이상이어야 합니다',

  NOT_GROUP_MEMBER: '그룹의 멤버가 아닙니다',
  INVALID_DATE_RANGE: '시작 날짜가 종료 날짜보다 늦습니다',

  // 해당하는 사용자를 찾을 수 없습니다
  NOT_FOUND_MEMBER: '해당하는 사용자를 찾을 수 없습니다',

  // 가입되지 않은 이메일입니다.
  NOT_FOUND_EMAIL: '가입되지 않은 이메일입니다',
  // 이미 인증된 이메일입니다.
  ALREADY_VERIFIED_EMAIL: '이미 인증된 이메일입니다',
  INVALID_REQUEST_ARGUMENT: '입력된 값을 다시 확인해주세요',
  NOT_MEMBER_TICKET_OWNER: '해당 예매 티켓의 주인이 아닙니다',
  NOT_ENTRY_TIME: '입장 가능한 시간이 아닙니다',
  EXPIRED_ENTRY_CODE: '만료된 입장 코드입니다',
  INVALID_ENTRY_CODE: '올바르지 않은 입장코드입니다',
  INVALID_TICKET_OPEN_TIME: '티켓 오픈 시간은 공연 시작 이전 이어야 합니다',
  INVALID_STAGE_START_TIME: '공연은 축제 기간 중에만 진행될 수 있습니다',
  LATE_TICKET_ENTRY_TIME: '입장 시간은 공연 시간보다 빨라야합니다',
  EARLY_TICKET_ENTRY_TIME: '입장 시간은 공연 시작 12시간 이내여야 합니다',
  EARLY_TICKET_ENTRY_THAN_OPEN: '입장 시간은 티켓 오픈 시간 이후여야합니다',
  TICKET_SOLD_OUT: '매진된 티켓입니다',
  INVALID_FESTIVAL_DURATION: '축제 시작 일은 종료일 이전이어야 합니다',
  INVALID_FESTIVAL_START_DATE: '축제 시작 일자는 과거일 수 없습니다',
  INVALID_TICKET_CREATE_TIME:
    '티켓 예매 시작 후 새롭게 티켓을 발급할 수 없습니다',
  OAUTH2_NOT_SUPPORTED_SOCIAL_TYPE: '해당 OAuth2 제공자는 지원되지 않습니다',
  RESERVE_TICKET_OVER_AMOUNT: '예매 가능한 수량을 초과했습니다',
  NEED_STUDENT_VERIFICATION: '학생 인증이 필요합니다',
  OAUTH2_INVALID_TOKEN: '잘못된 OAuth2 토큰입니다',
  ALREADY_STUDENT_VERIFIED: '이미 학교 인증이 완료된 사용자입니다',
  DUPLICATE_STUDENT_EMAIL: '이미 인증된 이메일입니다',
  TICKET_CANNOT_RESERVE_STAGE_START:
    '공연의 시작 시간 이후로 예매할 수 없습니다',
  INVALID_STUDENT_VERIFICATION_CODE: '올바르지 않은 학생 인증 코드입니다',
  DELETE_CONSTRAINT_FESTIVAL: '공연이 등록된 축제는 삭제할 수 없습니다',
  DELETE_CONSTRAINT_STAGE: '티켓이 등록된 공연은 삭제할 수 없습니다',
  DELETE_CONSTRAINT_SCHOOL:
    '학생 또는 축제에 등록된 학교는 삭제할 수 없습니다.',
  DUPLICATE_SCHOOL: '이미 존재하는 학교 정보입니다.',
  VALIDATION_FAIL: '검증이 실패하였습니다',
  INVALID_FESTIVAL_FILTER: '유효하지 않은 축제의 필터 값입니다',
  SCHOOL_DELETE_CONSTRAINT_EXISTS_STUDENT:
    '학생이 등록된 학교는 삭제할 수 없습니다',
  SCHOOL_DELETE_CONSTRAINT_EXISTS_FESTIVAL:
    '축제가 등록된 학교는 삭제할 수 없습니다',
  DUPLICATE_SCHOOL_NAME: '이미 존재하는 학교의 이름입니다',
  DUPLICATE_SCHOOL_DOMAIN: '이미 존재하는 학교의 도메인입니다',
  INVALID_PAGING_MAX_SIZE: '최대 size 값을 초과했습니다',
  INVALID_NUMBER_FORMAT_PAGING_SIZE: 'size는 1 이상의 정수 형식이어야 합니다',
  FESTIVAL_DELETE_CONSTRAINT_EXISTS_STAGE:
    '공연이 등록된 축제는 삭제할 수 없습니다',
  FESTIVAL_UPDATE_OUT_OF_DATE_STAGE_START_TIME:
    '축제에 등록된 공연 중 변경하려는 날짜에 포함되지 않는 공연이 있습니다',
  BOOKMARK_LIMIT_EXCEEDED: '최대 북마크 갯수를 초과했습니',
  BROAD_SEARCH_KEYWORD: '더 자세한 검색어로 입력해야합니다',
  INVALID_KEYWORD: '유효하지 않은 키워드 입니다',
  DUPLICATE_SOCIAL_MEDIA: '이미 존재하는 소셜미디어 입니다',
  OAUTH2_INVALID_CODE: '잘못된 OAuth2 Code 입니다',
  OPEN_ID_NOT_SUPPORTED_SOCIAL_TYPE: '해당 OpenId 제공자는 지원되지 않습니다',
  OPEN_ID_INVALID_TOKEN: '잘못된 OpenID 토큰입니다',
  NOT_SUPPORT_FILE_EXTENSION: '해당 파일의 확장자는 허용되지 않습니다',
  DUPLICATE_ARTIST_NAME: '이미 존재하는 아티스트의 이름입니다',

  // 401
  EXPIRED_AUTH_TOKEN: '만료된 로그인 토큰입니다',
  INVALID_AUTH_TOKEN: '올바르지 않은 로그인 토큰입니다',
  NOT_BEARER_TOKEN_TYPE: 'Bearer 타입의 토큰이 아닙니다',
  NEED_AUTH_TOKEN: '로그인이 필요한 서비스입니다',
  INCORRECT_PASSWORD_OR_ACCOUNT: '비밀번호가 틀렸거나, 해당 계정이 없습니다',
  DUPLICATE_ACCOUNT_USERNAME: '해당 계정이 존재합니다',
  INVALID_REFRESH_TOKEN:
    '존재하지 않은 리프래쉬 토큰으로 재발급 요청을 했습니다',
  EXPIRED_REFRESH_TOKEN: '만료된 리프래쉬 토큰입니다',

  // 403
  NOT_ENOUGH_PERMISSION: '해당 권한이 없습니다',
  INVALID_SOCIAL_MEDIA: '이미 가입한 소셜미디어입니다',

  // 404
  NOT_FOUND: '해당 리소스를 찾을 수 없습니다',
  SOCIAL_MEDIA_NOT_FOUND: '존재하지 않는 소셜미디어입니다',
  ACTUATOR_NOT_FOUND: '존재하지 않는 Actuator 경로입니다',
  GROUP_NOT_FOUND: '유효하지 않은 그룹 ID입니다',

  // 429
  TOO_FREQUENT_REQUESTS: '너무 잦은 요청입니다. 잠시 후 다시 시도해주세요',

  // 500
  INTERNAL_SERVER_ERROR: '서버 내부에 문제가 발생했습니다',
  OAUTH2_PROVIDER_NOT_RESPONSE: 'OAuth2 제공자 서버에 문제가 발생했습니다',
  FOR_TEST_ERROR: '테스트용 에러입니다',
  FAIL_SEND_FCM_MESSAGE: 'FCM Message 전송에 실패했습니다',
  TICKET_SEQUENCE_DATA_ERROR:
    '입장 순서 값의 데이터 정합성에 문제가 발생했습니다',
  OAUTH2_INVALID_REQUEST: '알 수 없는 OAuth2 에러가 발생했습니다',
  OPEN_ID_PROVIDER_NOT_RESPONSE: 'OpenID 제공자 서버에 문제가 발생했습니다',
  FILE_UPLOAD_ERROR: '파일 업로드 중 에러가 발생했습니다',

  // // 회원가입/인증 관련
  // DUPLICATE_ACCOUNT_EMAIL: '이미 가입된 이메일입니다. 로그인해주세요.',
  // UNVERIFIED_EMAIL_EXISTS:
  //   '인증되지 않은 이메일입니다. 인증 메일을 다시 발송했습니다.',
  // INVALID_PASSWORD: '비밀번호는 최소 8자 이상이어야 합니다.',
  // INVALID_EMAIL: '올바르지 않은 이메일 형식입니다.',
  // INVALID_EMAIL_PWD: '이메일 또는 비밀번호가 올바르지 않습니다.',

  // // 토큰/인증 관련
  // EXPIRED_AUTH_TOKEN: '만료된 로그인 토큰입니다.',
  // INVALID_AUTH_TOKEN: '올바르지 않은 로그인 토큰입니다.',
  // NEED_AUTH_TOKEN: '로그인이 필요한 서비스입니다.',

  // // 소셜 로그인 관련
  // DIFFERENT_SOCIAL_ACCOUNT: '다른 소셜 계정으로 가입된 이메일입니다.',
  // EMAIL_REGISTERED_WITH_SOCIAL: '이미 소셜 계정으로 가입된 이메일입니다.',

  // // 기본 에러
  DEFAULT: '문제가 발생했어요. 잠시 후 다시 시도해주세요.',

  // INVITATION_ALREADY_PROCESSED: '이미 처리된 초대입니다.',
  // NOT_FOUND_UNIT_AREA: '존재하지 않는 세대 정보입니다.',
} as const;

// 사용 예시:
export const getErrorMessage = (errorCode: keyof typeof ERROR_CODE) => {
  return ERROR_CODE[errorCode] || ERROR_CODE.DEFAULT;
};

export const getError = (errorCode: keyof typeof ERROR_CODE) => {
  return {
    errorCode,
    errorMessage: getErrorMessage(errorCode),
  };
};
