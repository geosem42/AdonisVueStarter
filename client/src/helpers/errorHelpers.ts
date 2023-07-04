export function getErrorMessage(error: any): string {
  const errorMessages: { [key: string]: string } = {
    E_INVALID_AUTH_UID: "Invalid email address.",
    E_INVALID_AUTH_PASSWORD: "Invalid password.",
    E_DUPLICATE_EMAIL: "This email address is already taken.",
    E_SERVER_ERROR: "Server error. Please try again later.",
    E_AUTHENTICATION_ERROR: "You are not authenticated. Please log in.",
    E_AUTHORIZATION_ERROR: "You are not authorized to perform this action."
    // add more custom messages here
  };

  // Check if error is from axios and extract server message
  if (error && error.response && error.response.data && error.response.data.errors) {
    const serverMessage = error.response.data.errors[0].message;
    const errorCode = serverMessage.split(':')[0]; // Extract the error code before the colon
    return errorMessages[errorCode] || "An unknown error occurred";
  }

  // default error message
  return "An unknown error occurred";
}