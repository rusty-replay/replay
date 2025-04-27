export const ERROR_CODE = {
  ValidationError: '요청값 유효성 검사에 실패했습니다',
  DuplicateAccountEmail: '이미 등록된 이메일입니다. 로그인해주세요',
  InvalidPassword: '비밀번호는 최소 8자 이상이어야 합니다',
  InvalidEmailPwd: '잘못된 자격 증명입니다',
  NotRefreshToken: '잘못된 리프레시 토큰입니다',
  InvalidRefreshToken: '리프레시 토큰이 유효하지 않습니다',
  InvalidApiKey: '유효하지 않은 API 키입니다',
  AuthenticationFailed: '인증에 실패했습니다',
  ExpiredAuthToken: '로그인 토큰이 만료되었습니다',
  InvalidAuthToken: '유효하지 않은 로그인 토큰입니다',
  NotEnoughPermission: '권한이 부족합니다',
  MemberNotFound: '사용자를 찾을 수 없습니다',
  GroupNotFound: '유효하지 않은 그룹 ID입니다',
  ProjectNotFound: '유효하지 않은 프로젝트 ID입니다',
  ErrorLogNotFound: '유효하지 않은 에러 로그 ID입니다',
  DatabaseError: '데이터베이스 오류가 발생했습니다',
  InternalError: '내부 서버 오류가 발생했습니다',
  TokenGenerationFailed: '토큰 생성에 실패했습니다',
  JwtInvalidToken: 'JWT 토큰이 유효하지 않습니다',
  JwtExpiredToken: 'JWT 토큰이 만료되었습니다',
  ExpiredRefreshToken: 'refreshToken이 만료되었습니다',
  Default: '알 수 없는 오류가 발생했습니다',
} as const;

// 사용 예시:
export const getErrorMessage = (errorCode: keyof typeof ERROR_CODE) => {
  return ERROR_CODE[errorCode] || ERROR_CODE.Default;
};

export const getError = (errorCode: keyof typeof ERROR_CODE) => {
  return {
    errorCode,
    errorMessage: getErrorMessage(errorCode),
  };
};
