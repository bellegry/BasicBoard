// 실시간 체크
// ID 유효성 검사
export function validateUserId(userId, errorElement) {
  if (userId.length < 4) {
    errorElement.textContent = "ID는 최소 4자 이상이어야 합니다.";
    errorElement.style.color = "red";
    return false;
  } else {
    errorElement.textContent = "";
    return true;
  }
}

// 이메일 유효성 검사
export function validateEmail(email, errorElement) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errorElement.textContent = "Email 형식이 아닙니다.";
    errorElement.style.color = "red";
    return false;
  } else {
    errorElement.textContent = "";
    return true;
  }
}

// 비밀번호 유효성 검사
export function validatePassword(password, errorElement) {
  if (password.length < 6) {
    errorElement.textContent = "비밀번호는 최소 6자 이상이어야 합니다.";
    errorElement.style.color = "red";
    return false;
  } else {
    errorElement.textContent = "";
    return true;
  }
}

// 비밀번호 일치 여부 검사
export function validatePasswordMatch(password, confirmPassword, errorElement) {
  if (password !== confirmPassword) {
    errorElement.textContent = "비밀번호가 일치하지 않습니다.";
    errorElement.style.color = "red";
    return false;
  } else {
    errorElement.textContent = "비밀번호가 일치합니다.";
    errorElement.style.color = "green";
    return true;
  }
}

// 전화번호 유효성 검사
export function validatePhone(phone, errorElement) {
  // 숫자가 아닌 문자가 포함되었는지 확인하는 정규식 (숫자가 아닌 문자가 포함된 경우)
  const nonNumericRegex = /[^0-9]/;

  // 전화번호 길이를 확인하는 정규식 (10~11자리 숫자)
  const phoneLengthRegex = /^[0-9]{10,11}$/;

  if (nonNumericRegex.test(phone)) {
    // 숫자가 아닌 문자가 포함된 경우
    errorElement.textContent = "-를 제외한 숫자만 입력해주세요.";
    errorElement.style.color = "red";
    return false;
  } else if (!phoneLengthRegex.test(phone)) {
    // 전화번호가 10~11자리가 아닌 경우
    errorElement.textContent = "연락처는 10~11자리 숫자여야 합니다.";
    errorElement.style.color = "red";
    return false;
  } else {
    // 모든 조건을 만족하는 경우
    errorElement.textContent = "";
    return true;
  }
}

// 버튼 입력시 서버에서 중복검사
// ID 중복 확인 함수
export async function checkUserId(userId, userIdCheckMessageElement) {
  try {
    const response = await fetch(`/api/user/check-id?userId=${userId}`);
    const data = await response.json();

    if (response.ok) {
      userIdCheckMessageElement.textContent = "사용가능한 ID입니다.";
      userIdCheckMessageElement.style.color = "green";
      return true;
    } else {
      userIdCheckMessageElement.textContent = data.message || "사용중인 ID입니다!";
      userIdCheckMessageElement.style.color = "red";
      return false;
    }
  } catch (error) {
    userIdCheckMessageElement.textContent = "아이디를 체크하는 도중 에러가 발생했습니다.";
    userIdCheckMessageElement.style.color = "red";
    return false;
  }
}

// 이메일 중복 확인 함수
export async function checkEmail(email, emailCheckMessageElement) {
  try {
    const response = await fetch(`/api/user/check-email?email=${email}`);
    const data = await response.json();

    if (response.ok) {
      emailCheckMessageElement.textContent = "사용가능한 Email입니다.";
      emailCheckMessageElement.style.color = "green";
      return true;
    } else {
      emailCheckMessageElement.textContent = data.message || "사용중인 Email입니다!";
      emailCheckMessageElement.style.color = "red";
      return false;
    }
  } catch (error) {
    emailCheckMessageElement.textContent = "Email을 체크하는 도중 에러가 발생했습니다!";
    emailCheckMessageElement.style.color = "red";
    return false;
  }
}
