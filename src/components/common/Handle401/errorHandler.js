import ROUTES from "../../../routes/Routes";
export const errorHandler = (error, navigate) => {
  const condition = error?.response?.status;
  if (condition == 401) navigate(ROUTES?.sessionExpired);
};
